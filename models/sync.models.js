module.exports = (sequelize) => {
  // Function to sync database ( Useful for development )
  const syncDb = async (alter) => {
    try {
      if (alter) {
        console.log('Altering Db Changes...');
        sequelize.sync({ alter: true }).then(() => {
          console.log('All Changes Synced!');
        });
      }
      else {
        console.log('No Db Changes detected, Everything is Synced!');
        // console.log('Syncing Db Changes...');
        // sequelize.sync().then(() => {
        //   console.log('All Changes Synced!');
        // });
      }
    } 
    catch (e) {
      console.log("Database isn't created, Creating & Syncing Db...");
      console.error(e);
      sequelize.sync().then(() => {
        console.log("Database synchronized...")
      });
    }
  }

  return { syncDb };
}