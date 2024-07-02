// Importing the required modules, fns, configs, and utils...
const { Sequelize, Story, StorySection, Reply, User, Connect } = require('../../models').models;
const Op = Sequelize.Op;


/**
 * @function findUserStory
 * @description Query to find a topic by slug or hash when user is logged in
 * @param {String} query - The query of the topic
 * @param {String} user - The user hash
 * @returns {Object} - The topic object or null, and the error if any
*/
const findUserStory = async (query, user) => {
  try {
    // Find the story
    const story = await Story.findOne({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes', 'end', 'createdAt', 'updatedAt',
        // Check if the user has liked the story
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM story.likes WHERE likes.story = stories.hash AND likes.author = '${user}')`)),
          'liked'
        ],
        [
          Sequelize.literal(`(SELECT option FROM story.votes WHERE votes.author = '${user}' AND votes.story = stories.hash LIMIT 1)`),
          'option'
        ]
      ],
      where: {
        published: true,
        [Op.or]: [{ slug: query }, { hash: query.toUpperCase() }]
      },
      include: [
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email'],
        },
        {
          model: StorySection,
          as: 'story_sections',
          attributes: ['kind', 'content', 'order', 'id', 'title', 'content'],
          order: [['order', 'ASC']]
        }
      ]
    });

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // return the story
    const data = story.dataValues;

    // add you you to the story
    data.you = true;

    // add authenicated to the story
    data.authenticated = true;

    // return the story
    return { 
      story: data,
      error: null 
    };
  } 
  catch (error) {
    // return the error
    return { story: null, error: error };
  }
};


/**
 * @function findUserReply
 * @description a function that queries replies when user is logged in
 * @param {String} hash - The hash of the reply
 * @param {String} user - The hash of the user
 * @returns {Object} data - The reply object and error if any
*/
const findUserReply = async (hash, user) => {
  try {
    // Find the reply
    const reply = await Reply.findOne({
      attributes : ['kind', 'author', 'parent', 'hash', 'content', 'views', 'likes', 'replies', 'createdAt', 'updatedAt',
        // Check if the user has liked the reply
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM story.likes WHERE likes.reply = replies.hash AND likes.author = '${user}')`)),
          'liked'
        ]
      ],
      where: { hash },
      include: [
        {
          model: User,
          as: 'reply_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email'],
        }
      ],
    });

    // Check if the reply exists
    if (!reply) {
      return { reply: null, error: null };
    }

    // return the reply
    const data = reply.dataValues;

    // add you you to the reply
    data.you = true;

    // add authenicated to the reply
    data.authenticated = true;

    // return the reply
    return { 
      reply: data,
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { reply: null, error };
  }
}

/**
 * @function getUserStories
 * @description a function that queries stories when user is logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {String} user - The user hash
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The stories object and error if any
*/
const getUserStories = async (where, order, user, limit, offset) => {
  try {
    // Find the stories
    const stories = await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes', 'end', 'createdAt', 'updatedAt',
        // Check if the user has liked the story
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM story.likes WHERE likes.story = stories.hash AND likes.author = '${user}')`)),
          'liked'
        ]
      ],
      where: where,
      order: [order],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email'],
        },
        {
          model: StorySection,
          as: 'story_sections',
          attributes: ['kind', 'content', 'order', 'id', 'title', 'content'],
          order: [['order', 'ASC']]
        }
      ]
    });

    // Check if the stories exist
    if (stories.length < 1) {
      return { stories: null, error: null };
    }

    // return the stories: map the stories' dataValues
    return { 
      stories: stories.map(story => {
        const data = story.dataValues;
        // add you to the story data
        data.you = true;

        // add story sections to the story
        if (story.kind === 'story') {
          data.story_sections = mapFields(data.content, story.story_sections);
        }

        return data;
      }),
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { stories: null, error };
  }
}

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
 * @function getUserReplies
 * @description a function that queries replies when user is logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The replies object and error if any
*/
const getUserReplies = async (where, order, user, limit, offset) => {
  try {
    // Find the replies
    const replies = await Reply.findAll({
      attributes : ['kind', 'author', 'reply', 'story', 'hash', 'content', 'views', 'likes', 'replies', 'createdAt', 'updatedAt',
        // Check if the user has liked the reply
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM story.likes WHERE likes.reply = replies.hash AND likes.author = '${user}')`)),
          'liked'
        ]
      ],
      where: where,
      order: [order],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: 'reply_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email'],
        }
      ],
    });

    // Check if the replies exist
    if (replies.length < 1) {
      return { replies: null, error: null };
    }

    // return the replies
    return { 
      replies: replies.map(reply => {
        const data = reply.dataValues;
        // add you to the reply data
        data.you = true;
        // add authenticated to the reply data
        data.authenticated = true;

        return data;
      }),
      error: null 
    };
  }
  catch (error) {
    // return the error
    // console.log(error)
    return { replies: null, error };
  }
}

