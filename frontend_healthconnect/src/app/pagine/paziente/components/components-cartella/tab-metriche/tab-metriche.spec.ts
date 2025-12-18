import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMetriche } from './tab-metriche';

describe('TabMetriche', () => {
  let component: TabMetriche;
  let fixture: ComponentFixture<TabMetriche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabMetriche]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabMetriche);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
