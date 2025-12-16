import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiMetricaForm } from './aggiungi-metrica-form';

describe('AggiungiMetricaForm', () => {
  let component: AggiungiMetricaForm;
  let fixture: ComponentFixture<AggiungiMetricaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggiungiMetricaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggiungiMetricaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
