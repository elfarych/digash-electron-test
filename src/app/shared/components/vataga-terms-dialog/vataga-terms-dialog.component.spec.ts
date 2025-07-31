import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatagaTermsDialogComponent } from './vataga-terms-dialog.component';

describe('VatagaTermsDialogComponent', () => {
  let component: VatagaTermsDialogComponent;
  let fixture: ComponentFixture<VatagaTermsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VatagaTermsDialogComponent]
    });
    fixture = TestBed.createComponent(VatagaTermsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
