// Import user and sequelize from models
const { sequelize, Sequelize } = require('../../models').models;
const {
  userNotifications, userUnreadNotifications, userReadNotifications,
  userStoriesNotifications, userRepliesNotifications, userTopicsNotifications,
  userPeopleNotifications
} = require('../raw').profile;

const { Activity } = require('../../models').models;


/**
 * @function fetchUserNotifications
 * @description A query function to get the notifications of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 notifications
*/
const fetchUserNotifications = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;
  
  return await sequelize.query(userNotifications, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};

/**
 * @function  totalUnreadNotifications
 * @description A query that fetches total unread notifications by a logged in user
 * @returns {Number} A number of unread notifications
*/
const totalUnreadNotifications = async user => {
  return await Activity.count({ where: { to: user, read: false } });
}

/**
 * @function fetchUserUnreadNotifications
 * @description A query function to get the unread notifications of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 notifications
*/
const fetchUserUnreadNotifications = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;
  
  return await sequelize.query(userUnreadNotifications, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};

/**
 * @function fetchUserReadNotifications
 * @description A query function to get the read notifications of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 notifications
*/
const fetchUserReadNotifications = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;
  
  return await sequelize.query(userReadNotifications, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};

/**
 * @function fetchStoriesNotifications
 * @description A query function to get the stories notifications of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 notifications
*/
const fetchStoriesNotifications = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;
  
  return await sequelize.query(userStoriesNotifications, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};

/**
 * @function fetchRepliesNotifications
 * @description A query function to get the replies notifications of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 notifications
*/
const fetchRepliesNotifications = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;
  
  return await sequelize.query(userRepliesNotifications, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};

/**
 * @function fetchTopicsNotifications
 * @description A query function to get the topics notifications of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 notifications
*/
const fetchTopicsNotifications = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;
  
  return await sequelize.query(userTopicsNotifications, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};


/**
 * @function fetchPeopleNotifications
 * @description A query function to get the stories notifications of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 notifications
*/
const fetchPeopleNotifications = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;
  
  return await sequelize.query(userPeopleNotifications, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};

module.exports = {
  fetchUserNotifications, totalUnreadNotifications,
  fetchUserUnreadNotifications, fetchUserReadNotifications,
  fetchStoriesNotifications, fetchRepliesNotifications,
  fetchTopicsNotifications, fetchPeopleNotifications
}