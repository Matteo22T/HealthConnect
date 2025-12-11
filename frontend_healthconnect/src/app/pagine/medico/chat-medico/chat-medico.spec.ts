import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMedico } from './chat-medico';

describe('ChatMedico', () => {
  let component: ChatMedico;
  let fixture: ComponentFixture<ChatMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
