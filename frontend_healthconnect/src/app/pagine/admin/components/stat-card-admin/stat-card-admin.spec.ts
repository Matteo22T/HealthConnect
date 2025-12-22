import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCardAdmin } from './stat-card-admin';

describe('StatCardAdmin', () => {
  let component: StatCardAdmin;
  let fixture: ComponentFixture<StatCardAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatCardAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
