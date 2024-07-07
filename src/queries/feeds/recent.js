// Import models
const { Sequelize, Story, StorySection, User, Connect } = require('../../models').models;


/**
 * @function fetchRecent
 * @description Query to finding recent stories
 * @param {String} user - The request data
 * @returns {Object} - The replies object or null, and the error if any
*/
const fetchRecent = async user => {
  try {
    
    let stories = null;

    // check if the user is logged in
    if (user) {
      stories = await findStoriesOfFollowing(user);

      // check if stories is empty
      if (stories.length <= 0) {
        stories = await findRecentStoriesWhenLoggedIn(user);
      }
    }
    else {
      stories = await findRecentStoriesWhenLoggedOut();
    }

    // create a data object
    return { 
      stories: stories,
      error: null 
    }
  }
  catch (error) {
    return { stories: null, error: error }
  }
}

// Map story fields(sections) to html
const mapFields = (content, data) => {
  let html = /*html*/`
    <div class="intro">
      ${content}
    </div>
  `;
  
  if (data.length <= 0) {
    return html;
  }
  else {
    const sections =  data.map(section => {
      const title = section.title !== null ? `<h2 class="title">${section.title}</h2>` : '';
      return /*html*/`
        <div class="section" order="${section.order}" id="section${section.order}">
          ${title}
          ${section.content}
        </div>
      `
    }).join('');

    return `${html} ${sections}`;
  }
}

/**
 * @function findStoriesOfFollowing
 * @description Query to find stories of authors that the user is following
 * @param {String} user - User hash
 * @returns {Promise} - Promise object represents the stories of authors that the user is following
*/
const findStoriesOfFollowing = async (user) => {
  try {
    const following = await Connect.findAll({
      attributes: ['to'],
      where: {
        from: user
      }
    });

    const followingHashes = following.map(follow => follow.to);

    const stories = await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes', 'end', 'createdAt', 'updatedAt',
        // Check if the user has liked the story
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM story.likes WHERE likes.story = stories.hash AND likes.author = '${user}')`)),
          'liked'
        ],
        [
          Sequelize.literal(`(SELECT option FROM story.votes WHERE votes.author = '${user}' AND votes.story = stories.hash LIMIT 1)`),
          'option'
        ],
      ],
      where: {
        author: {
          [Sequelize.Op.in]: followingHashes
        }
      },
      group: [ "stories.id", "stories.kind", "stories.author", "stories.hash", "stories.title", 
        "stories.content", "stories.slug", "stories.topics", "stories.poll", 
        "stories.votes", "stories.views", "stories.replies", "stories.likes", "stories.end", 
        "stories.createdAt", "stories.updatedAt", "story_author.id", "story_author.hash", 
        "story_author.bio","story_author.name", "story_author.picture", "story_author.followers", 
        "story_author.following", "story_author.stories", "story_author.verified", "story_author.replies", 
        "story_author.email", "story_sections.kind", "story_sections.content", "story_sections.order", 
        "story_sections.id", "story_sections.title" 
      ],
      order: [
        ['createdAt', 'DESC'],
        ['replies', 'DESC'],
      ],
      include: [
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email' ],
        },
        // Include the story sections
        {
          model: StorySection,
          as: 'story_sections',
          attributes: ['kind', 'content', 'order', 'id', 'title', 'content'],
          order: [['order', 'ASC']]
        }
      ],
      limit: 10,
      subQuery: false
    });

    // check if stories is empty
    if (stories.length <= 0) {
      return [];
    }

    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      const data = story.dataValues;
      data.story_author = story.story_author.dataValues;
      data.story_author.is_following = user === data.story_author.hash;
      data.you = user === false;
      // add story sections to the story
      if (story.kind === 'story') {
        data.story_sections = mapFields(data.content, story.story_sections);
      }
      return data;
    });

    return storiesData;
  } catch (error) {
    throw error;
  }
}

/**
 * @function findRecentStoriesWhenLoggedIn
 * @description Query to find recently created stories
 * @param {String} user - User hash
 * @returns {Promise} - Promise object represents the stories published recently
*/
const findRecentStoriesWhenLoggedIn = async user => {
  try {
    const stories = await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes', 'end', 'createdAt', 'updatedAt',
        // Check if the user has liked the story
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM story.likes WHERE likes.story = stories.hash AND likes.author = '${user}')`)),
          'liked'
        ],
        [
          Sequelize.literal(`(SELECT option FROM story.votes WHERE votes.author = '${user}' AND votes.story = stories.hash LIMIT 1)`),
          'option'
        ],
      ],
      order: [
        ['createdAt', 'DESC'],
        ['replies', 'DESC'],
      ],
      include: [
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email' ],
        },
        // Include the story sections
        {
          model: StorySection,
          as: 'story_sections',
          attributes: ['kind', 'content', 'order', 'id', 'title', 'content'],
          order: [['order', 'ASC']]
        }
      ],
      limit: 10,
      subQuery: false
    });

    // check if stories is empty
    if (stories.length <= 0) {
      return [];
    }

    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      const data = story.dataValues;
      data.story_author = story.story_author.dataValues;
      data.story_author.is_following = user === data.story_author.hash;
      data.you = user === false;
      // add story sections to the story
      if (story.kind === 'story') {
        data.story_sections = mapFields(data.content, story.story_sections);
      }
      return data;
    });

    return storiesData;
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function findRecentStoriesWhenLoggedOut
 * @description Query to find recently created stories
 * @param {String} user - User hash
 * @returns {Promise} - Promise object represents the stories published recently
*/
const findRecentStoriesWhenLoggedOut = async () => {
  try {
    const stories = await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes', 'end', 'createdAt', 'updatedAt'],
      order: [
        ['createdAt', 'DESC'],
        ['replies', 'DESC'],
      ],
      include: [
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email' ],
        },
        // Include the story sections
        {
          model: StorySection,
          as: 'story_sections',
          attributes: ['kind', 'content', 'order', 'id', 'title', 'content'],
          order: [['order', 'ASC']]
        }
      ],
      limit: 10,
      subQuery: false
    });

    // check if stories is empty
    if (stories.length <= 0) {
      return [];
    }

    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      const data = story.dataValues;
      data.story_author = story.story_author.dataValues;
      data.story_author.is_following = false;
      data.you = false;
      // add story sections to the story
      if (story.kind === 'story') {
        data.story_sections = mapFields(data.content, story.story_sections);
      }
      return data;
    });

    return storiesData;
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  fetchRecent
}