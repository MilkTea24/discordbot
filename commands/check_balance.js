const { SlashCommandBuilder } = require('@discordjs/builders');
var users = require('../upbit_modules/upbit_user');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('계좌조회')
		.setDescription('현금과 코인 보유량을 조회해보세요'),
	async execute(interaction) {		
		var str = await users.check_balance(interaction.user.id);
		return interaction.reply(str);
	}
}