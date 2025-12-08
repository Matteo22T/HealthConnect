import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVisita } from './lista-visita';

describe('ListaVisita', () => {
  let component: ListaVisita;
  let fixture: ComponentFixture<ListaVisita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaVisita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaVisita);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
