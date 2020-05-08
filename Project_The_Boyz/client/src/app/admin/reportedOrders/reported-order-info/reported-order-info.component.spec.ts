import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedOrderInfoComponent } from './reported-order-info.component';

describe('ReportedOrderInfoComponent', () => {
  let component: ReportedOrderInfoComponent;
  let fixture: ComponentFixture<ReportedOrderInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportedOrderInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedOrderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
