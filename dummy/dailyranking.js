const { SlashCommandBuilder } = require('@discordjs/builders');
var aru = require('../timer_user_modules/timermodule_aru');
var ratchet = require('../timer_user_modules/timermodule_rat');
var tenema = require('../timer_user_modules/timermodule_tenem');
var xposbox = require('../timer_user_modules/timermodule_xpos');
var moment = require('moment');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('일일랭킹')
		.setDescription('오늘의 순위를 확인해보세요'),
	async execute(interaction) { 
        var arr = [];
        arr.push(aru);  arr.push(ratchet);  arr.push(tenema);   arr.push(xposbox);

        for (const user of arr) {
            if (isNaN(user.get_total_time())) {
            user.set_total_time(0);
             }
         }

         arr.sort(function (a, b) {
            return parseInt(b.get_total_time() + b.timer.ms / 1000) - parseInt(a.get_total_time() + a.timer.ms / 1000);
        });

        
        s = moment().utcOffset(540).format("DD") + '일\n';
        var i = 1;
        for (const user of arr){
            s += i + '등 : ' + user.get_name() + ', 총 공부시간은 ';
            const time = user.get_total_time() + user.timer.ms / 1000;
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            s += hour + '시간 ' + minute + '분 ' + second + '초,';
            if (user.timer.ms != 0) {
                s += ' 현재 공부 중\n';
            }
            else {
                s += ' 현재 쉬는 중\n';
            }
            i++;
        }

		return interaction.reply(s);
	},
};