/**
 * @module sync.models.js
 * @description: This file contains the function to sync the database
 * @param {Object} sequelize - Sequelize object
 * @returns {Object} - Returns object containing the syncDb function
 */
module.exports = (sequelize) => {

  /**
   * @function syncDb
   * @name syncDb
   * @description Syncs the database with the models
   * @param {Object} data - Data object containing the alter property
   * @returns {Promise} - Returns the promise which resolves the sync process
  */
  const syncDb = async (data) => {
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
      if (data.alter) {
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