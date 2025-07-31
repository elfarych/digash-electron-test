import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MultipleWorkSpaceCoins } from '../../../shared/models/WorkspaceCoins';
import { workspaceDataProcessing } from './workspace-data-processing';
import { WorkspaceService } from './workspace.service';
import { AuthActions } from '../../../auth/data-access/auth.actions';
import { WorkspaceActions } from './workspace.actions';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import { Workspace } from '../../../shared/models/Workspace';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable()
export class WorkspaceEffects {
  constructor(
    private actions$: Actions,
    private service: WorkspaceService,
    private store: Store,
    public dialogService: DialogService,
  ) {}

  private closeAllDialogs(): void {
    this.dialogService.dialogComponentRefMap.forEach((dialog) =>
      dialog.destroy(),
    );
  }

  private loadWorkspaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.loadAllWorkspaces),
      switchMap(() =>
        this.service.loadWorkspaces().pipe(
          map((data) => WorkspaceActions.loadAllWorkspacesSuccess({ data })),
          catchError(() => {
            WorkspaceActions.loadAllWorkspaceError({
              errorMessage: 'Произошла ошибка во время загрузки данных',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private createWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.createWorkspace),
      switchMap(({ data }) =>
        this.service.createWorkspace(data).pipe(
          tap(() => this.closeAllDialogs()),
          map((workspace: Workspace) =>
            WorkspaceActions.createWorkspaceSuccess({ data: workspace }),
          ),
          catchError(() => {
            WorkspaceActions.createWorkspaceError({
              errorMessage:
                'Произошла ошибка во время создания нового рабочего пространства',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private editWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.editWorkspace),
      switchMap(({ data }) =>
        this.service.editWorkspace(data).pipe(
          tap(() => this.closeAllDialogs()),
          map(() => WorkspaceActions.editWorkspaceSuccess({ data })),
          catchError(() => {
            return of(
              WorkspaceActions.editWorkspaceError({
                errorMessage:
                  'Произошла ошибка во время редактирования рабочего пространства',
              }),
            );
          }),
        ),
      ),
    ),
  );

  private removeWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.removeWorkspace),
      switchMap(({ id }) =>
        this.service.removeWorkspace(id).pipe(
          tap(() => this.closeAllDialogs()),
          map(() => WorkspaceActions.removeWorkspaceSuccess({ id })),
          catchError(() => {
            WorkspaceActions.removeWorkspaceError({
              errorMessage:
                'Произошла ошибка во время удаления рабочего пространства',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  private initWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.initWorkspace),
      switchMap(({ ids }) =>
        this.service.loadMultipleWorkspace(ids).pipe(
          map((data) => {
            const processedData: MultipleWorkSpaceCoins =
              workspaceDataProcessing(data);
              
            return WorkspaceActions.initWorkspaceSuccess({
              data: processedData,
            });
          }),
          catchError((err) => {
            console.log(err);
            return of(
              WorkspaceActions.initWorkspaceError({
                errorMessage:
                  'Произошла ошибка во время загрузки монет выбранных рабочих пространств',
              }),
            )
          }),
        ),
      ),
    ),
  );

  private loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setTokens),
      map(() => WorkspaceActions.loadAllWorkspaces()),
    ),
  );

  private updateWorkspacesSorting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.updateWorkspacesSorting),
      switchMap(({ data }) =>
        this.service.updateWorkspacesSortingRequest(data).pipe(
          map((data) =>
            WorkspaceActions.updateWorkspacesSortingSuccess({ data }),
          ),
          catchError(() => {
            return of(
              WorkspaceActions.updateWorkspacesSortingError({
                errorMessage:
                  'Произошла ошибка во время обновления сортировки рабочих пространств',
              }),
            );
          }),
        ),
      ),
    ),
  );
}
