import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformazioniMedicoPaziente } from './informazioni-medico-paziente';

describe('InformazioniMedicoPaziente', () => {
  let component: InformazioniMedicoPaziente;
  let fixture: ComponentFixture<InformazioniMedicoPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformazioniMedicoPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformazioniMedicoPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
