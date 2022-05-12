const moment = require('moment');
const study_button = require('../../modules/button.js');
const { Client, MessageActionRow, Intents, MessageEmbed } = require('discord.js');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const study_time_collection = require('../../modules/study_collection.js');
var study_info = require('../../modules/share_study_info.js');

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

const client = new Client({ intents: myIntents });

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

var flag = 0;

module.exports = {
    data: {
        name: 'start'
    },
    async execute (interaction, client) {
        var act_id = interaction.user.id;
        const user = await Users.findOne({
            where: {user_id: act_id},
        });

        study_info.infoembed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("놀지말고 공부합시다:fist::fist:")

        if (user) {  
            var study_time = study_time_collection.get(act_id);
            if (!study_time) {
                study_time_collection.set(act_id, {time:moment().utcOffset(540), name:user.user_name});
                study_info.infoembed.addFields({name: "알림 :speech_balloon:" , value: user.user_name + "님이 공부를 시작했어요. 공부 시작시간은 "
            + moment().utcOffset(540).format("h:mm:ss A")})
            }
            else {
                study_info.infoembed.addFields({name: "알림 :speech_balloon:" , value: user.user_name + "님은 이미 공부 중이네요.\n 공부시간을 확인하고 싶으면 시간확인을 눌러주세요."})
            }

        }
        else {
            study_info.infoembed.addFields({name: "로그 :speech_balloon:" , value: "미등록 회원은 이 기능을 사용할 수 없습니다. 회원 등록을 원하시면 /회원가입"})
        }

        var s = "";
        for (let v of study_time_collection.values()) {
            s += v.name + "  "
        }
        
        if (s){
        study_info.infoembed.addFields({name: "현재 공부 중인 인원", value: s})
        }
        
        flag = 1;


        await interaction.reply({embeds: [study_info.infoembed],components: [study_button]});
        /*
        try{
            study_info.promise.then(sent => {
            message.channel.messages.fetch(sent.id).then(msg => msg.delete());
            return interaction.reply({embeds: [study_info.infoembed],components: [study_button]});
            });
        }
        catch(error){
            console.log(error);
        }	
        */
        
        

    },
};