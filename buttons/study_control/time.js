const moment = require('moment');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const study_time_collection = require('../../modules/study_collection.js');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

module.exports = {
    data: {
        name: 'time'
    },
    async execute (interaction, client) {
        var act_id = interaction.user.id;

        var start_time = study_time_collection.get(act_id);
        if (start_time){
            var now_time = moment().utcOffset(540);
        
            start_time.format();
            now_time.format();

            var time = now_time.diff(start_time, "seconds");
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            await interaction.reply({content:`현재 ${hour}시간 ${minute}분 ${second}초 동안 공부 중이에요:book:`, ephemeral: true});
        }
        else{
            await interaction.reply({content:`${interaction.user.username}님은 현재 놀고 계시네요..:pensive:`, ephemeral: true});
        }
    },
};