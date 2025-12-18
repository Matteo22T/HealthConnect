import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioPaziente } from './calendario-paziente';

describe('CalendarioPaziente', () => {
  let component: CalendarioPaziente;
  let fixture: ComponentFixture<CalendarioPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
