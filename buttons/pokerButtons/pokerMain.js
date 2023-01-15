const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const row = new MessageActionRow()
.addComponents(
    new MessageButton()
    .setCustomId('hostPoker')
    .setLabel("방 만들기")
    .setStyle('SUCCESS'),
    new MessageButton()
    .setCustomId('guestPoker')
    .setLabel("참가하기")
    .setStyle('PRIMARY'),
    new MessageButton()
    .setCustomId('casinoMain')
    .setLabel("돌아가기")
    .setStyle('DANGER'),
);

module.exports = {
    data: {
        name: 'pokerMain'
    },
    execute (interaction) {
        let infoEmbed = new MessageEmbed()
        .setColor('#00ff00')
        .setTitle("텍사스 홀덤 게임에 오신 것을 환영합니다!")

        return interaction.reply({embeds: [infoEmbed], components: [row]});
    }
}