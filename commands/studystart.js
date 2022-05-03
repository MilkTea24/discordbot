const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');
const {Users, Coins, Study_Time} = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('공부시작')
		.setDescription('공부시간을 기록할려면 실행하세요'),
	async execute(interaction) {
        var act_id = interaction.user.id;
        const user = await Users.findOne({
			where: {user_id: id},
		});
        if (user) {
            const today = await Study_Time.findOne({
                where: {user_id: id, date: }
            })
        }
	},
};



/*
var aru = require('../timer_user_modules/timermodule_aru');
var ratchet = require('../timer_user_modules/timermodule_rat');
var tenema = require('../timer_user_modules/timermodule_tenem');
var xposbox = require('../timer_user_modules/timermodule_xpos');
var moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('공부시작')
		.setDescription('공부시간을 기록할려면 실행하세요'),
	async execute(interaction) {
        if (interaction.user.id == '345866499602513921') {
            var user = Object.assign({}, aru);
            }
        else if (interaction.user.id == '335606277268832257') {
            var user = Object.assign({}, ratchet);
            }
        else if (interaction.user.id == '342181861004541953') {
            var user = Object.assign({}, tenema);
            }
        else if (interaction.user.id == '343630410497916930') {
            var user = Object.assign({}, xposbox);
            }
        
        if (user.get_last_date() != moment().utcOffset(540).format("YYYY-MM-DD") && user.timer.ms == 0){
            const time = user.get_total_time();
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            user.set_total_time(0);
            user.set_last_date(moment().utcOffset(540).format("YYYY-MM-DD"));
            user.timer.start();
            return interaction.reply({content: `오늘 첫 공부입니다! 공부 시작 시간은 ${moment().utcOffset(540).format('HH:mm:ss')}입니다\n 어제는 ${hour}시간 ${minute}분 ${second}초 공부하셨어요`, ephemeral: true});
        }
        else if (user.timer.ms != 0){
            const time = user.timer.ms / 1000;
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            return interaction.reply({content: `이미 공부 시작하셨는데요? 현재 ${hour}시간 ${minute}분 ${second}초 동안 공부 중이에요`, ephemeral: true});
        }
        else {
            user.timer.start();
            return interaction.reply({content: `${interaction.user.username}님 안녕하세요! 공부 시작 시간은 ${moment().utcOffset(540).format('HH:mm:ss')}입니다`, ephemeral: true});
        }
	},
};
*/