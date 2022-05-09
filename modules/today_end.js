const study_time_collection = require('../study_collection.js');

module.exports = {
    today_end: function () {
        for (var studying of study_time_collection){
            const user = await Users.findOne({
                where: {user_id: studying},
            });
    
            if (user){
                var start_time = study_time_collection.get(act_id);
                study_time_collection.delete(act_id);
                if (start_time){
                var now_time = moment().utcOffset(540);
            
                start_time.format();
                now_time.format();
    
                var time = now_time.diff(study_time, "seconds");
                Study_Time.create({user_id: act_id, study_date: start_time, study_time: time});
    
                study_time_collection.set(act_id, moment().utcOffset(540));
                console.log(act_id + " 저장 완료");
                }
            }
        }
    }
}