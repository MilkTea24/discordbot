const { MessageEmbed, Collection } = require("discord.js");
const moment = require('moment');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const request = require('request');
const sendCoinInfo = require('../../modules/sendCoinInfo.js');

const yesOrNoButton = require("../../modules/buyYesOrNoButton.js");
const { reject } = require("lodash");

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

function isNull(v) {
    return (v === undefined || v === null) ? true : false;
}

module.exports = {
    data: {
        name: 'buyCoinModal'
    },
    async execute (modal) {
        const buyPercent = modal.getSelectMenuValues('buyPercent')[0];
        const coinName = modal.getTextInputValue('coinName');
        const isAmountorPrice = modal.getSelectMenuValues('isAmountorPrice')[0];
        const number = modal.getTextInputValue('number');
        const userId = modal.user.id;
        
        let infoEmbed = new MessageEmbed()
        .setColor('#ff58b4')
        .setAuthor({ name: "GO UPbit", iconURL: 'https://miro.medium.com/max/3150/1*b7E3KUdA2dY2TP2P9Q8O-Q.png', url:'https://upbit.com/exchange?code=CRIX.UPBIT.KRW-BTC'})
        .setTitle("돈을 벌었으면 투자해야죠! <:3080dogegirl:987678955807051806>")

        const optionsCoinList = {
            method: 'GET',
            url: 'https://api.upbit.com/v1/market/all?isDetails=false',
            headers: {Accept: 'application/json'}
          };
          
        let upbitCoinList = await new Promise((resolve, reject) => {
            request(optionsCoinList, function (error, response, body) {
                if (!error) {
                    var coinList = JSON.parse(body);
                    resolve(coinList);
                }
                else {
                    reject(error);
                }
          });
        });

        let isValidCoinName = 0;
        let thisCoin;
        for (let upbitCoin of upbitCoinList){
            if (upbitCoin.korean_name == coinName && upbitCoin.market.substring(0, 3) == "KRW"){
                if (upbitCoin.korean_name != "비트토렌트"){
                isValidCoinName = 1;
                thisCoin = upbitCoin;
                break;
                }
            }
        }

        let isValidNumber = !isNaN(number);

        if (!isValidCoinName){
            return modal.reply({ content: `존재하지 않는 코인 이름입니다. 다시 시도하세요.`, ephemeral: true });
        }

        if (!isValidNumber) {
            return modal.reply({ content: `수량/금액을 입력하는 칸에는 숫자만 입력해주세요.`, ephemeral: true});
        }

        let isEmptyValues = isNull(number) || isNull(isAmountorPrice);
        if (buyPercent === "noOption" && isEmptyValues){
            return modal.reply({ content: `선택안함을 설정하셨다면 원하는 정량/정액 구매여부와 수량/가격을 입력하셔야 합니다.`, ephemeral: true});
        }

        let str_url = 'https://api.upbit.com/v1/candles/days?market=' + thisCoin.market + '&count=1';
        const options = {
            method: 'GET',
            url: str_url,
            headers: {Accept: 'application/json'}
        };        
        
        let coinPriceInfo;
        try{
        coinPriceInfo = await dorequest(options, thisCoin.market);
        } catch(err) {
            console.log(err);
            return modal.reply({ content: `시세를 불러오는 중 문제가 발생했습니다.`, ephemeral: true});
        }

        const user = await Users.findOne({
            where: {user_id : userId},
        });
        
        let str = "매수 코인:  " + coinName + "\n";
        let buyCoinTradePrice = coinPriceInfo.trade_price;
        let buyTotalPrice = 0;
        let buyCoinAmount = 0;

        if (buyPercent === "percent100"){
            buyTotalPrice = user.balance;
        }
        else if (buyPercent === "percent50"){
            buyTotalPrice = user.balance / 2;
        }
        else if (buyPercent === "percent25"){
            buyTotalPrice = user.balance / 4;
        }
        else if (buyPercent === "percent10"){
            buyTotalPrice = user.balance / 10;
        }

        if (buyPercent !== "noOption"){
            buyCoinAmount = buyTotalPrice / buyCoinTradePrice;
        }

        if (buyPercent === "noOption" && isAmountorPrice === "amount") {
            buyCoinAmount = number * 1;
            buyTotalPrice = buyCoinAmount * buyCoinTradePrice;
        }
        else if (buyPercent === "noOption" && isAmountorPrice === "money"){
            buyTotalPrice = number * 1;
            buyCoinAmount = buyTotalPrice / buyCoinTradePrice;
        }

        let flag = 0;
        if (buyTotalPrice > user.balance) {
            buyTotalPrice = user.balance;
            buyCoinAmount = buyTotalPrice / buyCoinTradePrice;
            flag = 1;
        }

        str += "매수 금액:  " + buyTotalPrice.toLocaleString('ko-KR') + " KRW\n";
        str += "매수 수량:  " + buyCoinAmount.toFixed(5) + " " + thisCoin.market.substr(4) + "\n";
        str += "매수 단가:  " + buyCoinTradePrice.toLocaleString('ko-kR', {maximumFractionDigits: 4}) + " KRW";

        if (flag == 0){
            infoEmbed
            .addFields({name: "아래 정보가 맞는지 확인해주세요.", value: str});
        }
        else {
            infoEmbed
            .addFields({name: "주문금액이 잔고를 초과하여 주문금액의 변동이 있습니다.\n아래 정보를 확인해주세요.", value: str});
        }
        
        sendCoinInfo.buyTotalPrice = buyTotalPrice;
        sendCoinInfo.buyCoinTradePrice = buyCoinTradePrice;
        sendCoinInfo.buyCoinAmount = buyCoinAmount;
        sendCoinInfo.coinName = coinName;
        sendCoinInfo.coinMarket = thisCoin.market;
        sendCoinInfo.userId = userId;
        sendCoinInfo.buyTime = moment().utcOffset(540);
        
        return modal.reply({embeds: [infoEmbed],components: [yesOrNoButton], ephemeral: true});
    }
}