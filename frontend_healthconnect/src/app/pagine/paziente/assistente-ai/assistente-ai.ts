import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatSupporto } from '../components-ai/chat-supporto/chat-supporto';
import { ChatSintomi } from '../components-ai/chat-sintomi/chat-sintomi';

export type AiMode = 'SELEZIONE' | 'SUPPORTO' | 'SINTOMI';


@Component({
  selector: 'app-assistente-ai',
  standalone: true,
  imports: [
    CommonModule, ChatSupporto, ChatSintomi
  ],
  templateUrl: './assistente-ai.html',
  styleUrl: './assistente-ai.css',
})

export class AssistenteAi {
  currentMode: AiMode = 'SELEZIONE';

  selezionaModalita(modalita: AiMode) {
    this.currentMode = modalita;
  }

  tornaIndietro() {
    this.currentMode = 'SELEZIONE';
  }
}
