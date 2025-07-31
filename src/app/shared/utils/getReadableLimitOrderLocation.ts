import { LimitOrderLocation } from '../models/formations/LimitOrderLocation';

export const getReadableLimitOrderLocation = (location: LimitOrderLocation) => {
  switch (location) {
    case 'down':
      return 'До уровня';
    case 'up':
      return 'За уровнем';
    case 'none':
      return 'Любое место';
    case 'same':
      return 'На уровне';
  }
  return 'Неважно';
};
