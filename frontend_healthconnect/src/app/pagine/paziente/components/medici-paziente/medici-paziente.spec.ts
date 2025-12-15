import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediciPaziente } from './medici-paziente';

describe('MediciPaziente', () => {
  let component: MediciPaziente;
  let fixture: ComponentFixture<MediciPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediciPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediciPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
