import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioPazienteMedico } from './dettaglio-paziente-medico';

describe('DettaglioPazienteMedico', () => {
  let component: DettaglioPazienteMedico;
  let fixture: ComponentFixture<DettaglioPazienteMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettaglioPazienteMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioPazienteMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
