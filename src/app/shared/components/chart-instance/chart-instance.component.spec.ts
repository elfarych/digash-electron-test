import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartInstanceComponent } from './chart-instance.component';

describe('ChartInstanceComponent', () => {
  let component: ChartInstanceComponent;
  let fixture: ComponentFixture<ChartInstanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChartInstanceComponent]
    });
    fixture = TestBed.createComponent(ChartInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
