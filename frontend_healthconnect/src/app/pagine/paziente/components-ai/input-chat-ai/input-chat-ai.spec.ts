import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputChatAi } from './input-chat-ai';

describe('InputChatAi', () => {
  let component: InputChatAi;
  let fixture: ComponentFixture<InputChatAi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputChatAi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputChatAi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
