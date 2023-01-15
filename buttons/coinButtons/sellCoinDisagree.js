const coinMainButton = require('../../modules/coinMainButton.js');
const { MessageActionRow, MessageEmbed } = require('discord.js');
const sendCoinInfo = require('../../modules/sendSellCoinInfo.js');

module.exports = {
    data: {
        name: 'sellCoinDisagree'
    },
    async execute (interaction) {
        sendCoinInfo.sellTotalPrice = null;
        sendCoinInfo.sellCoinTradePrice = null;
        sendCoinInfo.sellCoinAmount = null;
        sendCoinInfo.coinName = null;
        sendCoinInfo.coinMarket = null;
        sendCoinInfo.userId = null;
        sendCoinInfo.sellTime = null;
        
        let coinEmbed = new MessageEmbed()
        .setColor('#ff58b4')
        .setAuthor({ name: "GO UPbit", iconURL: 'https://miro.medium.com/max/3150/1*b7E3KUdA2dY2TP2P9Q8O-Q.png', url:'https://upbit.com/exchange?code=CRIX.UPBIT.KRW-BTC'})
        .setTitle("돈을 벌었으면 투자해야죠! <:3080dogegirl:987678955807051806>");

        coinEmbed.addFields({name: "알림 :speech_balloon:" , value: "메인화면으로 돌아왔어요."});
      
        await interaction.reply({embeds: [coinEmbed],components: [coinMainButton]});
    }
}