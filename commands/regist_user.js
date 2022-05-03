const { SlashCommandBuilder } = require('@discordjs/builders');
const Sequelize = require('sequelize');
const moment = require('moment');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
/*
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
};*/

const {Users, Coins, Study_Time} = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('회원가입')
	.setDescription('모의투자, 열품타를 이용할 수 있어요'),
	async execute(interaction) {
		var id = interaction.user.id;
		const user = await Users.findOne({
			where: {user_id: id},
		});

		if (user){
			return interaction.reply("이미 계정이 있습니다. 계정 생성일은 " + user.register_date + ".");
		}

		try{
			Users.create({user_id: id, user_name: interaction.user.username, register_date: moment().utcOffset(540).format("YYYY-MM-DD")});
			return interaction.reply("계정이 생성되었습니다. " + interaction.user.username + "님 환영합니다.");
		}
		catch(error){
			console.log(error);
			return interaction.reply("계정 생성에 실패하였습니다. 관리자에게 문의해주세요.");
		}
},
}