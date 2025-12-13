import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaDettaglioHeader } from './visita-dettaglio-header';

describe('VisitaDettaglioHeader', () => {
  let component: VisitaDettaglioHeader;
  let fixture: ComponentFixture<VisitaDettaglioHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitaDettaglioHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitaDettaglioHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
