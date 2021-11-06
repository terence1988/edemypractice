var dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

console.log(dayjs.duration(100000).as());
