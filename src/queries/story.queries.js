const { sequelize, Story} = require('../models').models;
const { hashNumberWithKey } = require('../hash').identityHash;
const { hashConfig } = require('../configs');


// Check if story exists
const checkIfStoryExists = async (slug) => {
  try {
    const story = await Story.findOne({
      where: {
        slug: slug
      }
    });

    if (story) {
      return {story: story, error: null};
    }
    else {
      return {story: null, error: null};
    }

  }
  catch (error) {
    console.log(error);
    return {story: null, error: error};
  }
}


// Check if story exists using hash
const findStoryByHash = async (hash) => {
  try {
    const story = await Story.findOne({
       where: { hash: hash }
    });

    // If story is returned by the query then return the story
    if (story) {
      return { story: story, error: null };
    }
    // Else return both null
    else {
      return { story: null, error: null };
    }
  }
  catch (error) {
    console.log(error);
    return { story: null, error: error };
  }
}


// Create a new story
const createStory = async (userId, data) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    const story = await Story.create({
      title: data.title,
      kind: data.kind,
      content: data.content,
      author: userId,
      body: data.body,
      topics: data.topics,
      hash: data.hash,
      slug: data.slug
    }, { transaction });

    story.hash = await hashNumberWithKey(hashConfig.story, story.id);

    await story.save({ transaction });

    // Create a section for the story created
    const section = await Section.create({
      identity: story.hash,
      target: story.id,
      name: story.title,
      description: `This is a section for the story - ${story.title}`
    }, { transaction });

    // Create an author role for the section created
    await Role.create({
      section: section.identity,
      user: userId,
      base: RoleBase.Owner,
      name: `This is a role for section - ${story.title}`,
      privileges: {
        'action': ["create", "read", "update", "delete"],
        'members': ["create", "read", "update", "delete"],
        'opinions': ["create", "read", "update", "delete"],
        'replies': ["create", "read", "update", "delete"]
      },
      expired: false
    }, { transaction });


    await transaction.commit();

    // On successfully creating the story return the story
    return { story: story, error: null };
  }

  catch (error) {
    console.log(error);
    await transaction.rollback();
    return { story: null, error: error };
  }
}

module.exports = {
  checkIfStoryExists, findStoryByHash, createStory
}
