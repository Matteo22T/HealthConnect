import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitePazienteMedico } from './visite-paziente-medico';

describe('VisitePazienteMedico', () => {
  let component: VisitePazienteMedico;
  let fixture: ComponentFixture<VisitePazienteMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitePazienteMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitePazienteMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
