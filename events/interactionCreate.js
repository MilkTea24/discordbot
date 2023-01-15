module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
		if (interaction.isButton()){
			const button = client.buttons.get(interaction.customId);
			if (!button) return;
	
			try{
				await button.execute(interaction, client);
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
	},
};