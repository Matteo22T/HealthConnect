import { ComponentFixture, TestBed } from '@angular/core/testing';

import {MediciTabs} from './medici-tabs';

describe('MediciPaziente', () => {
  let component: MediciTabs ;
  let fixture: ComponentFixture<MediciTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediciTabs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
