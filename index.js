const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('interactionCreate', interaction => {
	console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
});

client.login(token);

/*
const { SlashCommandBuilder } = require('@discordjs/builders');
var timerend = require('./studystart.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('공부끝')
		.setDescription('공부안하면 끄고 가세요'),
	async execute(interaction) {
        var time = timerend.seconds;
        timerend.stop();
        var hour = time / 3600;
        var minute = time % 3600 / 60;
        var second = time % 60;

        return interaction.reply('이번 공부는 '+ hour +'시간 '+minute + '분 '+second+'초 공부했습니다');
    },
};*/

/*
const { SlashCommandBuilder } = require('@discordjs/builders');
const Stopwatch = require("timer-stopwatch");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('공부시작')
		.setDescription('오늘의 공부를 시작하세요'),
	async execute(interaction) {
        var timer = new Stopwatch();
		timer.start();
        return interaction.reply('공부 시작');
    },
};*/