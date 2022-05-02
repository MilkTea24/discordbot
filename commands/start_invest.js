const { SlashCommandBuilder } = require('@discordjs/builders');
var users = require('../upbit_modules/upbit_user');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('계좌생성')
		.setDescription('모의 투자는 아직 미완입니다'),
	async execute(interaction) {
		var id = interaction.user.id;
		if (users.find_user(interaction.user.id) == 1) {
			return interaction.reply("계좌를 이미 생성하셨네요. 자금을 초기화하려면 초기화 명령어를 사용하세요.");
		}
		users.add_user(interaction.user.id, interaction.user.username);
		return interaction.reply(interaction.user.username + "님의 계좌가 생성되었습니다. 조회 명령어로 확인해보세요.")
	},
};