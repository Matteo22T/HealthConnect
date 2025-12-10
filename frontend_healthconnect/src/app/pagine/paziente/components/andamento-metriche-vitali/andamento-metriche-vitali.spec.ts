import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndamentoMetricheVitali } from './andamento-metriche-vitali';

describe('AndamentoMetricheVitali', () => {
  let component: AndamentoMetricheVitali;
  let fixture: ComponentFixture<AndamentoMetricheVitali>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AndamentoMetricheVitali]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AndamentoMetricheVitali);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
