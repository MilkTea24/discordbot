const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('군침이')
		.setDescription('군침에게 인사를 보내보세요'),
	async execute(interaction) {
		return interaction.reply('군침이 싹도노~');
	},
};