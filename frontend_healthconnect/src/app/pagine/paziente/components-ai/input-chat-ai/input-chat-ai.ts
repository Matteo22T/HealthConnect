import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-input-chat-ai',
  imports: [],
  templateUrl: './input-chat-ai.html',
  styleUrl: './input-chat-ai.css',
})
export class InputChatAi {
  @Input() isDisabled = false;
  @Output() sendText = new EventEmitter<string>();

  inputText = '';

  sendMessage() {
    if (this.inputText.trim() && !this.isDisabled) {
      this.sendText.emit(this.inputText);
      this.inputText = ''; // Pulisce
    }
  }
}
