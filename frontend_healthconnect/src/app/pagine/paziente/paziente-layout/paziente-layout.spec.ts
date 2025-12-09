import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PazienteLayout } from './paziente-layout';

describe('PazienteLayout', () => {
  let component: PazienteLayout;
  let fixture: ComponentFixture<PazienteLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PazienteLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PazienteLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
