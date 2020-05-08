import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedOrdersListComponent } from './reported-orders-list.component';

describe('ReportedOrdersListComponent', () => {
  let component: ReportedOrdersListComponent;
  let fixture: ComponentFixture<ReportedOrdersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportedOrdersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
