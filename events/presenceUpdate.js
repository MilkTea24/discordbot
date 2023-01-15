const offlineEnds = require('../modules/offlineWithoutEnd.js');
const studyChannelId = require('../modules/channelID.js').studyChannelId;

module.exports = {
	name: 'presenceUpdate',
	async execute(client, oldPresence, newPresence) {
        if (newPresence.status === "offline"){
            await offlineEnds.offline_end(client, studyChannelId,newPresence.member.id);
        } 	
	},
};