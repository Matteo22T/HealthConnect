import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService, ChatMessaggioDTO } from '../../../service/chat-service';
import { MedicoService } from '../../../service/medico-service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  utenteCorrenteid!: number;
  listaContatti: any[] = [];
  contattoSelezionato: any = null;
  messaggi: ChatMessaggioDTO[] = [];
  nuovoMessaggio: string = '';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private medicoService: MedicoService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
     const userString = localStorage.getItem('currentUser');

     if (userString) {
       const user = JSON.parse(userString);
       this.utenteCorrenteid = user.id;
       console.log("✅ Login confermato. ID Utente:", this.utenteCorrenteid);
       this.caricaContatti();
     } else {
       console.error("❌ Errore: Nessun utente loggato.");
     }
   }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  caricaContatti() {
    this.chatService.getContatti(this.utenteCorrenteid).subscribe({
      next: (data: any) => {
        this.listaContatti = data;

        this.controllaParametriUrl();

        this.cd.detectChanges();
      },
      error: (err: any) => console.error("Errore caricamento contatti:", err)
    });
  }

  // Nuova funzione per gestire il redirect
  controllaParametriUrl() {
    this.route.queryParams.subscribe(params => {
      const idMedicoUrl = params['medicoId'];

      if (idMedicoUrl) {
        const id = Number(idMedicoUrl);
        console.log("🔗 Richiesta chat con medico ID:", id);

        // 1. Cerco se il medico è già nella lista contatti
        const medicoGiaInLista = this.listaContatti.find(m => m.id === id);

        if (medicoGiaInLista) {
          // CASO A: Ci ho già parlato, lo seleziono subito
          this.selezionaContatto(medicoGiaInLista);
        } else {
          // CASO B: Chat NUOVA. Devo scaricare i suoi dati dal MedicoService
          console.log("🆕 Nuova chat! Scarico dati medico...");
          this.medicoService.getMedicoById(id).subscribe({
            next: (medicoNuovo) => {
              // Creo un oggetto compatibile con la lista
              const nuovoContatto = {
                id: medicoNuovo.id,
                nome: medicoNuovo.nome,
                cognome: medicoNuovo.cognome,
                specializzazione: medicoNuovo.specializzazione || 'Medico'
              };

              // Lo aggiungo in cima alla lista provvisoriamente
              this.listaContatti.unshift(nuovoContatto);
              this.selezionaContatto(nuovoContatto);
            },
            error: (err) => console.error("Impossibile trovare il medico:", err)
          });
        }
      }
    });
  }

  selezionaContatto(contatto: any) {
    if (this.contattoSelezionato && this.contattoSelezionato.id === contatto.id) return;
    console.log(`Cambio chat: apro Dr. ${contatto.cognome}`);

    this.contattoSelezionato = contatto;
    this.messaggi = [];
    this.cd.detectChanges();
    this.caricaMessaggi();
  }

  caricaMessaggi() {
    if (!this.contattoSelezionato) return;
    this.chatService.getStoria(this.utenteCorrenteid, this.contattoSelezionato.id).subscribe(data => {
      this.messaggi = data;
      this.cd.detectChanges();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  invia() {
      if (!this.nuovoMessaggio.trim() || !this.contattoSelezionato) return;

      const msg: ChatMessaggioDTO = {
        mittente_id: this.utenteCorrenteid,
        destinatario_id: this.contattoSelezionato.id,
        testo: this.nuovoMessaggio
      };

      // Aggiungo il messaggio subito alla vista (per vederlo istantaneamente)
      this.messaggi.push({ ...msg, data_invio: new Date().toISOString() });

      this.chatService.inviaMessaggio(msg).subscribe({
          next: (res) => {
              console.log("Messaggio inviato correttamente");
              this.caricaContatti();
          },
          error: (err) => console.error("Errore invio:", err)
      });

      this.nuovoMessaggio = '';
      setTimeout(() => this.scrollToBottom(), 100);
    }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
