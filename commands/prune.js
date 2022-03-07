const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('개소리는 최근 50개까지 삭제가능합니다')
		.addIntegerOption(option => option.setName('amount').setDescription('1~50까지만 입력하세요')),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');

		if (amount < 1 || amount > 50) {
			return interaction.reply({ content: '1~50까지만 입력하라고 했을텐데', ephemeral: true});
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: '에러!', ephemeral: true });
		});

		return interaction.reply({ content: ` \`${amount}\` 삭제완료. 복구방법은 몰?루`, ephemeral: true });
	},
};