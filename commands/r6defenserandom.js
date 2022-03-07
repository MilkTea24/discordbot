const { SlashCommandBuilder } = require('@discordjs/builders');
var defender = ['SMOKE', 'MUTE', 'CASTLE', 'PULSE', 'DOC', 'ROOK', 'KAPKAN', 'TACHANKA', 'JAGER', 'BANDIT', 'FROST', 'VALKYRIE', 'CAVEIRA',
'ECHO', 'MIRA', 'LESION', 'ELA', 'VIGIL', 'MAESTRO', 'ALIBI', 'CLASH', 'KAID', 'MOZZIE', 'WARDEN', 'GOYO', 'WAMAI', 'ORYX',
'MELUSI', 'ARUNI', 'THUNDERBIRD', 'THORN']
const operator_number = 30;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('방어추천')
		.setDescription('레식 방어오퍼 추천해드립니다'),
	async execute(interaction) {
		var random = Math.floor(Math.random() * operator_number);
        return interaction.reply('\''+defender[random]+'\' 이/가 '+ interaction.user.username+'을 기다립니다!');
	},
};