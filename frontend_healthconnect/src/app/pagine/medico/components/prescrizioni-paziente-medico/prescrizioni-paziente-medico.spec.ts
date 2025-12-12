import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescrizioniPazienteMedico } from './prescrizioni-paziente-medico';

describe('PrescrizioniPazienteMedico', () => {
  let component: PrescrizioniPazienteMedico;
  let fixture: ComponentFixture<PrescrizioniPazienteMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescrizioniPazienteMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescrizioniPazienteMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
