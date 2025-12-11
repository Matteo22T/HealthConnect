import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioMedico } from './calendario-medico';

describe('CalendarioMedico', () => {
  let component: CalendarioMedico;
  let fixture: ComponentFixture<CalendarioMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
