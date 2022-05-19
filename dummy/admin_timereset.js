const { SlashCommandBuilder } = require('@discordjs/builders');
var aru = require('../timer_user_modules/timermodule_aru');
var ratchet = require('../timer_user_modules/timermodule_rat');
var tenema = require('../timer_user_modules/timermodule_tenem');
var xposbox = require('../timer_user_modules/timermodule_xpos');
var moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('시간초기화')
		.setDescription('개발자 전용이다 건들지 마라')
        .addStringOption(option => option.setName('name').setDescription('초기화 대상')),
	async execute(interaction) {
		if (interaction.user.id == '335606277268832257'){
            const name = interaction.options.getString('name');
            if (name == aru.get_name()){
                var user = Object.assign({}, aru);
            }
            else if (name == tenema.get_name()){
                var user = Object.assign({}, aru);
            }
            else if (name == xposbox.get_name()){
                var user = Object.assign({}, xposbox);
            }
            else return interaction.reply({content:`${name}이 없네요 다시 입력해주세요`, ephemeral: true});

            if (user.timer.ms != 0){
                const time = user.timer.ms / 1000;
                user.add_time(time);
                const total = user.get_total_time();
                user.set_total_time(0);
    
                let hour = Math.floor(time / 3600);
                let minute = Math.floor(time / 60 % 60);
                let second = Math.floor(time % 60);
    
                let totalhour = Math.floor(total / 3600);
                let totalminute = Math.floor(total / 60 % 60);
                let totalsecond = Math.floor(total % 60);
                user.timer.stop();
                user.timer.reset();
                return interaction.reply(user.name + '님의 시간은 초기화되었어요.');
            }

            else {
                user.set_total_time(0);
                return interaction.reply(user.name + '님의 시간은 초기화되었어요.');
            }


        }
        else {
            interaction.reply({content:`너는 권한이 없어. 저리가.`, ephemeral:true});
        }
	},
};