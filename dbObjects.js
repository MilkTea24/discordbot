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

Coins.belongsTo(Users, {foreignKey: 'user_id', as: 'user'});
Study_Time.belongsTo(Users, {foreignKey: 'user_id', as: 'user'});

module.exports = {Users, Coins, Study_Time};