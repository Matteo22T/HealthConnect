import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRichiesta } from './lista-richiesta';

describe('ListaRichiesta', () => {
  let component: ListaRichiesta;
  let fixture: ComponentFixture<ListaRichiesta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaRichiesta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaRichiesta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
