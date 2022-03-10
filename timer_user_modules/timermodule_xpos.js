var Stopwatch = require("timer-stopwatch-dev")
var total_times;
var last_study_date;

module.exports = {
    name : "XposBox",
    timer : new Stopwatch(),
    total_time : total_times,
    last_date : last_study_date,
    get_name: function(){
        return this.name;
    },
    set_total_time: function (settotal) {
        total_times = settotal;
    },
    get_total_time: function() {
        return total_times;
    },
    add_time: function (study_time){
        total_times = total_times + study_time;
    },
    set_last_date: function (today_date) {
        last_study_date = today_date;
    },
    get_last_date: function(){
        return last_study_date;
    }
};