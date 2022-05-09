const { Client, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const {Users, Coins, Study_Time} = require('../dbObjects.js');
const study_time_collection = require('../modules/study_collection.js');
const moment = require('moment');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

module.exports = {
    interact: async function(i/*, interaction*/){
 //       if (i.user.id === interaction.user.id) {
            if (i.customId === 'start'){
                var act_id = i.user.id;
                const user = await Users.findOne({
                    where: {user_id: act_id},
                });
        
                if (user) {  
                    var study_time = study_time_collection.get(act_id);
                    if (!study_time) {
                        study_time_collection.set(act_id, moment().utcOffset(540));
                    }

                }
            }
            else if (i.customId === 'time'){
                var act_id = i.user.id;

                var start_time = study_time_collection.get(act_id);
                if (start_time){
                    var now_time = moment().utcOffset(540);
                
                    start_time.format();
                    now_time.format();
        
                    var time = now_time.diff(start_time, "seconds");
                    let hour = Math.floor(time / 3600);
                    let minute = Math.floor(time / 60 % 60);
                    let second = Math.floor(time % 60);
                    return {content:`현재 ${hour}시간 ${minute}분 ${second}초 동안 공부 중이에요:book:`, ephemeral: true};
                }
                else{
                    return {content:`${i.user.username}님은 현재 놀고 계시네요..:pensive:`, ephemeral: true};
                }
            }
            else if (i.customId === 'end'){
                var act_id = i.user.id;

                const user = await Users.findOne({
                    where: {user_id: act_id},
                });
        
                if (user){
                    var start_time = study_time_collection.get(act_id);
                    study_time_collection.delete(act_id);
                    if (start_time){
                    var now_time = moment().utcOffset(540);
                
                    this_study_date = start_time.format("YYYY-MM-DD");
                    this_study_time = start_time.format();
                    now_time.format();
        
                    var time = now_time.diff(start_time, "seconds");
                    start_time = study_time_collection.get(act_id);
                    Study_Time.create({user_id: act_id, study_date: this_study_date, study_start_time: this_study_time, study_time: time});
        
                    let hour = Math.floor(time / 3600);
                    let minute = Math.floor(time / 60 % 60);
                    let second = Math.floor(time % 60);
                    return {content:`${hour}시간 ${minute}분 ${second}초 동안 공부했어요:book:`, ephemeral: true};
                    }
                }
                return {content:`${i.user.username}님은 현재 놀고 계시네요..:pensive:`, ephemeral: true};
            }
            else if (i.customId === 'ranking'){
                var act_id = i.user.id;
        
                const study_times = await Study_Time.findAll({
                    include: [
                        {
                            model: Users,
                            attributes: ['name'] 
                        }
                    ],
                    attributes:[
                        'user_id',
                        [sequelize.fn('sum', sequelize.col('study_time')), 'total_time']
                    ],
                    group: ['user_id'],
                    order: ['total_time', "desc"]
                })

                var rankembed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(moment().utcOffset(540).format("YYYY-MM-DD") + " 랭킹");

                var count = 1;
                for (var study_time of study_times){
                    var time = study_time.total_time;
                    let hour = Math.floor(time / 3600);
                    let minute = Math.floor(time / 60 % 60);
                    let second = Math.floor(time % 60);
                    rankembed
                    .addFields( 
                        {name: count + "등 " + study_time.user_name, value: hour + ":" + minute + ":" + second + ":clock:"}
                    )
                }

                return {embeds: [rankembed]};
            }
//        }
    }
}