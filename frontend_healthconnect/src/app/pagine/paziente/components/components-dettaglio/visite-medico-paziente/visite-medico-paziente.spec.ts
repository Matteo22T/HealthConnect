import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteMedicoPaziente } from './visite-medico-paziente';

describe('VisiteMedicoPaziente', () => {
  let component: VisiteMedicoPaziente;
  let fixture: ComponentFixture<VisiteMedicoPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisiteMedicoPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisiteMedicoPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
