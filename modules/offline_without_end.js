const moment = require('moment');
const {Users, Coins, Study_Time} = require('../dbObjects.js');
const study_button = require('./button.js');
const study_time_collection = require('./study_collection.js');
const { Client, MessageActionRow, Intents, MessageEmbed } = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

module.exports = {
    offline_end: async function(client, study_channel_id, act_id) {
    console.log("act_id " + act_id);
    const user = await Users.findOne({  
        where: {user_id: act_id},
    });

    let infoembed = new MessageEmbed()
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
            
            //입금
            let addBalance = user.balance;
            addBalance += time * 100;
            
            await Users.update(
                {balance: addBalance},
                {where: {user_id: act_id}},
            )
            
            await Study_Time.create({study_id: act_id, date: start_time.format("YYYY-MM-DD"), study_start_time: start_time.format(), studying_time: time});

            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            infoembed.addFields({name: "알림 :speech_balloon:" , value: user.user_name + "님이 오프라인 상태이므로 시간 측정을 중단했습니다.\n" +
            hour + "시간 " + minute + "분 " +second + "초 동안 공부했어요:blue_book:"});
            var s = "";
            for (let v of study_time_collection.values()) {
               s += v.name + "  ";
            }
        
            if (s){ 
            infoembed.addFields({name: "현재 공부 중인 인원", value: s})
            }
        
            const study_channel = client.channels.cache.get(study_channel_id);
            study_channel.send({embeds:[infoembed] ,components: [study_button]});
            }
        }
    }
}