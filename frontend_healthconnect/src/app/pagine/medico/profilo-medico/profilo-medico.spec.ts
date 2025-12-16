import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiloMedico } from './profilo-medico';

describe('ProfiloMedico', () => {
  let component: ProfiloMedico;
  let fixture: ComponentFixture<ProfiloMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfiloMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfiloMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
