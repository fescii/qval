/**
 * @var {string} topUsersLoggedIn
 * @description Query to get the top trending users when logged in
 * @returns {string} - The query string
*/
const topUsersLoggedIn = /*sql*/`
  WITH user_views AS (SELECT author, COUNT(*) AS views_count FROM story.views WHERE "createdAt" > :daysAgo GROUP BY author),
  user_followers AS (SELECT "to", TRUE AS is_following FROM account.connects WHERE "from" = :user)
  SELECT u.hash, u.name, u.email, u.bio, u.picture, u.followers, u.following, u.stories, u.replies, u.verified, u.contact, COALESCE(uv.views_count, 0) AS user_views, COALESCE(uf.is_following, FALSE) AS is_following
  FROM account.users u
  LEFT JOIN  user_views uv ON u.hash = uv.author
  LEFT JOIN  user_followers uf ON u.hash = uf."to"
  WHERE  u.hash != :user
  ORDER BY user_views DESC, u.followers DESC, u.stories DESC, u.replies DESC
  LIMIT :limit OFFSET :offset;
`

/**
 * @var {string} topUsersLoggedOut
 * @description Query to get the top trending users when logged out
 * @returns {string} - The query string
*/
const topUsersLoggedOut = /*sql*/`
  WITH user_views AS (SELECT author, COUNT(*) AS views_count FROM story.views WHERE "createdAt" > :daysAgo GROUP BY author)
  SELECT u.hash, u.name, u.email, u.bio, u.picture, u.followers, u.following, u.stories, u.replies, u.verified, u.contact, COALESCE(uv.views_count, 0) AS user_views, FALSE AS is_following
  FROM account.users u
  LEFT JOIN  user_views uv ON u.hash = uv.author
  ORDER BY user_views DESC, u.followers DESC, u.stories DESC, u.replies DESC
  LIMIT :limit OFFSET :offset;
`

module.exports = {
  topUsersLoggedIn, topUsersLoggedOut
}