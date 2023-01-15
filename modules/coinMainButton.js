const { MessageActionRow, MessageButton } = require('discord.js');

const row = new MessageActionRow()
.addComponents(
    new MessageButton()
    .setCustomId('checkBalance')
    .setLabel("계좌확인")
    .setEmoji('🖨️')
    .setStyle('SUCCESS'),
    new MessageButton()
    .setCustomId('buyCoin')
    .setLabel("코인매수")
    .setEmoji('🪙')
    .setStyle('PRIMARY'),
    new MessageButton()
    .setCustomId('sellCoin')
    .setLabel("코인매도")
    .setEmoji('💵')
    .setStyle('DANGER'),
    new MessageButton()
    .setCustomId('checkPrice')
    .setLabel("시세확인")
    .setEmoji('🔎')
    .setStyle('SECONDARY'),
);

module.exports = row;