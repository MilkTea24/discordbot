const { MessageActionRow, MessageButton } = require('discord.js');

const row = new MessageActionRow()
.addComponents(
    new MessageButton()
    .setCustomId('pokerMain')
    .setLabel("포커(2인이상)")
    .setStyle('SUCCESS'),
)

module.exports = row;