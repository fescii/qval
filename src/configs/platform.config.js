// Define platform config
module.exports = {
  RoleBase: {
    Owner: 'owner',
    Admin: 'admin',
    User: 'user'
  },
  Privileges: {
    Create: 'create',
    Read: 'read',
    Update: 'update',
    Delete: 'delete'
  },
  Audit: {
    Request: 'request',
    Security: 'security',
    Error: 'error',
    Action: 'action'
  },
  LogAction: {
    Create: 'create',
    Read: 'read',
    Update: 'update',
    Delete: 'delete'
  },
  StoryType: ['story', 'post', 'poll', 'article', 'blog', 'news', 'journal']
}