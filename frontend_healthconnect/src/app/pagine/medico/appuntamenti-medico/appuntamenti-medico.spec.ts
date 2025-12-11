import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppuntamentiMedico } from './appuntamenti-medico';

describe('AppuntamentiMedico', () => {
  let component: AppuntamentiMedico;
  let fixture: ComponentFixture<AppuntamentiMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppuntamentiMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppuntamentiMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
