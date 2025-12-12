import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessaggiChatAi } from './messaggi-chat-ai';

describe('MessaggiChatAi', () => {
  let component: MessaggiChatAi;
  let fixture: ComponentFixture<MessaggiChatAi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessaggiChatAi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessaggiChatAi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
