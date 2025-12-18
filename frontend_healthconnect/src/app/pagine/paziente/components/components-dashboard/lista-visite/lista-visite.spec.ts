import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVisite } from './lista-visite';

describe('ListaVisite', () => {
  let component: ListaVisite;
  let fixture: ComponentFixture<ListaVisite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaVisite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaVisite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
