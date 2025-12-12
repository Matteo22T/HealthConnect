import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-messaggi-chat-ai',
  imports: [],
  templateUrl: './messaggi-chat-ai.html',
  styleUrl: './messaggi-chat-ai.css',
})
export class MessaggiChatAi {
  @Input() message: any; // Il singolo oggetto messaggio
  @Output() choiceSelected = new EventEmitter<any>(); // Se l'utente clicca un bottone opzione

  get isUser() {
    return this.message.sender === 'user';
  }

  onOptionClick(choice: any) {
    this.choiceSelected.emit(choice);
  }
}
