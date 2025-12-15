import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPaziente } from './chat-paziente';

describe('ChatPaziente', () => {
  let component: ChatPaziente;
  let fixture: ComponentFixture<ChatPaziente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPaziente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPaziente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
