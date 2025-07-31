import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatagaProfileComponent } from './vataga-profile.component';

describe('VatagaProfileComponent', () => {
  let component: VatagaProfileComponent;
  let fixture: ComponentFixture<VatagaProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VatagaProfileComponent]
    });
    fixture = TestBed.createComponent(VatagaProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
