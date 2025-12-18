import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCardPaziente } from './stat-card-paziente';

describe('StatCardPaziente', () => {
  let component: StatCardPaziente;
  let fixture: ComponentFixture<StatCardPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatCardPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
