import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSpecializzazioni } from './lista-specializzazioni';

describe('ListaSpecializzazioni', () => {
  let component: ListaSpecializzazioni;
  let fixture: ComponentFixture<ListaSpecializzazioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaSpecializzazioni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaSpecializzazioni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
