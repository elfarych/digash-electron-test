import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {catchError, interval, map, mergeMap, of, switchMap, tap} from 'rxjs';
import {PsychologyActions} from './psychology.actions';
import {PsychologyResources} from './psychology.resources';
import {Psychology} from '../../../shared/models/Psychology';
import {extractErrorMessage} from '../../../shared/utils/extractErrorMessage';
import {AuthActions} from '../../../auth/data-access/auth.actions';
import {DialogService} from 'primeng/dynamicdialog';
import {PsychologyPopupComponent} from '../components/psychology-popup/psychology-popup.component';

@Injectable()
export class PsychologyEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private resources: PsychologyResources,
    public dialogService: DialogService,
  ) {
  }

  private closeAllDialogs(): void {
    this.dialogService.dialogComponentRefMap.forEach((dialog) =>
      dialog.destroy(),
    );
  }

  private openUnwatchedPsychologyItems(psychology: Psychology): void {
    if (
      !psychology.watchedLast &&
      !this.dialogService.dialogComponentRefMap.size
    ) {
      document.querySelectorAll('audio').forEach(el => el.pause());
      const audio = new Audio();
      audio.src = `../../../assets/sounds/default.mp3`;
      audio.load();
      audio.play();

      this.dialogService.open(PsychologyPopupComponent, {
        header: psychology.title,
        styleClass: 'digah-dialog',
        width: '720px',
        data: psychology,
      });
    }
  }

  private loadPsychologyItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PsychologyActions.loadPsychologyItems),
      switchMap(() =>
        this.resources.loadPsychologyItems().pipe(
          tap((data: Psychology[]) =>
            data.forEach((value) => this.openUnwatchedPsychologyItems(value)),
          ),
          map((data) => PsychologyActions.loadPsychologyItemsSuccess({data})),
          catchError(() => {
            return of(
              PsychologyActions.loadPsychologyItemsError({
                errorMessage: 'Произошла ошибка во время загрузки данных',
              }),
            );
          }),
        ),
      ),
    ),
  );

  private createPsychologyItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PsychologyActions.createPsychologyItem),
      switchMap(({data}) =>
        this.resources.createPsychologyItem(data).pipe(
          tap(() => this.closeAllDialogs()),
          map((data: Psychology) =>
            PsychologyActions.createPsychologyItemSuccess({data}),
          ),
          catchError(() => {
            return of(
              PsychologyActions.createPsychologyItemError({
                errorMessage: 'Максимальное кол-во психологий - 4',
              }),
            );
          }),
        ),
      ),
    ),
  );

  private updatePsychologyItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PsychologyActions.updatePsychologyItem),
      switchMap(({data, id}) =>
        this.resources.updatePsychologyItem(data, id).pipe(
          tap(() => this.closeAllDialogs()),
          map((data: Psychology[]) =>
            PsychologyActions.updatePsychologyItemSuccess({data}),
          ),
          catchError(() => {
            return of(
              PsychologyActions.updatePsychologyItemError({
                errorMessage:
                  'Произошла ошибка во время редактирования психологии',
              }),
            );
          }),
        ),
      ),
    ),
  );

  private removeWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PsychologyActions.removePsychologyItem),
      switchMap(({id}) =>
        this.resources.removePsychologyItem(id).pipe(
          tap(() => this.closeAllDialogs()),
          map(() => PsychologyActions.removePsychologyItemSuccess({id})),
          catchError(() => {
            return of(
              PsychologyActions.removePsychologyItemError({
                errorMessage: 'Произошла ошибка во время удаления психологии',
              }),
            );
          }),
        ),
      ),
    ),
  );

  private activatePsychology$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PsychologyActions.activatePsychology),
      mergeMap(({id}) =>
        this.resources.activate(id).pipe(
          map(() => PsychologyActions.activatePsychologySuccess({id})),
          catchError((error) =>
            of(
              PsychologyActions.activatePsychologyError({
                errorMessage: extractErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private deactivatePsychology$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PsychologyActions.deactivatePsychology),
      mergeMap(({id}) =>
        this.resources.deactivate(id).pipe(
          map(() => PsychologyActions.deactivatePsychologySuccess({id})),
          catchError((error) =>
            of(
              PsychologyActions.deactivatePsychologyError({
                errorMessage: extractErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private psychologyWatched$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PsychologyActions.psychologyWatched),
        mergeMap(({id}) => this.resources.psychologyWatched(id)),
      ),
    {dispatch: false},
  );

  private loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setTokens),
      map(() => PsychologyActions.loadPsychologyItems()),
    ),
  );

  private loginSuccessInterval$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.setTokens),
        switchMap(() =>
          interval(2 * 60 * 1000).pipe(
            map(() => PsychologyActions.loadPsychologyItems()),
          ),
        ),
      )
  );
}
