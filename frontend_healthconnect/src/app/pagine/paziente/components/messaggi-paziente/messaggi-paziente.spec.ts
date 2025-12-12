import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessaggiPaziente } from './messaggi-paziente';

describe('MessaggiPaziente', () => {
  let component: MessaggiPaziente;
  let fixture: ComponentFixture<MessaggiPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessaggiPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessaggiPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
