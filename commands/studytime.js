const { SlashCommandBuilder } = require('@discordjs/builders');
var aru = require('../timer_user_modules/timermodule_aru');
var ratchet = require('../timer_user_modules/timermodule_rat');
var tenema = require('../timer_user_modules/timermodule_tenem');
var xposbox = require('../timer_user_modules/timermodule_xpos');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('공부중')
		.setDescription('현재 얼마나 공부했는지 볼려면 실행하세요'),
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
        

        if (user.timer.ms != 0){
            const time = user.timer.ms / 1000;
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            return interaction.reply({content:`현재 ${hour}시간 ${minute}분 ${second}초 동안 공부 중이에요`, ephemeral: true});
        }
        else {
            return interaction.reply({content:`${interaction.user.username}님은 현재 놀고 계시네요..`, ephemeral: true});
        }
	},
};