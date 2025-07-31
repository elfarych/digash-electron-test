export const getBusinessDayBeforeCurrentAt = (timestamp, daysDelta) => {
  const date = new Date(timestamp);

  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDay() - daysDelta,
      0,
      0,
      0,
      0,
    ),
  );
  // return {year: dateWithDelta.getFullYear(), month: dateWithDelta.getMonth() + 1, day: dateWithDelta.getDate()};
};
