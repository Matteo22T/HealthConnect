import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpostazioniPaziente } from './impostazioni-paziente';

describe('ImpostazioniPaziente', () => {
  let component: ImpostazioniPaziente;
  let fixture: ComponentFixture<ImpostazioniPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpostazioniPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpostazioniPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
