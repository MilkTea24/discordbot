const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const moment = require('moment');
const {Users, Coins, Study_Time} = require('../dbObjects.js');
const study_time_collection = require('../modules/study_collection.js');

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
        const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('start')
        .setLabel("공부시작!")
        .setEmoji('✏️')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setCustomId('time')
        .setLabel("시간확인")
        .setEmoji('⌚')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomId('end')
        .setLabel("공부끝!")
        .setEmoji('🥳')
        .setStyle('DANGER'),
        new MessageButton()
        .setCustomId('ranking')
        .setLabel("오늘의 랭킹")
        .setEmoji('📊')
        .setStyle('SECONDARY'),
    )

        await interaction.reply({components: [row]});
    },
};