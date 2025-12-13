import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciPrescrizioniMedico } from './gestisci-prescrizioni-medico';

describe('GestisciPrescrizioniMedico', () => {
  let component: GestisciPrescrizioniMedico;
  let fixture: ComponentFixture<GestisciPrescrizioniMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestisciPrescrizioniMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestisciPrescrizioniMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
