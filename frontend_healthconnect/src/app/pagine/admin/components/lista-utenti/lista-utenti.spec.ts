import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUtenti } from './lista-utenti';

describe('ListaUtenti', () => {
  let component: ListaUtenti;
  let fixture: ComponentFixture<ListaUtenti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaUtenti]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaUtenti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
