const moment = require('moment');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const { Client, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const study_time_collection = require('../../modules/study_collection.js');
const study_etc_button = require('../../modules/studyEtcButton.js');
var study_info = require('../../modules/share_study_info.js');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

module.exports = {
    data: {
        name: 'today_rank'
    },
    async execute (interaction, client) {
        var act_id = interaction.user.id;
        
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
            where: { date : moment().utcOffset(540).format("YYYY-MM-DD")}
        })
        
        study_times = study_times.map(el => el.get({ plain: true }));
        
        var rankembed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(moment().utcOffset(540).format("YYYY-MM-DD") + " 랭킹");

        var count = 1;
        console.log("study_times: ", study_times);
        for (let today_study of study_times){
            let time = 0;
            let start_time = study_time_collection.get(today_study.study_id);
            if (start_time){
                start_time = start_time.time;
                var now_time = moment().utcOffset(540);
                today_study.emoji = ":clock3:";
                start_time.format();
                now_time.format();
    
                time = today_study.total_time + now_time.diff(start_time, "seconds");
            }
            else {
                time = today_study.total_time;
                today_study.emoji = ":sleeping:";
            }
            today_study.total_time = time;
            console.log("total_time: ", today_study.total_time);
        }

        study_times.sort(function(a,b) {
            return b.total_time - a.total_time;
        });

        for (let today_study of study_times){
            time = today_study.total_time;
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            rankembed
            .addFields( 
                {name: count + "등 " + today_study.user.user_name, value: hour + "시간 " + minute + "분 " + second + "초 " + today_study.emoji}
            )
            count++;
        }


        var s = "";
        for (let v of study_time_collection.values()) {
            s += v.name + "  "
        }
        
        if (s){
        study_info.infoembed.addFields({name: "현재 공부 중인 인원", value: s})
        }

        await interaction.reply({embeds: [rankembed],components: [study_etc_button]});
    },
};