import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPending } from './lista-pending';

describe('ListaPending', () => {
  let component: ListaPending;
  let fixture: ComponentFixture<ListaPending>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPending]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPending);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
