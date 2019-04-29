const moment = require('moment');
const nowMoment = moment().hour(0).minute(0);

module.exports = [
  {
    DAY: "Sunday",
    MOMENT: moment("YYYY-MM-DD", "2019-04-21"),
  },
  {
    DAY: "Monday",
    MOMENT: moment("YYYY-MM-DD", "2019-04-22"),
  },
  {
    DAY: "Tuesday",
    MOMENT: moment("YYYY-MM-DD", "2019-04-23"),
  },
  {
    DAY: "Wednesday",
    MOMENT: moment("YYYY-MM-DD", "2019-04-24"),
  },
  {
    DAY: "Thursday",
    MOMENT: moment("YYYY-MM-DD", "2019-04-25"),
  },
  {
    DAY: "Friday",
    MOMENT: moment("YYYY-MM-DD", "2019-04-26"),
  },
  {
    DAY: "Saturday",
    MOMENT: moment("YYYY-MM-DD", "2019-04-27"),
  },
]
