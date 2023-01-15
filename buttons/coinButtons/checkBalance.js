const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const { MessageEmbed } = require('discord.js');
const Sequelize = require('sequelize');
const request = require('request');

const coinMainButton = require('../../modules/coinMainButton.js');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

function dorequest(options, _market) {
    return new Promise(resolve => {    
        request(options, function (error, response, body) {
            if (!error) {
                var object = JSON.parse(body);
                resolve(object[0]);
            }
            else {
                var object = {
                    market: _market,
                    trade_price: 0
                };
                resolve(object);
            }
        });
    });
}

module.exports = {
    data: {
        name: 'checkBalance'
    },
    async execute (interaction, client) {
        const userId = interaction.user.id;
        
        const userCoins = await Coins.findAll({
            attributes: [
                'user_id','coin_name','coin_market','average_price','amount'],
            where: { user_id : userId},
        });

        const user = await Users.findOne({
            where: {user_id : userId},
        });

        let promises = [];

        for (const userCoinBefore of userCoins){
            var str_url = 'https://api.upbit.com/v1/candles/days?market=' + userCoinBefore.coin_market + '&count=1';
    
                const options = {
                    method: 'GET',
                    url: str_url,
                    headers: {Accept: 'application/json'}
                };
                    
                promises.push(dorequest(options, userCoinBefore.coin_market));
        }   
        let upbitPriceCoins = await Promise.all(promises);

        for (let userCoin of userCoins){
            userCoin.now_price = upbitPriceCoins.find(v => v.market == userCoin.coin_market).trade_price;
        }

        userCoins.sort(function(a,b) {
            let BtotalPrice = b.now_price * b.amount;
            let AtotalPrice = a.now_price * a.amount;
            return BtotalPrice - AtotalPrice;
        })
        
        let coinEmbed = new MessageEmbed()
        .setColor('#ff58b4')
        .setTitle("돈을 벌었으면 투자해야죠! <:3080dogegirl:987678955807051806>")
        .setAuthor({ name: "GO UPbit", iconURL: 'https://miro.medium.com/max/3150/1*b7E3KUdA2dY2TP2P9Q8O-Q.png', url:'https://upbit.com/exchange?code=CRIX.UPBIT.KRW-BTC'})
        .setDescription(interaction.user.username + "님의 계좌 내역은 다음과 같습니다.");
        
        coinEmbed.addFields({name: "현금 💰" , value: user.balance.toLocaleString('ko-KR',{maximumFractionDigits: 0}) + " KRW"});

        let totalBalance = user.balance;
        for (let userCoin of userCoins){
            let nowTotalPrice = userCoin.now_price * userCoin.amount;
            let buyTotalPrice = userCoin.average_price * userCoin.amount;
            let earn = nowTotalPrice - buyTotalPrice;
            let earnRate = earn / buyTotalPrice * 100;
            let emoji;
            if (earn >= 0) emoji = "📈";
            else emoji = "📉";

            totalBalance += nowTotalPrice;

            let str = "평가손익: " + earn.toLocaleString('ko-KR', {maximumFractionDigits: 0}) + " KRW \t현재단가: " + userCoin.now_price.toLocaleString('ko-KR', {maximumFractionDigits: 4}) + " KRW\n";
            str += "보유수량: " + userCoin.amount.toFixed(5) + " " + userCoin.coin_market.substr(4) + "\t매수평균가: " + userCoin.average_price.toLocaleString('ko-KR', {maximumFractionDigits: 4}) + " KRW\n";
            str += "평가금액: " + nowTotalPrice.toLocaleString('ko-KR', {maximumFractionDigits: 0}) + " KRW \t매수금액: " + buyTotalPrice.toLocaleString('ko-KR', {maximumFractionDigits: 0})+ " KRW";
            coinEmbed.addFields({name: userCoin.coin_name + " : " + earnRate.toFixed(2) + " % " + emoji, value: str});
        }

        coinEmbed.addFields({name: "계좌 총 평가 금액 💎", value: totalBalance.toLocaleString('ko-KR', {maximumFractionDigits: 0}) + " KRW"});

        await interaction.reply({embeds: [coinEmbed],components: [coinMainButton]});
    },
};