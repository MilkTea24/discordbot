const moment = require('moment');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const study_button = require('../../modules/button.js');
const study_time_collection = require('../../modules/study_collection.js');
const { Client, MessageActionRow, Intents, MessageEmbed } = require('discord.js');
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
        name: 'end'
    },
    async execute (interaction, client) {
        var act_id = interaction.user.id;

        const user = await Users.findOne({
            where: {user_id: act_id},
        });

        study_info.infoembed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("놀지말고 공부합시다 :fist::fist:")

        if (user){
            var start_time = study_time_collection.get(act_id);
            study_time_collection.delete(act_id);
            if (start_time){
                start_time = start_time.time;
                var now_time = moment().utcOffset(540);
                
                now_time.format();
                 start_time.format();

                var time = now_time.diff(start_time, "seconds");
                await Study_Time.create({study_id: act_id, date: start_time.format("YYYY-MM-DD"), study_start_time: start_time.format(), studying_time: time});

                let hour = Math.floor(time / 3600);
                let minute = Math.floor(time / 60 % 60);
                let second = Math.floor(time % 60);
                study_info.infoembed.addFields({name: "알림 :speech_balloon:" , value: interaction.user.username + "님이 공부를 끝냈어요.\n" +
                hour + "시간 " + minute + "분 " +second + "초 동안 공부했어요:blue_book:"});
            }
            else {
                study_info.infoembed.addFields({name: "알림 :speech_balloon:" , value: interaction.user.username + "님은 현재 놀고 계시네요..:pensive:"});
            }
        }
        else{
            study_info.infoembed.addFields({name: "알림 :speech_balloon:" , value: "미등록 회원은 이 기능을 사용할 수 없습니다. 회원 등록을 원하시면 /회원가입"})
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