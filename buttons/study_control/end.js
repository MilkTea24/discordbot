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
        name: 'end'
    },
    async execute (interaction, client) {
        var act_id = interaction.user.id;

        const user = await Users.findOne({
            where: {user_id: act_id},
        });

        if (user){
            var start_time = study_time_collection.get(act_id);
            study_time_collection.delete(act_id);
            if (start_time){
                var now_time = moment().utcOffset(540);
                
                now_time.format();
                 start_time.format();

                var time = now_time.diff(start_time, "seconds");
                await Study_Time.create({study_id: act_id, date: start_time.format("YYYY-MM-DD"), study_start_time: start_time.format(), studying_time: time});

                let hour = Math.floor(time / 3600);
                let minute = Math.floor(time / 60 % 60);
                let second = Math.floor(time % 60);
                await interaction.reply({content:`${hour}시간 ${minute}분 ${second}초 동안 공부했어요:blue_book:`, ephemeral: true});
            }
            else {
                await interaction.reply({content:`${interaction.user.username}님은 현재 놀고 계시네요..:pensive:`, ephemeral: true});
            }
        }
        else{
            await interaction.reply({content:`회원가입 먼저 해주세요:pensive:`, ephemeral: true})
        }
    },
};