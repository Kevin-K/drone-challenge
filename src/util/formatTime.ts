import moment = require("moment");
export function formatTime(time: Date): string {
  return moment(time).format("HH:mm:ss");
}
