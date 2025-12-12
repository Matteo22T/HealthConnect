import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabStoriaVisite } from './tab-storia-visite';

describe('TabStoriaVisite', () => {
  let component: TabStoriaVisite;
  let fixture: ComponentFixture<TabStoriaVisite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabStoriaVisite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabStoriaVisite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
