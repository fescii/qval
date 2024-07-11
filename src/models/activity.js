/**
 * @module models/user.model
 * @name account.schema
 * @param {Object} sequelize - Sequelize object
 * @param {Object} Sequelize - Sequelize module
 * @returns {Object} - Returns object containing all the models
*/
module.exports = (sequelize, Sequelize, User) => {
	/**
	 * @type {Model}
	 * @name Activity
	 * @description - This model contains all the user info
	 * @property {Number} id - Unique identifier for the user
   * @property {kind} kind - The kind of activity: an enum of 'story', 'reply', 'topic', 'user'
   * @property {action} action - The action of the activity: an enum of 'follow', 'like', 'reply', 'create', 'update', 'vote', 'subscribe'
   * @property {author} author - The author of the activity: the hash of the user
   * @property {name} name - The name of the author performing the activity
   * @property {target} target - The target of the activity can be a story, reply, topic or user
   * @property {to} to - The the target item author hash
   * @property {verb} verb - The verb of the activity: used to describe the action
   * @property {createdAt} createdAt - The date the activity was created
   * @property {updatedAt} updatedAt - The date the activity was updated
	*/
	const Activity = sequelize.define("activities", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
    kind: {
      type: Sequelize.ENUM('story', 'reply', 'topic', 'user'),
      allowNull: false,
      index: true,
    },
    action: {
      type: Sequelize.ENUM('follow', 'like', 'reply', 'create', 'update', 'vote', 'subscribe'),
      allowNull: false,
      index: true,
    },
		author: {
			type: Sequelize.STRING,
			allowNull: false,
      index: true,
		},
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
		target: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: true,
      index: true,
		},
		to: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: true,
      index: true,
		},
	},{
			schema: 'activity',
			freezeTableName: true,
			timestamps: true,
      timezone: 'UTC',
			indexes: [
				{
					fields: ['createdAt']
				}
			]
	});

	// Define associations: User --> Activity
  User.hasMany(Activity, { foreignKey: 'author', sourceKey: 'hash', as: 'user_activities', onDelete: 'CASCADE' });
  Activity.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'user_activity', onDelete: 'CASCADE' });

	return {Activity};
}