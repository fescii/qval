
/**
 * @var {String} getStoryLikesThisMonth
 * @description A query counts the total number of likes a user has received on their stories in the current month
 * @returns {String} A SQL query
*/
const getStoryLikesThisMonth = /*sql*/ `
  SELECT COALESCE(SUM(like_count), 0) AS total_likes
  FROM (SELECT COUNT(*) AS like_count FROM story.stories s JOIN story.likes l ON s.hash = l.story WHERE s.author = :user AND l."createdAt" >= :start_date) AS user_likes;
`;

/**
 * @var {String} getStoryLikesLastMonth
 * @description A query counts the total number of likes a user has received on their stories in the last month(between 30 and 60 days ago)
 * @returns {String} A SQL query
*/
const getStoryLikesLastMonth = /*sql*/ `
  SELECT COALESCE(SUM(like_count), 0) AS total_likes
  FROM (SELECT COUNT(*) AS like_count FROM story.stories s JOIN story.likes l ON s.hash = l.story WHERE s.author = :user AND l."createdAt" >= :start_date AND l."createdAt" <= :end_date) AS user_likes;
`;

/**
 * @var {String} getStroryRepliesThisMonth
 * @description A query counts the total number of replies a user has received on their stories in the current month
 * @returns {String} A SQL query
*/
const getStoryRepliesThisMonth = /*sql*/ `
  SELECT COALESCE(SUM(reply_count), 0) AS total_replies
  FROM (SELECT COUNT(*) AS reply_count FROM story.stories s JOIN story.replies r ON s.hash = r.story WHERE s.author = :user AND r."createdAt" >= :start_date) AS user_replies;
`;

/**
 * @var {String} getStoryRepliesLastMonth
 * @description A query counts the total number of replies a user has received on their stories in the last month(between 30 and 60 days ago)
 * @returns {String} A SQL query
*/
const getStoryRepliesLastMonth = /*sql*/ `
  SELECT COALESCE(SUM(reply_count), 0) AS total_replies
  FROM (SELECT COUNT(*) AS reply_count FROM story.stories s JOIN story.replies r ON s.hash = r.story WHERE s.author = :user AND r."createdAt" >= :start_date AND r."createdAt" <= :end_date) AS user_replies;
`;

/**
 * @var {String} getReplyLikesThisMonth
 * @description A query counts the total number of likes a user has received on their replies in the current month
 * @returns {String} A SQL query
*/
const getReplyLikesThisMonth = /*sql*/ `
  SELECT COALESCE(SUM(like_count), 0) AS total_likes
  FROM (SELECT COUNT(*) AS like_count FROM story.replies r JOIN story.likes l ON r.hash = l.reply WHERE r.author = :user AND l."createdAt" >= :start_date) AS user_likes;
`;

/**
 * @var {String} getReplyLikesLastMonth
 * @description A query counts the total number of likes a user has received on their replies in the last month(between 30 and 60 days ago)
 * @returns {String} A SQL query
*/
const getReplyLikesLastMonth = /*sql*/ `
  SELECT COALESCE(SUM(like_count), 0) AS total_likes
  FROM (SELECT COUNT(*) AS like_count FROM story.replies r JOIN story.likes l ON r.hash = l.reply WHERE r.author = :user AND l."createdAt" >= :start_date AND l."createdAt" <= :end_date) AS user_likes;
`;

/**
 * @var {String} getReplyRepliesThisMonth
 * @description A query counts the total number of replies a user has received on their replies in the current month
 * @returns {String} A SQL query
*/
const getReplyRepliesThisMonth = /*sql*/ `
  SELECT COALESCE(SUM(reply_count), 0) AS total_replies
  FROM (SELECT COUNT(*) AS reply_count FROM story.replies r JOIN story.replies r2 ON r.hash = r2.reply WHERE r.author = :user AND r2."createdAt" >= :start_date) AS user_replies;
`;

/**
 * @var {String} getReplyRepliesLastMonth
 * @description A query counts the total number of replies a user has received on their replies in the last month(between 30 and 60 days ago)
 * @returns {String} A SQL query
*/
const getReplyRepliesLastMonth = /*sql*/ `
  SELECT COALESCE(SUM(reply_count), 0) AS total_replies
  FROM (SELECT COUNT(*) AS reply_count FROM story.replies r JOIN story.replies r2 ON r.hash = r2.reply WHERE r.author = :user AND r2."createdAt" >= :start_date AND r2."createdAt" <= :end_date) AS user_replies;
`;



module.exports = {
  stories: {
    getStoryLikesThisMonth, getStoryLikesLastMonth,
    getStoryRepliesThisMonth, getStoryRepliesLastMonth
  },
  replies: {
    getReplyLikesThisMonth, getReplyLikesLastMonth,
    getReplyRepliesThisMonth, getReplyRepliesLastMonth
  },
}