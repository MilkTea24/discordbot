const moment = require('moment');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const { Client, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const study_time_collection = require('../../modules/study_collection.js');
const study_etc_button = require('../../modules/studyEtcButton.js');
var study_info = require('../../modules/share_study_info.js');

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
        name: 'weekly_rank'
    },
    async execute (interaction, client) {
        var act_id = interaction.user.id;

        var week_start = moment().utcOffset(540).day(0);
        
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
            where: { date : {[Op.and]: {[Op.gte]:week_start.format("YYYY-MM-DD"), [Op.lte]:moment().utcOffset(540).format("YYYY-MM-DD")}}}
        })
        
        study_times = study_times.map(el => el.get({ plain: true }));
        
        var rankembed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(week_start.format("YYYY-MM-DD") + " ~ " + moment().utcOffset(540).format("YYYY-MM-DD") + " 랭킹");

        var count = 1;
        console.log("study_times: ", study_times);
        for (var week_study of study_times){
            var time = 0;
            var start_time = study_time_collection.get(week_study.study_id);
            if (start_time){
                start_time = start_time.time;
                var now_time = moment().utcOffset(540);
                week_study.emoji = ":clock3:";
                start_time.format();
                now_time.format();
    
                time = week_study.total_time + now_time.diff(start_time, "seconds");
            }
            else {
                time = week_study.total_time;
                week_study.emoji = ":sleeping:";
            }
            week_study.total_time = time;
            console.log("total_time: ", week_study.total_time);
        }

        study_times.sort(function(a,b) {
            return b.total_time - a.total_time;
        });

        for (var week_study of study_times){
            time = week_study.total_time;
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            rankembed
            .addFields( 
                {name: count + "등 " + week_study.user.user_name, value: hour + "시간 " + minute + "분 " + second + "초 " + week_study.emoji}
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