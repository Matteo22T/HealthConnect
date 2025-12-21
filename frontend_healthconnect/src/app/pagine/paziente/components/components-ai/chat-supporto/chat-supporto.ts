import {Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AiService, AiMessage } from '../../../../../service/ai-service';

@Component({
  selector: 'app-chat-supporto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-supporto.html',
  styleUrl: './chat-supporto.css'
})
export class ChatSupporto implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  userInput: string = '';
  isTyping: boolean = false;

  messages: AiMessage[] = [
    {
      sender: 'BOT',
      text: 'Ciao! Sono il tuo assistente per il supporto. ℹ️\nChiedimi pure come prenotare una visita, dove trovare le tue ricette o come modificare il profilo.',
      timestamp: new Date()
    }
  ];

  constructor(private aiService: AiService, private router: Router, private changeDet: ChangeDetectorRef) {}

  // Scroll automatico verso il basso quando arriva un nuovo messaggio
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const textToSend = this.userInput;

    this.messages.push({
      sender: 'USER',
      text: textToSend,
      timestamp: new Date()
    });

    this.userInput = '';
    this.isTyping = true;

    this.aiService.sendMessage(textToSend).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.isTyping = false;

          this.messages.push({
            sender: 'BOT',
            text: res.risposta,
            actionUrl: res.azioneSuggerita,
            timestamp: new Date()
          });

          this.changeDet.detectChanges();

          this.scrollToBottom();
        }, 1000);
      },
      error: (err) => {
        this.isTyping = false;
        console.error(err);
        this.messages.push({
          sender: 'BOT',
          text: 'Mi dispiace, non riesco a contattare il server in questo momento.',
          timestamp: new Date()
        });
      }
    });
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
