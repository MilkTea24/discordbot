const study_time_collection = require('./study_collection.js');
const {Users, Coins, Study_Time} = require('../dbObjects.js');
const moment = require('moment');
const {Collection} = require('discord.js');

module.exports = {
    today_end: async function () {
        console.log(study_time_collection.entries());
        const temp = new Collection();
        for (let [key, value] of study_time_collection.entries()){
            
            const user = await Users.findOne({
                where: {user_id: key},
            });
            

            if (user){
                var start_time = value;
                study_time_collection.delete(key);
                if (start_time){
                start_time = start_time.time;
                var now_time = moment().utcOffset(540);
            
                start_time.format();
                now_time.format();
    
                var time = now_time.diff(start_time, "seconds");
                await Study_Time.create({study_id: key, date: start_time.format("YYYY-MM-DD"), study_start_time: start_time.format(), studying_time: time});
    
                temp.set(key, {time:moment().utcOffset(540), name:user.user_name});
                console.log(key + " 저장 완료");
                }
            }
        }
        for (let [key, value] of temp.entries()){
            study_time_collection.set(key, value);
        }

        temp.clear();
    }
}