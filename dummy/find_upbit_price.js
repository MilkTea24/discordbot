const { SlashCommandBuilder, userMention } = require('@discordjs/builders');
const request = require('request');
const coins = require('../upbit_modules/coin_info_module');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('업비트')
		.setDescription('업비트의 코인 시세를 조회해보세요')
		.addStringOption(option => option.setName('name').setDescription('코인 이름을 정자로 적어주세요')),
	async execute(interaction) {
		const name = interaction.options.getString('name');

        var i = 0;
        for (const coin of coins.list){
            if (coin.korean_name == name && coin.market.substring(0,3) == "KRW"){
                var str = 'https://api.upbit.com/v1/candles/days?market=' + coin.market + '&count=1';
                console.log(str);

                const options = {
                    method: 'GET',
                    url: str,
                    headers: {Accept: 'application/json'}
                  };


                  request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    var object = JSON.parse(body);

                    price = object[0].trade_price;
                    change_rate = object[0].change_rate * 100;
                    change_price = object[0].change_price;

                    s = moment().utcOffset(540).format("YYYY-MM-DD HH:mm:ss") + " 기준 " + coin.korean_name + " 정보\n";
                    s = s + "현재 가격: " + price.toLocaleString('ko-KR') + "원\n"; //toLocaleString('ko-KR')
                    s = s + "전일 대비 변화량: " + change_rate + "%\n";
                    s = s + "전일 대비 변화금액: " + change_price + "원\n";
                    return interaction.reply(s);
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