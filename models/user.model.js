module.exports = (sequelize, Sequelize) => {
	// noinspection JSUnresolvedFunction
	const User = sequelize.define("users", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		username: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: true
		},
		email: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		contact: {
			type: Sequelize.JSON,
			allowNull: true
		},
		bio: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		picture: {
			type: Sequelize.STRING,
			allowNull: true
		}
	},{
			schema: 'account',
			freezeTableName: true,
			indexes: [
				{
					unique: true,
					fields: ['id', 'username']
				},
				{
					fields: ['email']
				}
			]
	});
	
	return {User};
}