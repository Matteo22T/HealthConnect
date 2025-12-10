import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPrescrizioni } from './lista-prescrizioni';

describe('ListaPrescrizioni', () => {
  let component: ListaPrescrizioni;
  let fixture: ComponentFixture<ListaPrescrizioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPrescrizioni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPrescrizioni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
