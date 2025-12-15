import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenteAi } from './assistente-ai';

describe('AssistenteAi', () => {
  let component: AssistenteAi;
  let fixture: ComponentFixture<AssistenteAi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistenteAi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistenteAi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
