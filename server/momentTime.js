const moment = require('moment');
require('moment-recur');

function getWeeklyTimes(starttime, endtime, sem) {
    console.log(sem);
    console.log(starttime);
    console.log(endtime);
    let startm = moment(starttime);
    let endm = moment(endtime);

    let day = startm.day();
    console.log(day);

    let recurrence = moment(sem.STARTDATE).recur(moment(sem.ENDDATE)).every(day).daysOfWeek();

    console.log(recurrence);

    let dates = recurrence.all();
    let formattedDates = [];
    for (i in dates) {
        let date = dates[i];
        formattedDates.push(date.toISOString());
    }
    return formattedDates;
}

module.exports = {
    getWeeklyTimes: getWeeklyTimes
}
