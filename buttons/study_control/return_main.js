const study_button = require('../../modules/button.js');
const { MessageActionRow, MessageEmbed } = require('discord.js');
const study_time_collection = require('../../modules/study_collection.js');
var study_info = require('../../modules/share_study_info.js');

module.exports = {
    data: {
        name: 'go_main'
    },
    async execute (interaction) {
        study_info.infoembed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("놀지말고 공부합시다:fist::fist:")

        var s = "";
        for (let v of study_time_collection.values()) {
            s += v.name + "  "
        }

        study_info.infoembed.addFields({name: "알림 :speech_balloon:" , value: "메인버튼으로 돌아왔어요."});
        if (s){
        study_info.infoembed.addFields({name: "현재 공부 중인 인원", value: s});
        }

        
        await interaction.reply({embeds: [study_info.infoembed],components: [study_button]});
    }
}