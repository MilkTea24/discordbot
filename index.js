//열품타 서버id:"840862668432867358"
//테스트 서버id:"939036590636924998"
//군침 봇 client ID:"947493594334367784"
//테스트 봇 client ID:"969053884674879510"
//군침 봇 토큰:"OTQ3NDkzNTk0MzM0MzY3Nzg0.YhuELA.satEW01twW9_9IpNucg3IXkpghk"
//테스트 봇 토큰:"OTY5MDUzODg0Njc0ODc5NTEw.Ymnzwg.tiW9lqVJHz1Nw9QolpGioGMXZYM"

const Sequelize = require('sequelize');
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
var db = require('./models/db.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

db.run('CREATE TABLE user(id integer primary key, userid integer unique, username text)');
db.run('CREATE TABLE ')

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