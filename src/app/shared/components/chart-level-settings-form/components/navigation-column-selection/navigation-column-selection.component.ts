import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinSortingType, SortingId } from '../../../../models/CoinsSorting';

@Component({
  selector: 'app-navigation-column-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-column-selection.component.html',
  styleUrls: ['./navigation-column-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationColumnSelectionComponent implements OnChanges {
  @Input()
  public columns: CoinSortingType[] = [];

  @Input()
  public selectedColumnIds: SortingId[] = [];

  @Output()
  public selectColumn: EventEmitter<SortingId> = new EventEmitter<SortingId>();

  public selectedColumns: CoinSortingType[] = [];
  public unSelectedColumns: CoinSortingType[] = [];
  public selectorIsActive: boolean = false;

  public ngOnChanges({ selectedColumnIds, columns }: SimpleChanges) {
    if (selectedColumnIds || columns) {
      this.setColumns();
    }
  }

  public onSelectorClick(): void {
    this.selectorIsActive = !this.selectorIsActive;
  }

  public onColumnSelect(event: Event, column: CoinSortingType): void {
    event.preventDefault();
    event.stopPropagation();
    if (column.isDisabled) {
      return void 0;
    }
    this.selectColumn.emit(column.id);
  }

  private setColumns(): void {
    this.selectedColumns = this.columns.filter((c) =>
      this.selectedColumnIds.includes(c.id),
    );

    this.unSelectedColumns = this.columns.filter(
      (c) => !this.selectedColumnIds.includes(c.id),
    );
  }
}
