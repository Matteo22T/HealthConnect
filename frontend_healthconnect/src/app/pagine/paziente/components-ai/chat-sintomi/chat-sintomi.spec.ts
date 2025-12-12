import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSintomi } from './chat-sintomi';

describe('ChatSintomi', () => {
  let component: ChatSintomi;
  let fixture: ComponentFixture<ChatSintomi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSintomi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSintomi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
