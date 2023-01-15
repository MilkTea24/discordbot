const cron = require('node-cron');
const studyButton = require('../modules/studyMainButton.js');
const coinButton = require('../modules/coinMainButton.js');
const { MessageEmbed } = require('discord.js');
const IDs = require('../modules/channelID.js');

const studyChannelId = IDs.studyChannelId;
const coinChannelId = IDs.coinChannelId;
const casinoCHannelId = IDs.casinoChannelId;

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		let scheduledMessage = cron.schedule('00 00 * * *', () => {
			console.log("scheduledMessage 실행");
			client.channels.cache.get(studyChannelId).send("하루가 끝났네요! 오늘도 열심히 공부해봐요:smile:");
			const when_date_over = require("../modules/today_end.js");
			when_date_over.today_end();
		})
		
		const studyChannel = client.channels.cache.get(studyChannelId);
		let infoembed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle("놀지말고 공부합시다:fist::fist:")
		.setDescription("init");
		studyChannel.send({embeds:[infoembed] ,components: [studyButton]});
	
		const coinChannel = client.channels.cache.get(coinChannelId);
		let coinEmbed = new MessageEmbed()
		.setColor('#ff58b4')
		.setTitle("돈을 벌었으면 투자해야죠! <:3080dogegirl:987678955807051806>")
		.setAuthor({ name: "GO UPbit", iconURL: 'https://miro.medium.com/max/3150/1*b7E3KUdA2dY2TP2P9Q8O-Q.png', url:'https://upbit.com/exchange?code=CRIX.UPBIT.KRW-BTC'})
		.setDescription("init");
		coinChannel.send({embeds:[coinEmbed], components: [coinButton]});
	},
};