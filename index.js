//열품타 서버id:"840862668432867358"
//테스트 서버id:"939036590636924998"
//군침 봇 client ID:"947493594334367784"
//테스트 봇 client ID:"969053884674879510"
//군침 봇 토큰:"OTQ3NDkzNTk0MzM0MzY3Nzg0.YhuELA.satEW01twW9_9IpNucg3IXkpghk"
//테스트 봇 토큰:"OTY5MDUzODg0Njc0ODc5NTEw.Ymnzwg.tiW9lqVJHz1Nw9QolpGioGMXZYM"

const Sequelize = require('sequelize');
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const cron = require('node-cron');
const study_button = require('./modules/button.js');
const { Channel } = require('diagnostics_channel');
var study_info = require('./modules/share_study_info');

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

const client = new Client({ intents: myIntents });

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
client.buttons = new Collection();
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

client.once('ready', () => {
	console.log('Ready!');
	let channel = "948481820947787836"; //공부 채널

	let scheduledMessage = cron.schedule('00 00 * * *', () => {
		console.log("scheduledMessage 실행");
		client.channels.cache.get(channel).send("하루가 끝났네요! 오늘도 열심히 공부해봐요:smile:");
		const when_date_over = require("./modules/today_end.js");
		when_date_over.today_end();
	})

	const study_channel = client.channels.cache.get("948481820947787836");
	study_info.infoembed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle("놀지말고 공부합시다:fist::fist:")
	.setDescription("init");
	study_info.promise = study_channel.send({embeds:[study_info.infoembed] ,components: [study_button]});
	count = 0;
});

client.on('interactionCreate', async interaction => {
	if (interaction.isButton()){
		const button = client.buttons.get(interaction.customId);
		if (!button) return;

		try{
			await button.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({content: 'button interaction error!', ephemeral: true});
		}
	}
	if (interaction.isCommand()){
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}	
}
});

client.on('interactionCreate', interaction => {
	console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
});

client.on('messageCreate', async (message) => {
	if (message.channelId == '948481820947787836' ){
		if (!message.author.bot){
		try{
				var sent = await study_info.promise;
				var msg = await message.channel.messages.fetch(sent.id);
				msg.delete();
				study_info.promise = client.channels.cache.get("948481820947787836").send({embeds:[study_info.infoembed] ,components: [study_button]});
		}
		catch(error){
			console.log(error);
		}	
		}
	}
});


client.login(token);