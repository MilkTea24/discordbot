const { MessageActionRow, MessageButton } = require('discord.js');

const row = new MessageActionRow()
.addComponents(
    new MessageButton()
    .setCustomId('start')
    .setLabel("공부시작!")
    .setEmoji('✏️')
    .setStyle('SUCCESS'),
    new MessageButton()
    .setCustomId('time')
    .setLabel("시간확인")
    .setEmoji('⌚')
    .setStyle('PRIMARY'),
    new MessageButton()
    .setCustomId('end')
    .setLabel("공부끝!")
    .setEmoji('🥳')
    .setStyle('DANGER'),
    new MessageButton()
    .setCustomId('study_etc')
    .setLabel("목록 더보기")
    .setEmoji('📋')
    .setStyle('SECONDARY'),
)

module.exports = row;