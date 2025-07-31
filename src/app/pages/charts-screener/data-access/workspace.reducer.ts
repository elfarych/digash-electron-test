import { createReducer, on } from '@ngrx/store';
import { WorkspaceActions, WorkspaceStreamActions } from './workspace.actions';
import { Workspace } from '../../../shared/models/Workspace';
import { MultipleWorkSpaceCoins } from '../../../shared/models/WorkspaceCoins';

export interface WorkspaceState {
  workspaces: Workspace[];
  selectedWorkspace?: Workspace[];
  workspaceCoins: MultipleWorkSpaceCoins;
  loading: boolean;
  errorMessage: string;

  creationInProgress: boolean;
}

const initialWorkspaceState: WorkspaceState = {
  workspaces: [],
  selectedWorkspace: undefined,
  workspaceCoins: {},

  loading: true,
  errorMessage: '',
  creationInProgress: false,
};

export const workspaceReducer = createReducer(
  initialWorkspaceState,
  on(
    WorkspaceActions.loadAllWorkspacesSuccess,
    WorkspaceActions.updateWorkspacesSortingSuccess,
    (state, { data }) => {
      return {
        ...state,
        workspaces: data,
        loading: false,
        selectedWorkspace: state.selectedWorkspace
          ? state.selectedWorkspace
          : [data[0]],
      };
    },
  ),

  on(WorkspaceActions.reset, () => {
    return initialWorkspaceState;
  }),

  on(WorkspaceActions.clearWorkspaceCoins, (state) => {
    return {
      ...state,
      // workspaceCoins: {},
    };
  }),

  on(WorkspaceActions.initWorkspace, (state, { showLoading }) => {
    return {
      ...state,
      loading: showLoading,
    };
  }),

  on(WorkspaceActions.initWorkspaceSuccess, (state, { data }) => {
    return {
      ...state,
      loading: false,
      workspaceCoins: data,
    };
  }),

  on(WorkspaceActions.editWorkspaceSuccess, (state, { data }) => {
    const workspaceIdxToEdit = state.workspaces.findIndex(
      (workspace) => workspace.id === data.id,
    );

    if (workspaceIdxToEdit !== -1) {
      const newWorkspacesList = [...state.workspaces];
      newWorkspacesList[workspaceIdxToEdit] = data;

      return {
        ...state,
        workspaces: newWorkspacesList,
        selectedWorkspace: state.selectedWorkspace.map((w) =>
          data.id === w.id ? data : w,
        ),
        creationInProgress: false,
      };
    }

    return { ...state, creationInProgress: false };
  }),

  on(
    WorkspaceActions.removeWorkspaceSuccess,
    (state: WorkspaceState, { id }) => {
      const workspaceIdxToRemove = state.workspaces.findIndex(
        (workspace) => workspace.id === id,
      );
      if (workspaceIdxToRemove !== -1) {
        const newWorkspacesList = [...state.workspaces];
        newWorkspacesList.splice(workspaceIdxToRemove, 1);

        const selectedWorkspaces = state.selectedWorkspace.filter(
          (w) => w.id !== id,
        );
        return {
          ...state,
          workspaces: newWorkspacesList,
          selectedWorkspace: selectedWorkspaces.length
            ? selectedWorkspaces
            : [newWorkspacesList[0]],
        };
      }

      return state;
    },
  ),

  on(
    WorkspaceActions.createWorkspace,
    WorkspaceActions.editWorkspace,
    (state, { data }) => {
      return {
        ...state,
        creationInProgress: true,
      };
    },
  ),

  on(WorkspaceActions.createWorkspaceSuccess, (state, { data }) => {
    return {
      ...state,
      workspaces: [...state.workspaces, data],
      selectedWorkspace: [data],
      creationInProgress: false,
    };
  }),

  on(WorkspaceActions.createWorkspaceError, (state, { errorMessage }) => {
    return {
      ...state,
      errorMessage,
      creationInProgress: false,
    };
  }),

  on(WorkspaceActions.editWorkspaceError, (state, { errorMessage }) => {
    return {
      ...state,
      errorMessage,
      creationInProgress: false,
    };
  }),
  on(WorkspaceActions.selectWorkspace, (state, { id }) => {
    const workSpace = state.workspaces.find((i) => i.id === id);
    if (!workSpace) {
      return state;
    }

    const selectedWorkspace = [workSpace];

    return {
      ...state,
      selectedWorkspace,
    };
  }),

  on(WorkspaceActions.selectWorkspaceMultiple, (state, { id }) => {
    let selectedWorkspace = [...state.selectedWorkspace];
    const workSpace = state.workspaces.find((i) => i.id === id);

    if (!workSpace) {
      return state;
    }

    const index = state.selectedWorkspace.findIndex(
      (i) => i.id === workSpace.id,
    );
    if (index >= 0) {
      selectedWorkspace = [workSpace];
    } else {
      if (selectedWorkspace.length === 2) selectedWorkspace[1] = workSpace;
      else selectedWorkspace.push(workSpace);
    }

    return {
      ...state,
      selectedWorkspace,
    };
  }),

  on(WorkspaceStreamActions.workspaceDataUpdate, (state, { data, id }) => {
    if (!data.length) {
      return state;
    }

    return {
      ...state,
      workspaceCoins: { ...state.workspaceCoins, [String(id)]: data },
    };
  }),
);
