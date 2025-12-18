import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPrescrizioni } from './tab-prescrizioni';

describe('TabPrescrizioni', () => {
  let component: TabPrescrizioni;
  let fixture: ComponentFixture<TabPrescrizioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabPrescrizioni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabPrescrizioni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
