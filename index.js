//군침 봇 client ID:"947493594334367784"
//테스트 봇 client ID:"969053884674879510"
//열품타 서버id:"840862668432867358"
//테스트 서버id:"939036590636924998"
//군침 봇 토큰:"OTQ3NDkzNTk0MzM0MzY3Nzg0.Gpd9uy.B6XTeTDEakyt_5yTWqz--TfGAcfBcjsGuWUk-0"
//테스트 봇 토큰:"OTY5MDUzODg0Njc0ODc5NTEw.Gxr-SS.Ys1DO8NSl-LelotKsTPcvO25VhSFyWf7QWZocI"
//테스트 서버에서 본 서버로 옮길때 channelID.js에서 채널도 옮겨주기

const Sequelize = require('sequelize');
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');

const discordModals = require('discord-modals');



const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

const client = new Client({ intents: myIntents });

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const buttonFolders = fs.readdirSync('./buttons');
for (const folder of buttonFolders) {
	const buttonFiles = fs.readdirSync(`./buttons/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of buttonFiles) {
		const button = require(`./buttons/${folder}/${file}`);
		client.buttons.set(button.data.name, button);
	}
}

const modalFolders = fs.readdirSync('./modals');
for (const folder of modalFolders) {
	const modalFiles = fs.readdirSync(`./modals/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of modalFiles) {
		const modal = require(`./modals/${folder}/${file}`);
		client.modals.set(modal.data.name, modal);
	}
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} 
	else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

discordModals(client);

client.login(token);