/**
 * @function fetchFollowersWhenLoggedIn
 * @description a query funtion to fetch all followers/following belonging to a particular user: when logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {String} user - The user hash
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The people object and error if any
*/
const fetchFollowersWhenLoggedIn = async (where, order, user, limit, offset) => {
  try {
    // Find the people from the connect table including the user
    const connects = await Connect.findAll({
      attributes: ['to', 'from', 'createdAt'],
      where: where,
      order: [order],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: 'from_user',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email',
            [
              Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = from_user.hash AND connects.from = '${user}')`)),
              'is_following'
            ],
          ]
        },
      ]
    });

    // Check if the connects exist
    if (connects.length === 0) {
      return null;
    }

    return connects.map(connect => {
      return {
        createdAt: connect.createdAt,
        you: connect.from_user.hash === user,
        ...connect.from_user.dataValues,
      }
    });
  }
  catch (error) {
    // throw the error
    throw error;
  }
}

/**
 * @function fetchFollowingWhenLoggedIn
 * @description a query funtion to fetch all followers/following belonging to a particular user: when logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {String} user - The user hash
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The people object and error if any
*/
const fetchFollowingWhenLoggedIn = async (where, order, user, limit, offset) => {
  try {
    // Find the people from the connect table including the user
    const connects = await Connect.findAll({
      attributes: ['to', 'from', 'createdAt'],
      where: where,
      order: [order],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: 'to_user',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email',
            [
              Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = to_user.hash AND connects.from = '${user}')`)),
              'is_following'
            ],
          ]
        },
      ]
    });

    // Check if the connects exist
    if (connects.length === 0) {
      return null;
    }

    return connects.map(connect => {
      return {
        createdAt: connect.createdAt,
        you: connect.to_user.hash === user,
        ...connect.to_user.dataValues,
      }
    });
  }
  catch (error) {
    // throw the error
    throw error;
  }
}

/**
 * @function fetchFollowersWhenLoggeOut
 * @description a query funtion to fetch all followers/following belonging to a particular user: when logged out
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The people object and error if any
*/
const fetchFollowersWhenLoggeOut = async (where, order, limit, offset) => {
  try {
    // Find the people from the connect table
    const connects = await Connect.findAll({
      attributes: ['to', 'from', 'createdAt'],
      where: where,
      order: [order],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: 'from_user',
          attributes:['hash', 'bio', 'name', 'email', 'picture', 'followers', 'following', 'stories', 'verified', 'replies']
        },
      ]
    });

    // Check if the connects exist
    if (connects.length === 0) {
      return null;
    }

    return connects.map(connect => {
      return {
        createdAt: connect.createdAt,
        you: false,
        ...connect.connect_user.dataValues,
      }
    });
  }
  catch (error) {
    // throw the error
    throw error;
  }
}

/**
 * @function fetchFollowingWhenLoggedOut
 * @description a query funtion to fetch all followers/following belonging to a particular user: when logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The people object and error if any
*/
const fetchFollowingWhenLoggedOut = async (where, order, limit, offset) => {
  try {
    // Find the people from the connect table including the user
    const connects = await Connect.findAll({
      attributes: ['to', 'from', 'createdAt'],
      where: where,
      order: [order],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: 'to_user',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email']
        },
      ]
    });

    // Check if the connects exist
    if (connects.length === 0) {
      return null;
    }

    return connects.map(connect => {
      return {
        createdAt: connect.createdAt,
        you: false,
        ...connect.to_user.dataValues,
      }
    });
  }
  catch (error) {
    // throw the error
    throw error;
  }
}




// Export the module
module.exports = {
  findUserStory, findUserReply, getUserStories, getUserReplies,
  fetchFollowersWhenLoggedIn, fetchFollowingWhenLoggedIn,
  fetchFollowersWhenLoggeOut, fetchFollowingWhenLoggedOut
};