import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioTabs } from './calendario-tabs';

describe('CalendarioTabs', () => {
  let component: CalendarioTabs;
  let fixture: ComponentFixture<CalendarioTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioTabs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
