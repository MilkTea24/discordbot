const { MessageActionRow, MessageButton } = require('discord.js');

const row = new MessageActionRow()
.addComponents(
    new MessageButton()
    .setCustomId('sellCoinDisagree')
    .setLabel("아니에요..")
    .setEmoji('👎')
    .setStyle('DANGER'),
    new MessageButton()
    .setCustomId('sellCoinAgree')
    .setLabel("네!")
    .setEmoji('👍')
    .setStyle('SUCCESS'),
)

module.exports = row;