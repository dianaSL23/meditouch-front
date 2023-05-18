import { EncryptStorage } from "encrypt-storage";
import momentTz from "moment-timezone";
import moment from "moment/moment";

const encryptStorage1 = new EncryptStorage("secret-key", {
  prefix: "@instance1",
});
function getDaysOfWeekDates() {
  const dates = {};
  let today = moment();
  dates[today.format('dddd')] = today.format("YYYY-MM-DD");

  for(let  i = 0 ; i < 6 ; i++){
    let newDate = moment(today).add(1, "days");
    dates[newDate.format('dddd')] = newDate.format("YYYY-MM-DD");
    today = newDate;
  }
  return dates;
}
function isUserAuthorized() {
  let user = encryptStorage1.getItem("meditouch_user");
  if (user) {
    return true;
  }
  return false;
}
function getUser() {
  let user = encryptStorage1.getItem("meditouch_user");
  return user;
}
const convertTZ = (date, tzString) => {
  if (date !== null && date.toString() !== "Invalid date") {
    let m = momentTz(date, "YYYY/MM/DD HH:mm:ss");
    m.tz(tzString);
    return m;
  }
  return null;
};
const formatTimeByOffset = (dateString) => {
  let localTime = momentTz.tz(new Date(), momentTz.tz.guess());
  var serverTime = localTime.clone().tz("Europe/Paris");
  serverTime = serverTime.format("YYYY/MM/DD HH:mm:ss").toString();

  localTime.tz(momentTz.tz.guess());
  localTime = localTime.format("YYYY/MM/DD HH:mm:ss").toString();

  var duration = moment.duration(moment(localTime).diff(moment(serverTime)));

  var dateLocal = moment(dateString);
  dateLocal.add(duration.asMilliseconds(), "milliseconds");
  var newDate = new Date(dateLocal);
  return newDate;
};
export const util = {
  formatTimeByOffset,
  convertTZ,
  getUser,
  isUserAuthorized,
  getDaysOfWeekDates,
};
