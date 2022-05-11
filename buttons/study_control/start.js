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
        name: 'start'
    },
    async execute (interaction, client) {
        var act_id = interaction.user.id;
        const user = await Users.findOne({
            where: {user_id: act_id},
        });

        if (user) {  
            var study_time = study_time_collection.get(act_id);
            if (!study_time) {
                study_time_collection.set(act_id, moment().utcOffset(540));
                await interaction.reply({content: `공부 시작합니다!` , ephemeral: true});
            }
            else {
                await interaction.reply({content:`이미 공부 중이에요`, ephemeral: true})
            }

        }
        else {
            await interaction.reply({content:`회원가입 먼저 해주세요:pensive:`, ephemeral: true})
        }
    },
};