const buttonCoinMain = require('../../modules/buttonCoinMain.js');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const { MessageActionRow, MessageEmbed } = require('discord.js');
const sendCoinInfo = require('../../modules/sendSellCoinInfo.js');
const moment = require('moment');

module.exports = {
    data: {
        name: 'sellCoinAgree'
    },
    async execute (interaction) {
        let coinEmbed = new MessageEmbed()
        .setColor('#ff58b4')
        .setAuthor({ name: "GO UPbit", iconURL: 'https://miro.medium.com/max/3150/1*b7E3KUdA2dY2TP2P9Q8O-Q.png', url:'https://upbit.com/exchange?code=CRIX.UPBIT.KRW-BTC'})
        .setTitle("돈을 벌었으면 투자해야죠! <:3080dogegirl:987678955807051806>");

        console.log(sendCoinInfo);

        let sellTotalPrice = sendCoinInfo.sellTotalPrice;
        let sellCoinTradePrice = sendCoinInfo.sellCoinTradePrice;
        let sellCoinAmount = sendCoinInfo.sellCoinAmount;
        let coinName = sendCoinInfo.coinName;
        let coinMarket = sendCoinInfo.coinMarket;
        let userId = sendCoinInfo.userId;
        let sellTime = sendCoinInfo.sellTime;

        sendCoinInfo.sellTotalPrice = null;
        sendCoinInfo.sellCoinTradePrice = null;
        sendCoinInfo.sellCoinAmount = null;
        sendCoinInfo.coinName = null;
        sendCoinInfo.coinMarket = null;
        sendCoinInfo.userId = null;
        sendCoinInfo.sellTime = null;

        let nowTime = moment().utcOffset(540);
        if (nowTime.diff(sellTime, 'seconds') > 10 || interaction.user.id != userId) {
            return interaction.reply({content: `버튼을 너무 늦게 누르셨네요. 다시 구매해주세요.`, ephemeral: true});
        }

        console.log(coinName);
        const userCoin = await Coins.findOne({
            attributes: [
                'user_id','coin_name','coin_market','average_price','amount'],
            where: { user_id : userId, coin_name : coinName},
        });

        const user = await Users.findOne({
            where: {user_id : userId},
        });

        if (userCoin) {
            let beforeCoinAmount = userCoin.amount;
            let beforeCoinTotalPrice = userCoin.amount * sellCoinTradePrice;
            let afterCoinTradePrice = beforeCoinTotalPrice - sellTotalPrice;
            let afterCoinAmount = beforeCoinAmount - sellCoinAmount;

            if (afterCoinTradePrice < 10){
                await Coins.destroy({where: {user_id:userId, coin_name : coinName}});
            }
            else {
                await Coins.update(
                    {amount : afterCoinAmount},
                    {where: {user_id:userId, coin_name : coinName}}
                )
            }
        }
        else {
            return interaction.reply({content: `문제가 생겼습니다! 다시 시도해주세요.`, ephemeral: true});
        }

        let afterBalance = user.balance + sellTotalPrice;

        await Users.update(
            {balance: afterBalance},
            {where: {user_id:userId}}
        )

        coinEmbed.addFields({name: "알림 :speech_balloon:", value: "판매 성공했습니다! 계좌를 확인해보세요."});

        return interaction.reply({embeds: [coinEmbed],components: [buttonCoinMain], ephemeral: true});
    }
}