module.exports = {
	name: 'modalSubmit',
	async execute(client, modal) {
        const modal_ = client.modals.get(modal.customId);
        if (!modal_) return;
    
        try{
            await modal_.execute(modal);
        }
        catch (error) {
            console.error(error);
            await modal.reply({content: 'There was an error while executing this modal!', ephemeral: true});
        }
	},
};