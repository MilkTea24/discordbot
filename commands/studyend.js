const { SlashCommandBuilder } = require('@discordjs/builders');
var aru = require('../modules/timermodule_aru');
var ratchet = require('../modules/timermodule_rat');
var tenema = require('../modules/timermodule_tenem');
var xposbox = require('../modules/timermodule_xpos');
var moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('공부끝')
		.setDescription('쉬고 싶다면 실행하세요 근데 벌써 쉬겠어?'),
	async execute(interaction) {
		//개인별로 공부시간을 측정하기 위하여 개인별 모듈을 따로 생성해 매크로 실행시 개인별 모듈을 불러온다
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

        //타이머가 작동중일때(=타이머 시간이 0이 아닐때) 공부종료 커맨드를 실행하면 결과를 보여준다
        if (user.timer.ms != 0){
            const time = user.timer.ms / 1000;
            user.add_time(time);
            const total = user.get_total_time();

            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);

            let totalhour = Math.floor(total / 3600);
            let totalminute = Math.floor(total / 60 % 60);
            let totalsecond = Math.floor(total % 60);
            user.timer.stop();
            user.timer.reset();
            return interaction.reply({content: `${hour}시간 ${minute}분 ${second}초 동안 공부했어요\n 총 공부 시간은 ${totalhour}시간 ${totalminute}분 ${totalsecond}초`, ephemeral: true});
        }
        //타이머가 작동중이지 않으면 따로 안내
        else {
            return interaction.reply({content:`${interaction.user.username}님은 시작도 안했는데 쉬고 싶나요`, ephemeral: true});
        }
	},
};