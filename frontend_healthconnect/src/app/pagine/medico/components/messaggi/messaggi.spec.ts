import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Messaggi } from './messaggi';

describe('Messaggi', () => {
  let component: Messaggi;
  let fixture: ComponentFixture<Messaggi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Messaggi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Messaggi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
