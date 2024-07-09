// Import find topic by hash and by slug
const {
  getUserByHash, getUserProfile
} = require('../../queries').userQueries;


/**
 * @controller {get} /t/:slug(:hash) Topic
 * @name getPerson
 * @description This route will the user page for the app.
 * @returns Page: Renders user page
*/
const getPerson = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  // get user from the request object
  const currentUser = req.user;

  // convert the user hash to lowercase
  param = param.toUpperCase();

  // query the database for the user
  const { user, error } = await getUserByHash(param, currentUser.hash);

  // if there is an error, render the error page
  if (error) { 
    return res.status(500).render('500')
  }

  // if there is no user, render the 404 page
  if (!user) {
    return res.status(404).render('404')
  }

  // add tab to the user object
  user.tab = 'stories';

  res.render('pages/user', {
    data: user
  })
}

/**
 * @controller {get} /t/:slug(:hash) Topic
 * @name getUserReplies
 * @description This route will the user page for the app.
 * @returns Page: Renders user page
*/
const getUserReplies = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  // get user from the request object
  const currentUser = req.user;

  // convert the user hash to lowercase
  param = param.toUpperCase();

  // query the database for the user
  const { user, error } = await getUserByHash(param, currentUser.hash);

  // if there is an error, render the error page
  if (error) {
    return res.status(500).render('500')
  }

  // if there is no user, render the 404 page
  if (!user) {
    return res.status(404).render('404')
  }

  // add tab to the user object
  user.tab = 'replies';

  res.render('pages/user', {
    data: user
  })
}

/**
 * @controller {get} /u/:hash/followers
 * @name getUserFollowers
 * @description This route will the user page for the app.
 * @returns Page: Renders user page
*/
const getUserFollowers = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  // get user from the request object
  const currentUser = req.user;

  // convert the user hash to lowercase
  param = param.toUpperCase();

  // query the database for the user
  const { user, error } = await getUserByHash(param, currentUser.hash);

  // if there is an error, render the error page
  if (error) { 
    return res.status(500).render('500')
  }

  // if there is no user, render the 404 page
  if (!user) {
    return res.status(404).render('404')
  }

  // add tab to the user object
  user.tab = 'followers';

  res.render('pages/user', {
    data: user
  })
}

/**
 * @controller {get} /u/:hash/following
 * @name getUserFollowing
 * @description This route will the user page for the app.
 * @returns Page: Renders user page || error page
*/
const getUserFollowing = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  // get user from the request object
  const currentUser = req.user;

  // convert the user hash to lowercase
  param = param.toUpperCase();

  // query the database for the user
  const { user, error } = await getUserByHash(param, currentUser.hash);

  // if there is an error, render the error page
  if (error) {
    return res.status(500).render('500')
  }

  // if there is no user, render the 404 page
  if (!user) {
    return res.status(404).render('404')
  }

  // add tab to the user object
  user.tab = 'following';

  res.render('pages/user', {
    data: user
  })
}

/**
 * @controller {get} /settings
 * @name getAccount
 * @description This route will the user settings page for the app.
 * @returns Page: Renders settings page || error page
*/
const getAccount = async (req, res) => {
  // get user from the request object
  if(!req.user || !req.user.hash) {
    // redirect to the login page
    return res.redirect('/join/login');
  }
  const hash = req.user.hash;

  // get the params from the request
  let current = req.params.current;

  // query the database for the user
  const { user, error } = await getUserProfile(hash);

  // if there is an error, render the error page
  if (error) {
    console.log(error)
    return res.status(500).render('500')
  }

  // if there is no user, render the 404 page
  if (!user) {
    return res.status(404).render('404')
  }

  // update the user object
  if (!user.contact) {
    user.contact = {
      email: null,
      x: null,
      threads: null,
      phone: null,
      link: null,
      linkedin: null
    }
  }
  else {
    user.contact = {
      email: user.contact.email ? user.contact.email : null,
      x: user.contact.x ? user.contact.x : null,
      threads: user.contact.threads ? user.contact.threads : null,
      phone: user.contact.phone ? user.contact.phone : null,
      link: user.contact.link ? user.contact.link : null,
      linkedin: user.contact.linkedin ? user.contact.linkedin : null,
    }
  }

  // add tab to the user object
  user.tab = current ? current : 'stats';

  res.render('pages/settings', {
    data: user
  })
}

// Export all public content controllers
module.exports = {
  getPerson, getUserReplies, getUserFollowers, getUserFollowing, getAccount
}