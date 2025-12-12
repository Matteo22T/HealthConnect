import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchModeAi } from './switch-mode-ai';

describe('SwitchModeAi', () => {
  let component: SwitchModeAi;
  let fixture: ComponentFixture<SwitchModeAi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchModeAi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchModeAi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
