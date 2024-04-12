module.exports = (sequelize) => {
  // Function to sync database ( Useful for development )
  const syncDb = async (alter) => {
    const schemas = ['topic', 'account', 'platform', 'story'];
    for (const schema of schemas) {
      await sequelize.createSchema(schema).catch((error) => {
        if (error.code === "42P06") {
          console.log(`Schema ${schema} already exists`);
        }
        else {
          console.error(`Error creating schemas ${schema}: exits`);
        }
      });
    }
    try {
      if (alter) {
        console.log('Altering Db Changes...');
        sequelize.sync({ alter: true }).then(() => {
          console.log('All Changes Synced!');
        });
      }
      else {
        console.log('No Db Changes detected, Everything is Synced!');
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