import { DepthMapSettings } from './models';

export const getDepthMapActiveExchangesList = (
  settings: DepthMapSettings,
): string[] => {
  const result: string[] = [];
  for (const key in settings.exchangesSettings) {
    if (settings.exchangesSettings[key]?.active) {
      result.push(key);
    }
  }
  return result;
};
