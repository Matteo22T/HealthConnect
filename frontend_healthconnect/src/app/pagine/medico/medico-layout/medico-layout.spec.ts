import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoLayout } from './medico-layout';

describe('MedicoLayout', () => {
  let component: MedicoLayout;
  let fixture: ComponentFixture<MedicoLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicoLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
