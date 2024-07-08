/**
 * @var {String} topTopicsLoggedIn
 * @description Query to find the top topics when logged in
 * @returns {String} - The query string
*/
const topTopicsLoggedIn = /* sql */ `
  WITH topic_views AS (SELECT target, COUNT(*) AS views_count FROM story.views WHERE "createdAt" > :daysAgo GROUP BY target),
  topic_followers AS (SELECT topic, TRUE AS is_following FROM topic.followers WHERE author = :user),
  topic_subscribers AS (SELECT topic, TRUE AS is_subscribed FROM topic.subscribers WHERE author = :user),
  user_connections AS (SELECT "to", TRUE AS is_following FROM account.connects WHERE "from" = :user),
  topic_sections_json AS (SELECT topic, JSON_AGG(JSON_BUILD_OBJECT('id', id, 'content', content, 'order', "order", 'title', title) ORDER BY "order" ASC) AS sections FROM topic.sections GROUP BY topic)
  SELECT t.author, t.hash, t.name, t.slug, t.summary, t.followers, t.subscribers, t.stories, t.views, COALESCE(tf.is_following, FALSE) AS is_following, COALESCE(ts.is_subscribed, FALSE) AS is_subscribed, COALESCE(tv.views_count, 0) AS total_views,
  JSON_BUILD_OBJECT('hash', ta.hash, 'bio', ta.bio, 'name', ta.name, 'picture', ta.picture, 'followers', ta.followers, 'following', ta.following, 'stories', ta.stories, 'verified', ta.verified, 'replies', ta.replies, 'email', ta.email,'is_following', COALESCE(uc.is_following, FALSE)) AS topic_author,
  COALESCE(tsj.sections, '[]'::json) AS topic_sections
  FROM topic.topics t
  LEFT JOIN account.users ta ON t.author = ta.hash
  LEFT JOIN topic_views tv ON t.hash = tv.target
  LEFT JOIN topic_followers tf ON t.hash = tf.topic
  LEFT JOIN topic_subscribers ts ON t.hash = ts.topic
  LEFT JOIN user_connections uc ON ta.hash = uc."to"
  LEFT JOIN topic_sections_json tsj ON t.hash = tsj.topic
  ORDER BY total_views DESC, t.followers DESC, t.stories DESC
  LIMIT :limit OFFSET :offset;
`

/**
 * @var {String} topTopicsLoggedOut
 * @description Query to find the top topics when logged out
 * @returns {String} - The query string
*/
const topTopicsLoggedOut = /* sql */ `
  WITH topic_views AS (SELECT target, COUNT(*) AS views_count FROM story.views WHERE "createdAt" > :daysAgo GROUP BY target),
  topic_sections_json AS (SELECT topic, JSON_AGG(JSON_BUILD_OBJECT('id', id, 'content', content, 'order', "order", 'title', title) ORDER BY "order" ASC) AS sections FROM topic.sections GROUP BY topic)
  SELECT t.author, t.hash, t.name, t.slug, t.summary, t.followers, t.subscribers, t.stories, t.views, false AS is_following, false AS is_subscribed, COALESCE(tv.views_count, 0) AS total_views, 
  JSON_BUILD_OBJECT('hash', ta.hash, 'bio', ta.bio, 'name', ta.name, 'picture', ta.picture, 'followers', ta.followers, 'following', ta.following, 'stories', ta.stories, 'verified', ta.verified, 'replies', ta.replies, 'email', ta.email,'is_following', false) AS topic_author,
  COALESCE(tsj.sections, '[]'::json) AS topic_sections
  FROM topic.topics t
  LEFT JOIN account.users ta ON t.author = ta.hash
  LEFT JOIN topic_views tv ON t.hash = tv.target
  LEFT JOIN topic_sections_json tsj ON t.hash = tsj.topic
  ORDER BY total_views DESC, t.followers DESC, t.stories DESC
  LIMIT :limit OFFSET :offset;
`

module.exports = {
  topTopicsLoggedIn, topTopicsLoggedOut
}