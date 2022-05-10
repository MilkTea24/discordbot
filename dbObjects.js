const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Coins = require('./models/coins.js')(sequelize, Sequelize.DataTypes);
const Users = require('./models/users.js')(sequelize, Sequelize.DataTypes);
const Study_Time = require('./models/study_time.js')(sequelize, Sequelize.DataTypes);

Coins.belongsTo(Users, {foreignKey: 'user_id', targetKey: 'user_id'});
Study_Time.belongsTo(Users, {foreignKey: 'study_id', targetKey: 'user_id'});

Users.hasMany(Study_Time, {foreignKey: 'user_id'});
Users.hasMany(Coins, {foreignKey: 'user_id'});

module.exports = {Users, Coins, Study_Time};