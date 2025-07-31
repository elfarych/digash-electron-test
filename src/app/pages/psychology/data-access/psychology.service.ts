import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { PsychologyActions } from './psychology.actions';
import { Psychology } from '../../../shared/models/Psychology';
import { PsychologySettingsPopupComponent } from '../components/psychology-settings-popup/psychology-settings-popup.component';
import { Observable } from 'rxjs';
import {
  selectPsychologies,
  selectPsychologyErrorMessage,
  selectPsychologyLoading,
} from './psychology.selectors';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class PsychologyService {
  constructor(
    private store: Store,
    private translateService: TranslateService,
    public dialogService: DialogService,
  ) {}

  public getPsychologyItems(): Observable<Psychology[]> {
    return this.store.select(selectPsychologies);
  }

  public getLoading(): Observable<boolean> {
    return this.store.select(selectPsychologyLoading);
  }

  public getErrorMessage(): Observable<string> {
    return this.store.select(selectPsychologyErrorMessage);
  }

  public loadPsychology(): void {
    this.store.dispatch(PsychologyActions.loadPsychologyItems());
  }

  public psychologyWatched(id: number): void {
    this.store.dispatch(PsychologyActions.psychologyWatched({ id }));
  }

  public activate(id: number): void {
    this.store.dispatch(PsychologyActions.activatePsychology({ id }));
  }

  public deactivate(id: number): void {
    this.store.dispatch(PsychologyActions.deactivatePsychology({ id }));
  }

  public initPsychologyCreation(data: Psychology): void {
    this.store.dispatch(PsychologyActions.createPsychologyItem({ data }));
  }

  public initPsychologyEdit(data: Psychology, id: number): void {
    this.store.dispatch(PsychologyActions.updatePsychologyItem({ data, id }));
  }

  public async initRemovePsychology(psychology: Psychology): Promise<void> {
    // await this.confirmationService.confirm(`Вы уверены что хотите удалить "${psychology.title}"?`, 'Удаление психологии', 'error');
    this.store.dispatch(
      PsychologyActions.removePsychologyItem({ id: psychology.id }),
    );
  }

  public openCreatePsychologyDialog(): void {
    this.dialogService.open(PsychologySettingsPopupComponent, {
      width: '920px',
      styleClass: 'digah-dialog',
      header: this.translateService.instant('psychology.title'),
      maximizable: true,
      draggable: true,
    });
  }

  public openEditPsychologyDialog(data: Psychology): void {
    this.dialogService.open(PsychologySettingsPopupComponent, {
      header: this.translateService.instant('psychology.title'),
      width: '920px',
      styleClass: 'digah-dialog',
      maximizable: true,
      draggable: true,
      data: { data, edit: true },
    });
  }
}
