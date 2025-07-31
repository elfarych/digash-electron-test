import {
  defaultHorizontalLevelWithLimitOrderForm,
  HorizontalLevelWithLimitOrderForm,
} from './HorizontalLevelWithLimitOrderForm';
import { Formations } from '../Formations';

export type FormationForm = HorizontalLevelWithLimitOrderForm;

export const getFormationForm = (formationType: Formations): FormationForm => {
  switch (formationType) {
    case 'HorizontalLevelWithLimitOrder':
      return defaultHorizontalLevelWithLimitOrderForm;
    default:
      return undefined;
  }
};
