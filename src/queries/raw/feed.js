/**
 * @var {string} storiesLoggedIn
 * @description A query that fetches the most recent stories for a logged in user
 * @returns {string} A SQL query
*/
const storiesLoggedIn = /*sql*/ `
  WITH story_views AS (SELECT target, COUNT(*) AS views_count FROM story.views WHERE "createdAt" > :daysAgo GROUP BY target), 
  story_sections AS ( SELECT story, JSON_AGG( JSON_BUILD_ARRAY(kind, content, "order", id, title, "createdAt", "updatedAt") ORDER BY "order" ASC) AS sections FROM story.story_sections GROUP BY story)
  SELECT s.id, s.kind, s.author, s.hash, s.title, s.content, s.slug, s.topics, s.poll, s.votes, s.views, s.replies, s.likes, s.end, s."createdAt", s."updatedAt", 
  COALESCE(l.liked, false) AS liked, vt.option, COALESCE(sv.views_count, 0) AS total_views, 
  JSON_BUILD_OBJECT('id', sa.id, 'hash', sa.hash, 'bio', sa.bio, 'name', sa.name,'picture', sa.picture,'followers', sa.followers,'following', sa.following, 'stories', sa.stories, 'verified', sa.verified,'contact', sa.contact, 'replies', sa.replies,'email', sa.email, 'is_following', COALESCE(c.is_following, false)) AS story_author, 
  ss.sections AS story_sections_summary
  FROM story.stories s 
  LEFT JOIN  account.users sa ON s.author = sa.hash 
  LEFT JOIN (SELECT story, option FROM story.votes WHERE author = :user) AS vt ON s.hash = vt.story
  LEFT JOIN  story_views sv ON s.hash = sv.target
  LEFT JOIN  story_sections ss ON s.hash = ss.story
  LEFT JOIN  (SELECT story, true AS liked FROM story.likes WHERE author = :user) AS l ON s.hash = l.story
  LEFT JOIN  (SELECT "to", true AS is_following FROM account.connects WHERE "from" = :user) AS c ON sa.hash = c."to"
  WHERE s.published = true
  ORDER BY total_views DESC NULLS LAST, s."createdAt" DESC, s.replies DESC
  LIMIT :limit 
  OFFSET :offset;
`;

/**
 * @var {string} repliesLoggedIn
 * @description A query that fetches the most recent replies for a logged in user
 * @returns {string} A SQL query
*/
const repliesLoggedIn = /*sql*/`
  WITH reply_views AS ( SELECT target, COUNT(*) AS views_count FROM story.views WHERE "createdAt" > :daysAgo GROUP BY target),
  reply_likes AS ( SELECT reply, TRUE AS liked FROM story.likes WHERE author = :user),
  user_connections AS (SELECT "to", TRUE AS is_following FROM account.connects WHERE "from" = :user)
  SELECT r.kind, r.author, r.story, r.reply, r.hash, r.content, r.views, r.likes, r.replies, r."createdAt", r."updatedAt", COALESCE(rl.liked, FALSE) AS liked, COALESCE(rv.views_count, 0) AS total_views,
  JSON_BUILD_OBJECT('id', ra.id, 'hash', ra.hash, 'bio', ra.bio, 'name', ra.name, 'picture', ra.picture, 'followers', ra.followers, 'following', ra.following, 'stories', ra.stories, 'verified', ra.verified,'contact', ra.contact, 'replies', ra.replies,'email', ra.email, 'is_following', COALESCE(uc.is_following, FALSE)) AS reply_author
  FROM story.replies r
  LEFT JOIN account.users ra ON r.author = ra.hash
  LEFT JOIN reply_views rv ON r.hash = rv.target
  LEFT JOIN reply_likes rl ON r.hash = rl.reply
  LEFT JOIN user_connections uc ON ra.hash = uc."to"
  ORDER BY total_views DESC,  r.replies DESC, r.likes DESC,  r."createdAt" DESC 
  LIMIT :limit 
  OFFSET :offset;
`

/**
 * @var {string} feedStories
 * @description A query that fetches the most recent stories: when user is not logged in
 * @returns {string} A SQL query
*/
const feedStories = /*sql*/ `
  WITH story_views AS (SELECT target, COUNT(*) AS views_count FROM story.views WHERE "createdAt" > :daysAgo GROUP BY target), story_sections AS ( SELECT story, JSON_AGG( JSON_BUILD_ARRAY(kind, content, "order", id, title, "createdAt", "updatedAt") ORDER BY "order" ASC) AS sections FROM story.story_sections GROUP BY story)
  SELECT s.kind, s.author, s.hash, s.title, s.content, s.slug, s.topics, s.poll, s.votes, s.views, s.replies, s.likes, s.end, s."createdAt", s."updatedAt", false AS liked, COALESCE(sv.views_count, 0) AS total_views, 
  JSON_BUILD_OBJECT('id', sa.id, 'hash', sa.hash, 'bio', sa.bio, 'name', sa.name,'picture', sa.picture,'followers', sa.followers,'following', sa.following, 'stories', sa.stories, 'verified', sa.verified,'contact', sa.contact, 'replies', sa.replies,'email', sa.email, 'is_following', false) AS story_author, 
  ss.sections AS story_sections_summary
  FROM story.stories s 
  LEFT JOIN  story_views sv ON s.hash = sv.target
  LEFT JOIN  account.users sa ON s.author = sa.hash 
  LEFT JOIN  story_sections ss ON s.hash = ss.story
  WHERE s.published = true
  ORDER BY total_views DESC NULLS LAST, s."createdAt" DESC, s.replies DESC
  LIMIT :limit 
  OFFSET :offset;
`;

/**
 * @var {string} feedReplies
 * @description A query that fetches the most recent replies: when user is not logged in
 * @returns {string} A SQL query
*/
const feedReplies = /*sql*/`
  WITH reply_views AS ( SELECT target, COUNT(*) AS views_count FROM story.views WHERE "createdAt" > :daysAgo GROUP BY target)
  SELECT r.kind, r.author, r.story, r.reply, r.hash, r.content, r.views, r.likes, r.replies, r."createdAt", r."updatedAt", false AS liked, COALESCE(rv.views_count, 0) AS total_views,
  JSON_BUILD_OBJECT('id', ra.id, 'hash', ra.hash, 'bio', ra.bio, 'name', ra.name, 'picture', ra.picture, 'followers', ra.followers, 'following', ra.following, 'stories', ra.stories, 'verified', ra.verified,'contact', ra.contact, 'replies', ra.replies,'email', ra.email, 'is_following', false) AS reply_author
  FROM story.replies r
  LEFT JOIN reply_views rv ON r.hash = rv.target
  LEFT JOIN account.users ra ON r.author = ra.hash
  ORDER BY total_views DESC,  r.replies DESC, r.likes DESC,  r."createdAt" DESC
  LIMIT :limit 
  OFFSET :offset;
`

module.exports = {
  storiesLoggedIn, repliesLoggedIn, feedStories, feedReplies
}