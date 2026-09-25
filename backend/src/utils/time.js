export function minutesFromNow(dateLike) {
  const target = new Date(dateLike).getTime();
  return Math.floor((target - Date.now()) / 60000);
}

export function isWithinMinutesFromNow(dateLike, minutes) {
  return minutesFromNow(dateLike) <= minutes;
}
