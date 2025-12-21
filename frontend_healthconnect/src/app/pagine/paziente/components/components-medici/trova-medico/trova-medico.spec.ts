import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrovaMedico } from './trova-medico';

describe('TrovaMedico', () => {
  let component: TrovaMedico;
  let fixture: ComponentFixture<TrovaMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrovaMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrovaMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
