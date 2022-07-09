const buttonCoinMain = require('../../modules/buttonCoinMain.js');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const { MessageActionRow, MessageEmbed } = require('discord.js');
const sendCoinInfo = require('../../modules/sendCoinInfo.js');
const moment = require('moment');

module.exports = {
    data: {
        name: 'buyCoinAgree'
    },
    async execute (interaction) {
        let coinEmbed = new MessageEmbed()
        .setColor('#ff58b4')
        .setAuthor({ name: "GO UPbit", iconURL: 'https://miro.medium.com/max/3150/1*b7E3KUdA2dY2TP2P9Q8O-Q.png', url:'https://upbit.com/exchange?code=CRIX.UPBIT.KRW-BTC'})
        .setTitle("돈을 벌었으면 투자해야죠! <:3080dogegirl:987678955807051806>");

        let buyTotalPrice = sendCoinInfo.buyTotalPrice;
        let buyCoinTradePrice = sendCoinInfo.buyCoinTradePrice;
        let buyCoinAmount = sendCoinInfo.buyCoinAmount;
        let coinName = sendCoinInfo.coinName;
        let coinMarket = sendCoinInfo.coinMarket;
        let userId = sendCoinInfo.userId;
        let buyTime = sendCoinInfo.buyTime;

        sendCoinInfo.buyTotalPrice = null;
        sendCoinInfo.buyCoinTradePrice = null;
        sendCoinInfo.buyCoinAmount = null;
        sendCoinInfo.coinName = null;
        sendCoinInfo.coinMarket = null;
        sendCoinInfo.userId = null;
        sendCoinInfo.buyTime = null;

        let nowTime = moment().utcOffset(540);
        if (nowTime.diff(buyTime, 'seconds') > 10 || interaction.user.id != userId) {
            return interaction.reply({content: `버튼을 너무 늦게 누르셨네요. 다시 구매해주세요.`, ephemeral: true});
        }

        const userCoin = await Coins.findOne({
            attributes: [
                'user_id','coin_name','coin_market','average_price','amount'],
            where: { user_id : userId, coin_name : coinName},
        });

        const user = await Users.findOne({
            where: {user_id : userId},
        });

        if (userCoin) {
            let beforeCoinTradePrice = userCoin.average_price;
            let beforeCoinAmount = userCoin.amount;
            let beforeCoinTotalPrice = beforeCoinTradePrice * beforeCoinAmount;
            let afterCoinTotalPrice = buyTotalPrice + beforeCoinTotalPrice;
            let afterCoinAmount = buyCoinAmount + beforeCoinAmount;
            let afterCoinTradePrice = afterCoinTotalPrice / afterCoinAmount;

            await Coins.update(
                {average_price: afterCoinTradePrice, amount : afterCoinAmount},
                {where: {user_id:userId, coin_name : coinName}}
            )
        }
        else {
            let afterBalance = user.balance - buyTotalPrice;
            await Coins.create({user_id: userId, coin_name: coinName, coin_market: coinMarket, average_price: buyCoinTradePrice, amount: buyCoinAmount});
        }

        let afterBalance = user.balance - buyTotalPrice;

        await Users.update(
            {balance: afterBalance},
            {where: {user_id:userId}}
        )

        coinEmbed.addFields({name: "알림 :speech_balloon:", value: "구매 성공했습니다! 계좌를 확인해보세요."});

        return interaction.reply({embeds: [coinEmbed],components: [buttonCoinMain], ephemeral: true});
    }
}