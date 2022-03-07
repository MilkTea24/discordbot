const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('밥사줘')
		.setDescription('불쌍한 저에게 기부해주세요'),
	async execute(interaction) {
		return interaction.reply('기업은행 979-026184-01-015로 보내주면 따뜻한 밥을 먹을 수 있어요');
	},
};