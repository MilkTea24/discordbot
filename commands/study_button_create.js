const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');
const {Users, Coins, Study_Time} = require('../dbObjects.js');
const study_time_collection = require('../modules/study_collection.js');
const buttons = require('../modules/button');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});


module.exports = {
	data: new SlashCommandBuilder()
		.setName('공부버튼생성')
		.setDescription('공부버튼 생성'),
	async execute(interaction) {
        await interaction.reply({components: [buttons], ephemeral:true});
        const filter = (interaction) => {
            return interaction.customId == 'time' || 'start' || 'end' || 'ranking';
        }
        const collector = interaction.channel.createMessageComponentCollector({filter});

        collector.on("collect", async (interaction) => {
            if (interaction.customId === 'start'){
                var act_id = interaction.user.id;
                console.log(act_id);
                const user = await Users.findOne({
                    where: {user_id: act_id},
                });
        
                if (user) {  
                    var study_time = study_time_collection.get(act_id);
                    if (!study_time) {
                        study_time_collection.set(act_id, moment().utcOffset(540));
                        await interaction.reply({content: `공부 시작합니다!` , ephemeral: true});
                    }
                    else {
                        await interaction.reply({content:`이미 공부 중이에요`, ephemeral: true})
                    }

                }
                else {
                    await interaction.reply({content:`회원가입 먼저 해주세요:pensive:`, ephemeral: true})
                }
            }
            else if (interaction.customId === 'time'){
                var act_id = interaction.user.id;

                var start_time = study_time_collection.get(act_id);
                if (start_time){
                    var now_time = moment().utcOffset(540);
                
                    start_time.format();
                    now_time.format();
        
                    var time = now_time.diff(start_time, "seconds");
                    let hour = Math.floor(time / 3600);
                    let minute = Math.floor(time / 60 % 60);
                    let second = Math.floor(time % 60);
                    await interaction.reply({content:`현재 ${hour}시간 ${minute}분 ${second}초 동안 공부 중이에요:book:`, ephemeral: true});
                }
                else{
                    await interaction.reply({content:`${interaction.user.username}님은 현재 놀고 계시네요..:pensive:`, ephemeral: true});
                }
            }
            else if (interaction.customId === 'end'){
                var act_id = interaction.user.id;

                const user = await Users.findOne({
                    where: {user_id: act_id},
                });
        
                if (user){
                    var start_time = study_time_collection.get(act_id);
                    study_time_collection.delete(act_id);
                    if (start_time){
                    var now_time = moment().utcOffset(540);
                
                    now_time.format();
                    start_time.format();
        
                    var time = now_time.diff(start_time, "seconds");
                    Study_Time.create({user_id: act_id, study_date: start_time.format("YYYY-MM-DD"), this_study_time: start_time, study_time: time});
        
                    let hour = Math.floor(time / 3600);
                    let minute = Math.floor(time / 60 % 60);
                    let second = Math.floor(time % 60);
                    await interaction.reply({content:`${hour}시간 ${minute}분 ${second}초 동안 공부했어요:book:`, ephemeral: true});
                    }
                    else {
                        await interaction.reply({content:`${interaction.user.username}님은 현재 놀고 계시네요..:pensive:`, ephemeral: true});
                    }
                }
                else{
                    await interaction.reply({content:`회원가입 먼저 해주세요:pensive:`, ephemeral: true})
                }
            }
            else if (interaction.customId === 'ranking'){
                var act_id = interaction.user.id;
        
                const study_times = await Study_Time.findAll({
                    include: [
                        {
                            model: Users,
                            attributes: ['user_name'], 
                            as: 'user'
                        }
                    ],
                    attributes:[
                        'user_id',
                        [sequelize.fn('sum', sequelize.col('study_time')), 'total_time']
                    ],
                    group: ['user_id'],
                    order: ['total_time', "desc"]
                })

                var rankembed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(moment().utcOffset(540).format("YYYY-MM-DD") + " 랭킹");

                var count = 1;
                for (var study_time of study_times){
                    var time = study_time.total_time;
                    let hour = Math.floor(time / 3600);
                    let minute = Math.floor(time / 60 % 60);
                    let second = Math.floor(time % 60);
                    rankembed
                    .addFields( 
                        {name: count + "등 " + study_time.user_name, value: hour + ":" + minute + ":" + second + ":clock:"}
                    )
                }

                await interaction.reply({embeds: [rankembed]});
            }
        })

        collector.on("end", async (collect) => {
            console.log("수집 완료");
        });
	},
};