const { SlashCommandBuilder, userMention } = require('@discordjs/builders');
const request = require('request');
const coins = require('../upbit_modules/coin_info_module');
var users = require('../upbit_modules/upbit_user');
const { isNull } = require('lodash');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('정량매수')
		.setDescription('코인 개수를 기준으로 매수하세요')
		.addStringOption(option => option.setName('name').setDescription('코인 이름을 정자로 적어주세요'))
        .addNumberOption(option => option.setName('amount').setDescription('얼마나 살건지 적어주세요')),
	async execute(interaction) {
		const name = interaction.options.getString('name');
        const amount = interaction.options.getNumber('amount');
        if (isNull(amount)) amount = 0;

        var i = 0;
        for (const coin of coins.list){
            if (coin.korean_name == name && coin.market.substring(0,3) == "KRW"){
                var str = 'https://api.upbit.com/v1/candles/days?market=' + coin.market + '&count=1';

                const options = {
                    method: 'GET',
                    url: str,
                    headers: {Accept: 'application/json'}
                  };


                  request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    var object = JSON.parse(body);

                    price = object[0].trade_price;
                    total_price = amount * price;
                    var state = users.buy_coin(interaction.user.id, coin.market, coin.korean_name, amount, total_price, price);
                    if (state == 1) {
                        return interaction.reply("아직 계좌가 없네요. 계좌를 먼저 만드세요.");
                    }
                    else if (state == 2) {
                        return interaction.reply("주문 금액이 잔액보다 많습니다. 다시 시도해주세요.")
                    }
                    
                    return interaction.reply(coin.korean_name + " " + amount + "개를 " + total_price + "원에 구매완료.");
                  });
            i = 1;
            break;
            }
        }

        if (i == 0){
            return interaction.reply("코인 이름을 다시 입력해주세요 " + name + " 코인은 찾을 수 없네요");
        }
	}
};