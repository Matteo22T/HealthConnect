import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartellaClinicaPaziente } from './cartella-clinica-paziente';

describe('CartellaClinicaPaziente', () => {
  let component: CartellaClinicaPaziente;
  let fixture: ComponentFixture<CartellaClinicaPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartellaClinicaPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartellaClinicaPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
