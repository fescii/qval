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
      await sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
    }
   
    // Sync the database
    try {
      if (data.alter) {
        console.log('Altering Db Changes...');
        sequelize.sync({ alter: true }).then(() => {
          console.log('All Changes Synced!');
        });
      }
      else {
        console.log('Syncing Db...');
        sequelize.sync().then(() => {
          console.log('Database synchronized...');
        });
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