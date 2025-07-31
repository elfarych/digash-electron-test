export interface Psychology {
  id: number;

  title: string;
  content: string;

  sound: boolean;
  telegram: boolean;
  active: boolean;

  created: number;
  lastTrigger: number;
  watchedLast: boolean;

  occurrenceHours: number;
}

export const psychologyDefault: Psychology = {
  id: undefined,
  title: '',
  content: '',
  active: true,
  sound: true,
  telegram: false,
  occurrenceHours: 3,
  created: undefined,
  lastTrigger: undefined,
  watchedLast: true,
};
