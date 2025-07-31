import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ListingActions } from './listing.actions';
import { catchError, EMPTY, map, switchMap } from 'rxjs';
import { ListingResources } from './listing.resources';

@Injectable()
export class ListingEffects {
  constructor(
    private actions$: Actions,
    private resources: ListingResources,
  ) {}

  private loadListings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingActions.loadListings),
      switchMap(() =>
        this.resources.loadListings().pipe(
          map((data) => ListingActions.loadListingsSuccess({ data })),
          catchError(() => {
            ListingActions.loadListingsError({
              errorMessage: 'Ошибка загрузки данных',
            });
            return EMPTY;
          }),
        ),
      ),
    ),
  );
}
