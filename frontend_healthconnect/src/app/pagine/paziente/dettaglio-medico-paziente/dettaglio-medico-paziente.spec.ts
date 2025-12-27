import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioMedicoPaziente } from './dettaglio-medico-paziente';

describe('DettaglioMedicoPaziente', () => {
  let component: DettaglioMedicoPaziente;
  let fixture: ComponentFixture<DettaglioMedicoPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettaglioMedicoPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioMedicoPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
