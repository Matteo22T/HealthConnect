import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpostazioniMedico } from './impostazioni-medico';

describe('ImpostazioniMedico', () => {
  let component: ImpostazioniMedico;
  let fixture: ComponentFixture<ImpostazioniMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpostazioniMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpostazioniMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
