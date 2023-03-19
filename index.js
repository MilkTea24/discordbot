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
