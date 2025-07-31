import { Psychology } from '../../../shared/models/Psychology';
import { createReducer, on } from '@ngrx/store';
import { PsychologyActions } from './psychology.actions';

export interface PsychologyState {
  psychologyItems: Psychology[];
  loading: boolean;
  errorMessage?: string;
}

export const initialPsychologyState: PsychologyState = {
  psychologyItems: [],
  loading: false,
  errorMessage: undefined,
};

export const psychologyReducer = createReducer(
  initialPsychologyState,

  on(PsychologyActions.loadPsychologyItems, (state) => {
    return {
      ...state,
      loading: true,
      errorMessage: undefined,
    };
  }),

  on(PsychologyActions.loadPsychologyItemsSuccess, (state, { data }) => {
    return {
      ...state,
      psychologyItems: data,
      loading: false,
    };
  }),

  on(PsychologyActions.loadPsychologyItemsError, (state, { errorMessage }) => {
    return {
      ...state,
      errorMessage,
      loading: false,
    };
  }),

  on(PsychologyActions.updatePsychologyItem, (state, { data, id }) => {
    const workspaceIdxToEdit = state.psychologyItems.findIndex(
      (item) => item.id === id,
    );

    if (workspaceIdxToEdit !== -1) {
      const newList = [...state.psychologyItems];
      newList[workspaceIdxToEdit] = {
        ...state.psychologyItems[workspaceIdxToEdit],
        ...data,
      };

      return {
        ...state,
        psychologyItems: newList,
        loading: true,
      };
    }

    return state;
  }),

  on(PsychologyActions.removePsychologyItemSuccess, (state, { id }) => {
    const idxToRemove = state.psychologyItems.findIndex(
      (workspace) => workspace.id === id,
    );
    if (idxToRemove !== -1) {
      const newList = [...state.psychologyItems];
      newList.splice(idxToRemove, 1);

      return {
        ...state,
        psychologyItems: newList,
        loading: false,
      };
    }

    return state;
  }),

  on(PsychologyActions.createPsychologyItemSuccess, (state, { data }) => {
    return {
      ...state,
      loading: false,
      psychologyItems: [...state.psychologyItems, data],
    };
  }),

  on(PsychologyActions.activatePsychologySuccess, (state, { id }) => ({
    ...state,
    psychologyItems: [
      ...state.psychologyItems.map((value) =>
        value.id === id
          ? {
              ...value,
              active: true,
            }
          : value,
      ),
    ],
  })),

  on(PsychologyActions.deactivatePsychologySuccess, (state, { id }) => ({
    ...state,
    psychologyItems: [
      ...state.psychologyItems.map((value) =>
        value.id === id
          ? {
              ...value,
              active: false,
            }
          : value,
      ),
    ],
  })),

  on(
    PsychologyActions.loadPsychologyItemsError,
    PsychologyActions.createPsychologyItemError,
    PsychologyActions.removePsychologyItemError,
    PsychologyActions.updatePsychologyItemError,
    PsychologyActions.deactivatePsychologyError,
    PsychologyActions.activatePsychologyError,
    (state, { errorMessage }) => {
      return {
        ...state,
        errorMessage,
        loading: false,
      };
    },
  ),

  on(
    PsychologyActions.loadPsychologyItems,
    PsychologyActions.createPsychologyItem,
    PsychologyActions.removePsychologyItem,
    PsychologyActions.updatePsychologyItem,
    (state) => {
      return {
        ...state,
        errorMessage: undefined,
        loading: true,
      };
    },
  ),

  on(
    PsychologyActions.removePsychologyItemSuccess,
    PsychologyActions.createPsychologyItemSuccess,
    PsychologyActions.removePsychologyItemSuccess,
    PsychologyActions.updatePsychologyItemSuccess,
    PsychologyActions.activatePsychologySuccess,
    PsychologyActions.deactivatePsychologySuccess,
    (state) => {
      return {
        ...state,
        loading: false,
      };
    },
  ),
);
