import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PazientiSenzaDiagnosi } from './pazienti-senza-diagnosi';

describe('PazientiSenzaDiagnosi', () => {
  let component: PazientiSenzaDiagnosi;
  let fixture: ComponentFixture<PazientiSenzaDiagnosi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PazientiSenzaDiagnosi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PazientiSenzaDiagnosi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
