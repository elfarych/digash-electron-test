export function getCurrentDateInTimezone(timezone) {
  const now = new Date();

  const options = {
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat([], options as any);

  return new Date(formatter.format(now));
}

// // Example usage: Get the current date and time in the 'America/New_York' timezone
// const currentDateInNewYork = getCurrentDateInTimezone('America/New_York');
// console.log(`Current date and time in New York: ${currentDateInNewYork}`);
//
// // Example usage: Get the current date and time in the 'Asia/Tokyo' timezone
// const currentDateInTokyo = getCurrentDateInTimezone('Asia/Tokyo');
// console.log(`Current date and time in Tokyo: ${currentDateInTokyo}`);
