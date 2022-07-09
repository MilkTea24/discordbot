const {Modal, MessageActionRow, MessageEmbed, TextInputComponent} = require('discord.js');
const {Users, Coins, Study_Time} = require('../../dbObjects.js');
const moment = require('moment');
const study_etc_button = require('../../modules/button_etc.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

module.exports = {
    data: {
        name: 'specificPeriod'
    },
    async execute (modal) {
        const startTime = modal.getTextInputValue('startTimeInput')
        const endTime = modal.getTextInputValue('endTimeInput')

        const isValidStartTime = moment(startTime, 'YYYY-MM-DD', true).isValid();
        const isValidEndTime = moment(endTime, 'YYYY-MM-DD', true).isValid();


        const startToEndDate = moment(endTime, 'YYYY-MM-DD').diff(moment(startTime, 'YYYY-MM-DD'), 'days');
        let isValidStartToEnd = 1;
        if (startToEndDate < 0) isValidStartToEnd = 0;

        if (!isValidStartTime || !isValidEndTime) {
            return modal.reply({ content: `유효하지 않은 날짜 형식입니다. 다시 시도하세요.`, ephemeral: true });
        }
        if (!isValidStartToEnd) {
            return modal.reply({ content: `시작일자와 끝일자 설정이 잘못되었습니다. 반대로 입력해주세요.`, ephemeral: true});
        }

        let studyTimes = await Study_Time.findAll({
            
            include: [
                {
                    model: Users,
                    attributes: ['user_name'],
                    required: true,
                }
            ],
            attributes:[
                'study_id',
                [sequelize.fn('sum', sequelize.col('studying_time')), 'total_time']
            ],
            group: 'study_id',
            where: { date : {[Op.and]: {[Op.gte]:startTime, [Op.lte]:endTime}}}
        })
        
        studyTimes = studyTimes.map(el => el.get({ plain: true }));
        
        var rankembed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(startTime + " ~ " + endTime + " 랭킹");

        var count = 1;

        studyTimes.sort(function(a,b) {
            return b.total_time - a.total_time;
        });

        for (let studyTime of studyTimes){
            time = studyTime.total_time;
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60 % 60);
            let second = Math.floor(time % 60);
            rankembed
            .addFields( 
                {name: count + "등 " + studyTime.user.user_name, value: hour + "시간 " + minute + "분 " + second + "초 "}
            )
            count++;
        }

        await modal.reply({embeds: [rankembed],components: [study_etc_button]});
    }
}