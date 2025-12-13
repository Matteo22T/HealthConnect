import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaDettaglioMedico } from './visita-dettaglio-medico';

describe('VisitaDettaglioMedico', () => {
  let component: VisitaDettaglioMedico;
  let fixture: ComponentFixture<VisitaDettaglioMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitaDettaglioMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitaDettaglioMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
