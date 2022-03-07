const { SlashCommandBuilder } = require('@discordjs/builders');
var attacker = ['SLEDGE', 'THATCHER', 'ASH', 'THERMITE', 'TWITCH', 'MONTAGNE', 'GLAZ', 'FUZE', 'BLITZ', 'IQ', 'BUCK', 'BLACKBEARD', 'CAPITAO',
'HIBANA', 'JACKAL', 'YING', 'ZOFIA', 'DOKKAEBI', 'LION', 'FINKA', 'MAVERICK', 'NOMAD', 'GRIDLOCK', 'NOKK', 'AMARU', 'KALI',
'IANA', 'ACE', 'ZERO', 'FLORES', 'OSA']
const operator_number = 30;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('공격추천')
		.setDescription('레식 공격오퍼 추천해드립니다'),
	async execute(interaction) {
		var random = Math.floor(Math.random() * operator_number);
        return interaction.reply('\''+attacker[random]+'\' 이/가 '+ interaction.user.username+'을 기다립니다!');
	},
};