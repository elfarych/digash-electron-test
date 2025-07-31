import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { ListingActions } from './listing.actions';
import { Listing } from '../utils/models/listing.model';
import { selectListings } from './listing.selectors';

@Injectable({ providedIn: 'root' })
export class ListingFacade {
  constructor(private store: Store) {}

  public getListings(): Observable<Listing[]> {
    return this.store.select(selectListings);
  }

  public loadListings(): void {
    this.store.dispatch(ListingActions.loadListings());
  }
}
