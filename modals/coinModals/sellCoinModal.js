const { MessageEmbed, Collection } = require("discord.js");
const moment = require('moment');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const request = require('request');
const sendCoinInfo = require('../../modules/sendSellCoinInfo.js');

const sellYesOrNoButton = require("../../modules/sellYesOrNoButton.js");
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
        name: 'sellCoinModal'
    },
    async execute (modal) {
        const sellPercent = modal.getSelectMenuValues('sellPercent')[0];
        const selectCoinName = modal.getSelectMenuValues('selectCoinName')[0];
        const coinName = modal.getTextInputValue('coinName');
        const isAmountorPrice = modal.getSelectMenuValues('isAmountorPrice')[0];
        const number = modal.getTextInputValue('number');
        const userId = modal.user.id;
        
        let infoEmbed = new MessageEmbed()
        .setColor('#ff58b4')
        .setAuthor({ name: "GO UPbit", iconURL: 'https://miro.medium.com/max/3150/1*b7E3KUdA2dY2TP2P9Q8O-Q.png', url:'https://upbit.com/exchange?code=CRIX.UPBIT.KRW-BTC'})
        .setTitle("돈을 벌었으면 투자해야죠! <:3080dogegirl:987678955807051806>")

         let isValidNumber = !isNaN(number);

        if (isNull(selectCoinName) && isNull(coinName)){
            return modal.reply({ content: `코인을 선택하지 않으셨네요. 다시 시도해주세요.`, ephemeral: true });
        }

        if (!isValidNumber) {
            return modal.reply({ content: `수량/금액을 입력하는 칸에는 숫자만 입력해주세요.`, ephemeral: true});
        }

        let isEmptyValues = isNull(number) || isNull(isAmountorPrice);
        if (sellPercent === "noOption" && isEmptyValues){
            return modal.reply({ content: `선택안함을 설정하셨다면 원하는 정량/정액 판매여부와 수량/가격을 입력하셔야 합니다.`, ephemeral: true});
        }

        let findCoinName;
        if (!isNull(selectCoinName)) {
            findCoinName = selectCoinName;
        }
        else {
            findCoinName = coinName;
        }
        const thisCoin = await Coins.findOne({
            attributes: [
                'user_id','coin_name','coin_market','average_price','amount'],
            where: {user_id : userId, coin_name : findCoinName}
        })

        if (!thisCoin) {
            return modal.reply({ content: `존재하지 않는 코인입니다. 다시 시도해주세요.`, ephemeral: true });
        }

        let str_url = 'https://api.upbit.com/v1/candles/days?market=' + thisCoin.coin_market + '&count=1';
        const options = {
            method: 'GET',
            url: str_url,
            headers: {Accept: 'application/json'}
        };        
        
        let coinPriceInfo;
        try{
        coinPriceInfo = await dorequest(options, thisCoin.coin_market);
        } catch(err) {
            console.log(err);
            return modal.reply({ content: `시세를 불러오는 중 문제가 발생했습니다.`, ephemeral: true});
        }

        
        let str = "매도 코인:  " + findCoinName + "\n";
        let sellCoinTradePrice = coinPriceInfo.trade_price;
        let sellTotalPrice = 0;
        let sellCoinAmount = 0;

        if (sellPercent === "percent100"){
            sellCoinAmount = thisCoin.amount;
            sellTotalPrice = sellCoinTradePrice * sellCoinAmount;
        }
        else if (sellPercent === "percent50"){
            sellCoinAmount = thisCoin.amount / 2;
            sellTotalPrice = sellCoinTradePrice * sellCoinAmount;
        }
        else if (sellPercent === "percent25"){
            sellCoinAmount = thisCoin.amount/ 4;
            sellTotalPrice = sellCoinTradePrice * sellCoinAmount;
        }
        else if (sellPercent === "percent10"){
            sellCoinAmount = thisCoin.amount/ 10;
            sellTotalPrice = sellCoinTradePrice * sellCoinAmount;
        }

        if (sellPercent === "noOption" && isAmountorPrice === "amount") {
            sellCoinAmount = number * 1;
            sellTotalPrice = sellCoinAmount * sellCoinTradePrice;
        }
        else if (sellPercent === "noOption" && isAmountorPrice === "money"){
            sellTotalPrice = number * 1;
            sellCoinAmount = sellTotalPrice / sellCoinTradePrice;
        }

        let flag = 0;
        if (sellTotalPrice > thisCoin.amount * sellCoinTradePrice) {
            sellTotalPrice = thisCoin.amount * sellCoinTradePrice;
            sellCoinAmount = thisCoin.amount;
            flag = 1;
        }

        str += "매도 금액:  " + sellTotalPrice.toLocaleString('ko-KR') + " KRW\n";
        str += "매도 수량:  " + sellCoinAmount.toFixed(5) + " " + thisCoin.coin_market.substr(4) + "\n";
        str += "매도 단가:  " + sellCoinTradePrice.toLocaleString('ko-kR', {maximumFractionDigits: 4}) + " KRW";

        if (flag == 0){
            infoEmbed
            .addFields({name: "아래 정보가 맞는지 확인해주세요.", value: str});
        }
        else {
            infoEmbed
            .addFields({name: "주문금액이 잔고를 초과하여 주문금액의 변동이 있습니다.\n아래 정보를 확인해주세요.", value: str});
        }
        
        sendCoinInfo.sellTotalPrice = sellTotalPrice;
        sendCoinInfo.sellCoinTradePrice = sellCoinTradePrice;
        sendCoinInfo.sellCoinAmount = sellCoinAmount;
        sendCoinInfo.coinName = findCoinName;
        sendCoinInfo.coinMarket = thisCoin.market;
        sendCoinInfo.userId = userId;
        sendCoinInfo.sellTime = moment().utcOffset(540);
        
        return modal.reply({embeds: [infoEmbed],components: [sellYesOrNoButton], ephemeral: true});
    }
}