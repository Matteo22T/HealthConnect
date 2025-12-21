import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSupporto } from './chat-supporto';

describe('ChatSupporto', () => {
  let component: ChatSupporto;
  let fixture: ComponentFixture<ChatSupporto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSupporto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSupporto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
