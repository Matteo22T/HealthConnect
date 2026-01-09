import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService, ChatMessaggioDTO } from '../../service/chat-service';
import { MedicoService } from '../../service/medico-service';

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

  // Variabili per responsive
  sidebarVisible = false;
  isMobile = false;
  isLoading = false;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private medicoService: MedicoService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.checkScreenSize();
  }

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

  // === GESTIONE RESPONSIVE === //

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;

    // Chiudi automaticamente la sidebar su desktop
    if (!this.isMobile) {
      this.sidebarVisible = false;
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }

  backToContacts() {
    if (this.isMobile) {
      this.contattoSelezionato = null;
      this.messaggi = [];
      this.sidebarVisible = true;
    }
  }

  // === GESTIONE CONTATTI E MESSAGGI === //

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

  // Gestione redirect da URL
  controllaParametriUrl() {
    this.route.queryParams.subscribe(params => {
      const idMedicoUrl = params['medicoId'];

      if (idMedicoUrl) {
        const id = Number(idMedicoUrl);
        console.log("🔗 Richiesta chat con medico ID:", id);

        //Cerco se il medico è già nella lista contatti
        const medicoGiaInLista = this.listaContatti.find(m => m.id === id);

        if (medicoGiaInLista) {
          // Ci ho già parlato, lo seleziono subito
          this.selezionaContatto(medicoGiaInLista);
        } else {
          //Chat NUOVA. Devo scaricare i suoi dati dal MedicoService
          console.log("🆕 Nuova chat! Scarico dati medico...");
          this.medicoService.getMedicoById(id).subscribe({
            next: (medicoNuovo) => {
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

    // Chiudi sidebar su mobile dopo la selezione
    if (this.isMobile) {
      this.closeSidebar();
    }
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

    this.isLoading = true;

    const msg: ChatMessaggioDTO = {
      mittente_id: this.utenteCorrenteid,
      destinatario_id: this.contattoSelezionato.id,
      testo: this.nuovoMessaggio,
      letto: false
    };

    // Aggiungo il messaggio subito alla vista (per vederlo istantaneamente)
    this.messaggi.push({ ...msg, data_invio: new Date().toISOString() });

    this.chatService.inviaMessaggio(msg).subscribe({
      next: (res) => {
        console.log("Messaggio inviato correttamente");
        this.isLoading = false;
        this.caricaContatti();
      },
      error: (err) => {
        console.error("Errore invio:", err);
        this.isLoading = false;
      }
    });

    this.nuovoMessaggio = '';
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
}
