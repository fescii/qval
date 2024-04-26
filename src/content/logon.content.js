
/**
 * @controller {get} /join Join App
 * @apiName JoinApp
 * @name JoinApp
 * @apiDescription This route will render the join page for the app.
*/
const joinApp = async (req, res) => {
  res.render('pages/logon', {
    data: {
      name: 'Qval',
      login: '/api/v1/auth/login',
      logout: '/api/v1/auth/logout',
      register: '/api/v1/auth/register',
    }
  })
}


// Export all public content controllers
module.exports = {
  joinApp
}