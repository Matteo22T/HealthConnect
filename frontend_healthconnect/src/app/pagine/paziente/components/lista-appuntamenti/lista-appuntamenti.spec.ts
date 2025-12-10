import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAppuntamenti } from './lista-appuntamenti';

describe('ListaAppuntamenti', () => {
  let component: ListaAppuntamenti;
  let fixture: ComponentFixture<ListaAppuntamenti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAppuntamenti]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAppuntamenti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
