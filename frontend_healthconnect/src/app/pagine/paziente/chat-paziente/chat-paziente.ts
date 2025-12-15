import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Nota: HttpClient è sparito, importiamo il Service!
import { AuthService } from '../../../service/auth-service';
import { ChatService, Messaggio, utenteDTO } from '../../../service/chat.service';

@Component({
  selector: 'app-chat-paziente',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './chat-paziente.html',
  styleUrl: './chat-paziente.css'
})
export class ChatPaziente implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  contatti: utenteDTO[] = [];
  messaggi: Messaggio[] = [];
  chatSelezionata: utenteDTO | null = null;
  nuovoMessaggio: string = '';
  mioId: number | null = null;

  constructor(
    private chatService: ChatService, // <--- Usiamo il Service ora!
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.id) {
      this.mioId = currentUser.id;
      this.caricaContatti();
    }
  }

  caricaContatti() {
    if (!this.mioId) return;

    // Chiamata pulita al service
    this.chatService.getContatti(this.mioId).subscribe({
      next: (data) => {
        this.contatti = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Errore service contatti:", err)
    });
  }

  selezionaChat(medico: utenteDTO) {
    this.chatSelezionata = medico;
    this.caricaMessaggi();
  }

  caricaMessaggi() {
    if (!this.chatSelezionata || !this.mioId) return;

    // Chiamata pulita al service
    this.chatService.getHistory(this.mioId, this.chatSelezionata.id).subscribe({
        next: (msgs) => {
          this.messaggi = msgs;
          this.scrollaInBasso();
          this.cdr.detectChanges();
        },
        error: (err) => console.error("Errore service messaggi:", err)
      });
  }

  inviaMessaggio() {
    if (!this.nuovoMessaggio.trim() || !this.chatSelezionata || !this.mioId) return;

    const msg: Messaggio = {
      senderId: this.mioId,
      receiverId: this.chatSelezionata.id,
      contenuto: this.nuovoMessaggio
    };

    // Chiamata pulita al service
    this.chatService.inviaMessaggio(msg).subscribe({
      next: (ok) => {
        if (ok) {
          this.messaggi.push({
            ...msg,
            dataInvio: new Date().toISOString()
          });
          this.nuovoMessaggio = '';
          this.scrollaInBasso();
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error("Errore service invio:", err)
    });
  }

  getInitials(nome: string, cognome: string): string {
    return ((nome?.charAt(0) || '') + (cognome?.charAt(0) || '')).toUpperCase();
  }

  scrollaInBasso(): void {
    setTimeout(() => {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
    }, 100);
  }
}
