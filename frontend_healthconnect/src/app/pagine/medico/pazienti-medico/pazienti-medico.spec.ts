import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PazientiMedico } from './pazienti-medico';

describe('PazientiMedico', () => {
  let component: PazientiMedico;
  let fixture: ComponentFixture<PazientiMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PazientiMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PazientiMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
