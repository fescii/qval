
/**
 * @controller {get} /join Join App
 * @apiName JoinApp
 * @name JoinApp
 * @description This route will render the join page for the app.
*/
const joinApp = async (_req, res) => {
  res.render('pages/logon', {
    data: {
      name: 'join',
      login: '/join/login',
      logout: '/join/logout',
      register: '/join/register',
    }
  })
}

/**
 * @controller {get} /login Login
 * @apiName Login
 * @name Login
 * @description This route will render the login page for the app.
*/
const login = async (req, res) => {
  // Get request url
  const url = req.originalUrl;

  res.render('pages/logon', {
    data: {
      name: 'login',
      requested: url,
      login: '/join/login',
      logout: '/join/logout',
      register: '/join/register',
    }
  })
}


// Export all public content controllers
module.exports = {
  joinApp, login
}