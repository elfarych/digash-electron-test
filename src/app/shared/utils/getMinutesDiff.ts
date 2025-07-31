export const getMinutesDiffFromDate = (datetime: string): number => {
  // @ts-ignore
  const diffMs = Math.abs(new Date(datetime) - new Date());
  return Math.round(diffMs / 60000); // 60000 milliseconds in a minute
}

export const getMinutesDiffFromTimestamp = (timestamp: number): number => {
  const currentDate = new Date();
  const providedDate = new Date(timestamp);
  const differenceInMilliseconds = currentDate.getTime() - providedDate.getTime();
  return Math.floor(differenceInMilliseconds / (1000 * 60));
}
