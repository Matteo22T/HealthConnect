import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiloPaziente } from './profilo-paziente';

describe('ProfiloPaziente', () => {
  let component: ProfiloPaziente;
  let fixture: ComponentFixture<ProfiloPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfiloPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfiloPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
