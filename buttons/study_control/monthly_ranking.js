const moment = require('moment');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const { Client, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const study_time_collection = require('../../modules/study_collection.js');
const study_etc_button = require('../../modules/studyEtcButton.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

module.exports = {
    data: {
        name: 'monthly_rank'
    },
    async execute (interaction, client) {
        var act_id = interaction.user.id;

        var month_start = moment().utcOffset(540).startOf("month");
        
        var study_times = await Study_Time.findAll({
            
            include: [
                {
                    model: Users,
                    attributes: ['user_name'],
                    required: true,
                }
            ],
            attributes:[
                'study_id',
                [sequelize.fn('sum', sequelize.col('studying_time')), 'total_time']
            ],
            group: 'study_id',
            where: { date : {[Op.and]: {[Op.gte]:month_start.format("YYYY-MM-DD"), [Op.lte]:moment().utcOffset(540).format("YYYY-MM-DD")}}}
        })
        
        study_times = study_times.map(el => el.get({ plain: true }));
        
        var rankembed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(month_start.format("YYYY-MM-DD") + " ~ " + moment().utcOffset(540).format("YYYY-MM-DD") + " 랭킹");

        var count = 1;
        console.log("study_times: ", study_times);
        for (var month_study of study_times){
            var time = 0;
            var start_time = study_time_collection.get(month_study.study_id);
            if (start_time){
                start_time = start_time.time;
                var now_time = moment().utcOffset(540);
                month_study.emoji = ":clock3:";
                start_time.format();
                now_time.format();
    
                time = month_study.total_time + now_time.diff(start_time, "seconds");
            }
            else {
                time = month_study.total_time;
                month_study.emoji = ":sleeping:";
            }
            month_study.total_time = time;
            console.log("total_time: ", month_study.total_time);
        }

        study_times.sort(function(a,b) {
            return b.total_time - a.total_time;
        });

        for (var month_study of study_times){
            time = month_study.total_time;
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            rankembed
            .addFields( 
                {name: count + "등 " + month_study.user.user_name, value: hour + "시간 " + minute + "분 " + second + "초 " + month_study.emoji}
            )
            count++;
        }

        await interaction.reply({embeds: [rankembed],components: [study_etc_button]});
    },
};