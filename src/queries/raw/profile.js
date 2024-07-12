/**
 * @var {string} userStoriesStats
 * @description A query that fetches stories by a logged in user
 * @returns {string} A SQL query
*/
const userStoriesStats = /*sql*/ `
  WITH story_sections AS ( SELECT story, JSON_AGG( JSON_BUILD_ARRAY(kind, content, "order", id, title, "createdAt", "updatedAt") ORDER BY "order" ASC) AS sections FROM story.story_sections GROUP BY story)
  SELECT s.id, s.kind, s.author, s.hash, s.title, s.content, s.slug, s.topics, s.poll, s.votes, s.views, s.replies, s.likes, s.end, s."createdAt", s."updatedAt", 
  COALESCE(l.liked, false) AS liked, vt.option, true AS you,
  JSON_BUILD_OBJECT('id', sa.id, 'hash', sa.hash, 'bio', sa.bio, 'name', sa.name,'picture', sa.picture,'followers', sa.followers,'following', sa.following, 'stories', sa.stories, 'verified', sa.verified,'contact', sa.contact, 'replies', sa.replies,'email', sa.email, 'is_following', false) AS story_author, 
  ss.sections AS story_sections_summary
  FROM story.stories s
  LEFT JOIN  account.users sa ON s.author = sa.hash 
  LEFT JOIN (SELECT story, option FROM story.votes WHERE author = :user) AS vt ON s.hash = vt.story
  LEFT JOIN  story_sections ss ON s.hash = ss.story
  LEFT JOIN  (SELECT story, true AS liked FROM story.likes WHERE author = :user) AS l ON s.hash = l.story
  WHERE s.author = :user
  ORDER BY s.views DESC, s."createdAt" DESC, s.replies DESC
  LIMIT :limit 
  OFFSET :offset;
`;

/**
 * @var {string} userRepliesStats
 * @description A query that fetches replies by a logged in user
 * @returns {string} A SQL query
*/
const userRepliesStats = /*sql*/`
  WITH reply_likes AS ( SELECT reply, TRUE AS liked FROM story.likes WHERE author = :user)
  SELECT r.kind, r.author, r.story, r.reply, r.hash, r.content, r.views, r.likes, r.replies, r."createdAt", r."updatedAt", COALESCE(rl.liked, FALSE) AS liked, true AS you,
  JSON_BUILD_OBJECT('id', ra.id, 'hash', ra.hash, 'bio', ra.bio, 'name', ra.name, 'picture', ra.picture, 'followers', ra.followers, 'following', ra.following, 'stories', ra.stories, 'verified', ra.verified, 'contact', ra.contact, 'replies', ra.replies,'email', ra.email, 'is_following', false) AS reply_author
  FROM story.replies r
  LEFT JOIN account.users ra ON r.author = ra.hash
  LEFT JOIN reply_likes rl ON r.hash = rl.reply
  WHERE r.author = :user
  ORDER BY r.views DESC,  r.replies DESC, r.likes DESC,  r."createdAt" DESC 
  LIMIT :limit 
  OFFSET :offset;
`

/**
 * @var {string} userStories
 * @description A query that fetches stories by a logged in user
 * @returns {string} A SQL query
*/
const userStories = /*sql*/ `
  WITH story_sections AS ( SELECT story, JSON_AGG( JSON_BUILD_ARRAY(kind, content, "order", id, title, "createdAt", "updatedAt") ORDER BY "order" ASC) AS sections FROM story.story_sections GROUP BY story)
  SELECT s.id, s.kind, s.author, s.hash, s.title, s.content, s.slug, s.topics, s.poll, s.votes, s.views, s.replies, s.likes, s.end, s."createdAt", s."updatedAt", 
  COALESCE(l.liked, false) AS liked, vt.option, true AS you,
  JSON_BUILD_OBJECT('id', sa.id, 'hash', sa.hash, 'bio', sa.bio, 'name', sa.name,'picture', sa.picture,'followers', sa.followers,'following', sa.following, 'stories', sa.stories, 'verified', sa.verified,'contact', sa.contact, 'replies', sa.replies,'email', sa.email, 'is_following', false) AS story_author, 
  ss.sections AS story_sections_summary
  FROM story.stories s
  LEFT JOIN  account.users sa ON s.author = sa.hash 
  LEFT JOIN (SELECT story, option FROM story.votes WHERE author = :user) AS vt ON s.hash = vt.story
  LEFT JOIN  story_sections ss ON s.hash = ss.story
  LEFT JOIN  (SELECT story, true AS liked FROM story.likes WHERE author = :user) AS l ON s.hash = l.story
  WHERE s.author = :user
  ORDER BY s."createdAt" DESC
  LIMIT :limit 
  OFFSET :offset;
`;

/**
 * @var {string} userReplies
 * @description A query that fetches replies by a logged in user
 * @returns {string} A SQL query
*/
const userReplies = /*sql*/`
  WITH reply_likes AS ( SELECT reply, TRUE AS liked FROM story.likes WHERE author = :user),
  SELECT r.kind, r.author, r.story, r.reply, r.hash, r.content, r.views, r.likes, r.replies, r."createdAt", r."updatedAt", COALESCE(rl.liked, FALSE) AS liked, true AS you,
  JSON_BUILD_OBJECT('id', ra.id, 'hash', ra.hash, 'bio', ra.bio, 'name', ra.name, 'picture', ra.picture, 'followers', ra.followers, 'following', ra.following, 'stories', ra.stories, 'verified', ra.verified,'contact', ra.contact, 'replies', ra.replies,'email', ra.email, 'is_following', false) AS reply_author
  FROM story.replies r
  LEFT JOIN account.users ra ON r.author = ra.hash
  LEFT JOIN reply_likes rl ON r.hash = rl.reply
  WHERE r.author = :user
  ORDER BY r."createdAt" DESC 
  LIMIT :limit 
  OFFSET :offset;
`

/**
 * @var {string} userActivities
 * @description A query that fetches activities by a logged in user ordered by date(createdAt)
 * @returns {string} A SQL query
*/
const userActivities = /*sql*/`
  SELECT a.id, a.kind, a.action, a.read, a.author, a.name, a.target, a.to, a.content, a.verb, a.deleted, a."createdAt", a."updatedAt"
  FROM activity.activities a
  WHERE a.author = :user
  ORDER BY a."createdAt" DESC
  LIMIT :limit
  OFFSET :offset;
`

/**
 * @var {string} userNotifications
 * @description A query that fetches notifications by a logged in user ordered by date(createdAt) and read status
 * @returns {string} A SQL query
*/
const userNotifications = /*sql*/`
  SELECT n.id, n.id, n.kind, n.action, n.read, n.author, n.name, n.target, n.to, n.content, n.verb, n."createdAt", n."updatedAt"
  FROM activity.activities n
  WHERE n.to = :user AND n.deleted = false
  ORDER BY n."createdAt" DESC, n.read ASC
  LIMIT :limit
  OFFSET :offset;
`


module.exports = {
  userStoriesStats, userRepliesStats, userNotifications,
  userStories, userReplies, userActivities
}