const { MessageActionRow, MessageButton } = require('discord.js');

const row = new MessageActionRow()
.addComponents(
    new MessageButton()
    .setCustomId('today_rank')
    .setLabel("오늘랭킹")
    .setEmoji('🛴')
    .setStyle('SUCCESS'),
    new MessageButton()
    .setCustomId('weekly_rank')
    .setLabel("주간랭킹")
    .setEmoji('🚗')
    .setStyle('SUCCESS'),
    new MessageButton()
    .setCustomId('monthly_rank')
    .setLabel("월간랭킹")
    .setEmoji('✈️')
    .setStyle('SUCCESS'),
    new MessageButton()
    .setCustomId('go_main')
    .setLabel("돌아가기")
    .setEmoji('🏠')
    .setStyle('SECONDARY'),
)

module.exports = row;