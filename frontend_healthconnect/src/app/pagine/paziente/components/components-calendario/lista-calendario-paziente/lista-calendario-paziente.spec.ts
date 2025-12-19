import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCalendarioPaziente } from './lista-calendario-paziente';

describe('ListaCalendarioPaziente', () => {
  let component: ListaCalendarioPaziente;
  let fixture: ComponentFixture<ListaCalendarioPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCalendarioPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCalendarioPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
