import { AppTheme } from '../models/Auth';

export const getChartThemeColors = (
  theme: AppTheme,
  showGrid: boolean,
): { [key: string]: string } => ({
  textLG: theme === 'dark' ? '#fff' : '#000',
  llBack: theme === 'dark' ? '#131518' : 'rgba(255, 255, 255, .77)',
  back: theme === 'dark' ? '#131518' : '#fff',
  grid: !showGrid
    ? 'transparent'
    : theme === 'dark'
      ? 'rgba(43, 43, 67, 1)'
      : '#f2f2f7',
  // grid: 'rgba(0,0,0,.0)'
});
