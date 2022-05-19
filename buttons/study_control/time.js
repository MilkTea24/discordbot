const moment = require('moment');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const study_button = require('../../modules/button.js');
const { Client, MessageActionRow, Intents, MessageEmbed } = require('discord.js');
const study_time_collection = require('../../modules/study_collection.js');
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
        name: 'time'
    },
    async execute (interaction, client) {
        var act_id = interaction.user.id;

        var start_time = study_time_collection.get(act_id);

        study_info.infoembed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("놀지말고 공부합시다 :fist::fist:")

        var total_time = 0;
        if (start_time){
            start_time = start_time.time;
            var now_time = moment().utcOffset(540);
        
            start_time.format();
            now_time.format();

            var time = now_time.diff(start_time, "seconds");
            total_time += time;
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            study_info.infoembed.addFields({name: "알림 :speech_balloon:" , value: interaction.user.username + "님은 현재 "+hour+"시간 "+minute+"분 "+second+"초 동안 공부 중이에요:book:"});
        }
        else{
            study_info.infoembed.addFields({name: "알림 :speech_balloon:" , value: interaction.user.username + "님은 현재 놀고 계시네요..:pensive:"});
        }

        const today_times = await Study_Time.findAll({
            where: {study_id: act_id,
                    date : moment().utcOffset(540).format("YYYY-MM-DD"),
                    },
            attributes:[
                'study_id',
                'study_start_time',
                'studying_time',
            ],
        });


        var time_s = "";
        var count = 0;
    
        for (let today_time of today_times){
            total_time += today_time.studying_time;
            if (count >= today_times.length - 10) {
            let start = moment(today_time.study_start_time).utcOffset(540);
            console.log(start.utcOffset(540).format("h:mm:ss A"));
            console.log(start.add(today_time.studying_time, 'seconds').utcOffset(540).format("h:mm:ss A"));
            time_s += ":small_blue_diamond: " + /*hour + "시간 " + minute + "분 " + second + "초 \t\t" + */start.utcOffset(540).format("h:mm:ss A") + " ~ " + start.add(today_time.studying_time, 'seconds').utcOffset(540).format("h:mm:ss A") + "\n";
            }
            count++;
        }

        let hour = Math.floor(total_time / 3600);
        let minute = Math.floor(total_time / 60 % 60);
        let second = Math.floor(total_time % 60);
        time_s += "총 공부시간은 " + hour + "시간 " + minute + "분 " + second + "초 :clock3:";

        if (time_s){
            study_info.infoembed.addFields({name: "최근 10번까지의 오늘 공부 내역입니다.", value: time_s})
            }

        var s = "";
        for (let v of study_time_collection.values()) {
            s += v.name + "  ";
        }
        
        if (s){
        study_info.infoembed.addFields({name: "현재 공부 중인 인원", value: s})
        }

        await interaction.reply({embeds: [study_info.infoembed],components: [study_button]});
    },
};