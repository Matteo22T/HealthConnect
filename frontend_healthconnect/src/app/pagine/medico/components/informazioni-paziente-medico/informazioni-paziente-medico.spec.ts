import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformazioniPazienteMedico } from './informazioni-paziente-medico';

describe('InformazioniPazienteMedico', () => {
  let component: InformazioniPazienteMedico;
  let fixture: ComponentFixture<InformazioniPazienteMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformazioniPazienteMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformazioniPazienteMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
