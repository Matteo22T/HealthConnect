import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificheMedicoPaziente } from './specifiche-medico-paziente';

describe('SpecificheMedicoPaziente', () => {
  let component: SpecificheMedicoPaziente;
  let fixture: ComponentFixture<SpecificheMedicoPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificheMedicoPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecificheMedicoPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
