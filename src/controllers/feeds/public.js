
/**
 * @controller {get} /search Search
 * @apiName Join
 * @name Search
 * @description This route will render the search page for the app.
*/
const home = async (req, res) => {
  res.render('pages/search', {
    data: {
      name: "Home",
    }
  })
}

// Export all public content controllers
module.exports = {
  home
}