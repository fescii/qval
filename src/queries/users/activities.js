// Import user and sequelize from models
const { sequelize, Sequelize } = require('../../models').models;
const { 
  userActivities, userStoriesActivities, userRepliesActivities,
  userPeopleActivities, userTopicsActivities
} = require('../raw').profile;

/**
 * @function fetchUserActivities
 * @description A query function to get the activities of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 activities
*/
const fetchUserActivities = async reqData => {
  const { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;
  
  return await sequelize.query(userActivities, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};


/**
 * @function fetchUserStoriesActivities
 * @description A query function to get the stories activities of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 activities
*/
const fetchUserStoriesActivities = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  return await sequelize.query(userStoriesActivities, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};

/**
 * @function fetchUserRepliesActivities
 * @description A query function to get the replies activities of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 activities
*/
const fetchUserRepliesActivities = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  return await sequelize.query(userRepliesActivities, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};

/**
 * @function fetchUserPeopleActivities
 * @description A query function to get the people activities of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 activities
*/
const fetchUserPeopleActivities = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  return await sequelize.query(userPeopleActivities, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};

/**
 * @function getUserTopicsActivities
 * @description A query function to get the topics activities of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 activities
*/

const fetchUserTopicsActivities = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  return await sequelize.query(userTopicsActivities, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};



module.exports = {
  fetchUserActivities, fetchUserStoriesActivities,
  fetchUserRepliesActivities, fetchUserPeopleActivities,
  fetchUserTopicsActivities
}