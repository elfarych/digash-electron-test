export function timeToLocal(originalTime) {
  return originalTime;
  // const d = new Date(originalTime * 1000);
  // return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
}

export function timeToTz(originalTime, timeZone) {
  const zonedDate = new Date(
    new Date(originalTime * 1000).toLocaleString('en-US', { timeZone }),
  );
  return zonedDate.getTime() / 1000;
}
