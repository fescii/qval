/**
 * @var {string} recentLoggedIn
 * @description A query that fetches the most recent stories for a logged in user
 * @returns {string} A SQL query
*/
const recentLoggedIn = /*sql*/ `
  WITH story_sections AS ( SELECT story, JSON_AGG( JSON_BUILD_ARRAY(kind, content, "order", id, title, "createdAt", "updatedAt") ORDER BY "order") AS sections FROM story.story_sections GROUP BY story)
  SELECT s.kind, s.author, s.hash, s.title, s.content, s.slug, s.topics, s.poll, s.votes, s.views, s.replies, s.likes, s.end, s."createdAt", s."updatedAt", 
  COALESCE(l.liked, false) AS liked, vt.option 
  JSON_BUILD_OBJECT('id', sa.id, 'hash', sa.hash, 'bio', sa.bio, 'name', sa.name,'picture', sa.picture,'followers', sa.followers,'following', sa.following, 'stories', sa.stories, 'verified', sa.verified, 'replies', sa.replies,'email', sa.email, 'is_following', COALESCE(c.is_following, false)) AS story_author, 
  COALESCE(c.is_following, false) AS story_author_is_following, ss.sections AS story_sections_summary
  FROM story.stories s 
  LEFT JOIN  account.users sa ON s.author = sa.hash 
  LEFT JOIN (SELECT story, option FROM story.votes WHERE author = :user) AS vt ON s.hash = vt.story
  LEFT JOIN  story_sections ss ON s.hash = ss.story
  LEFT JOIN  (SELECT story, true AS liked FROM story.likes WHERE author = :user) AS l ON s.hash = l.story
  LEFT JOIN  (SELECT "to", true AS is_following FROM account.connects WHERE "from" = :user) AS c ON sa.hash = c."to"
  ORDER BY s."createdAt" DESC, s.replies DESC
  LIMIT 10;
`;

/**
 * @var {string} recentStories
 * @description A query that fetches the most recent stories: when user is not logged in
 * @returns {string} A SQL query
*/
const recentStories = /*sql*/ `
  WITH story_sections AS ( SELECT story, JSON_AGG( JSON_BUILD_ARRAY(kind, content, "order", id, title, "createdAt", "updatedAt") ORDER BY "order") AS sections FROM story.story_sections GROUP BY story)
  SELECT s.kind, s.author, s.hash, s.title, s.content, s.slug, s.topics, s.poll, s.votes, s.views, s.replies, s.likes, s.end, s."createdAt", s."updatedAt", false AS liked, null AS option, 
  JSON_BUILD_OBJECT('id', sa.id, 'hash', sa.hash, 'bio', sa.bio, 'name', sa.name,'picture', sa.picture,'followers', sa.followers,'following', sa.following, 'stories', sa.stories, 'verified', sa.verified, 'replies', sa.replies,'email', sa.email) AS story_author, 
  ss.sections AS story_sections_summary
  FROM story.stories s
  LEFT JOIN  account.users sa ON s.author = sa.hash 
  LEFT JOIN  story_sections ss ON s.hash = ss.story
  ORDER BY s."createdAt" DESC, s.replies DESC
  LIMIT 10;
`;

/**
 * @var {String} followingStories
 * @description A query that fetches the most recent stories from users that the logged in user is following
 * @returns {String} A SQL query
*/
const followingStories = /*sql*/ `
  WITH story_sections AS ( SELECT story, JSON_AGG(JSON_BUILD_ARRAY(kind, content, "order", id, title, "createdAt", "updatedAt") ORDER BY "order") AS sections FROM story.story_sections GROUP BY story),
  user_connections AS (SELECT "to" AS followed_author FROM account.connects WHERE "from" = :user)
  SELECT s.id, s.kind, s.author, s.hash, s.title, s.content, s.slug, s.topics, s.poll, s.votes, s.views, s.replies, s.likes, s.end, s."createdAt", s."updatedAt", COALESCE(l.liked, false) AS liked, vt.option,
  JSON_BUILD_OBJECT('id', sa.id,'hash', sa.hash, 'bio', sa.bio,'name', sa.name,'picture', sa.picture,'followers', sa.followers,'following', sa.following,'stories', sa.stories,'verified', sa.verified,'replies', sa.replies, 'email', sa.email, 'is_following', true) AS story_author,
  ss.sections AS story_sections_summary
  FROM  story.stories s 
  INNER JOIN user_connections uc ON s.author = uc.followed_author 
  INNER JOIN  account.users sa ON s.author = sa.hash 
  LEFT JOIN (SELECT story, option FROM story.votes WHERE author = :user) AS vt ON s.hash = vt.story
  LEFT JOIN  story_sections ss ON s.hash = ss.story
  LEFT JOIN (SELECT story, true AS liked FROM story.likes WHERE author = :user) AS l ON s.hash = l.story
  ORDER BY s."createdAt" DESC, s.replies DESC 
  LIMIT 10;
`

module.exports = {
  recentLoggedIn, recentStories, followingStories
}