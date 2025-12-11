import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {utenteDTO} from '../../../model/utenteDTO';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../../service/auth-service';
import {VisitaService} from '../../../service/visita-service';

@Component({
  selector: 'app-pazienti-medico',
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './pazienti-medico.html',
  styleUrl: './pazienti-medico.css',
})
export class PazientiMedico implements OnInit{

  pazienti: utenteDTO[] = []
  pazientiFiltrati: utenteDTO[] = []
  campoRicerca: string = '';

  constructor(private auth: AuthService, private changeDet: ChangeDetectorRef, private visService: VisitaService, private router: Router) {}

  ngOnInit() {
    const currentUser = this.auth.currentUserValue;
    if (currentUser) {
      this.visService.getListaPazientiMedico(currentUser.id).subscribe({
        next: res => {
          this.pazienti = res;
          this.pazientiFiltrati = res;
          this.changeDet.detectChanges();
        },
        error : err => {
          if (err === 404) {
            console.error('Errore 404 pazienti non trovati',err);
          }
          else {
            console.error('Errore server', err);
          }
        }
      })
    }
  }

  ricercaPazienti() {
    const testo = this.campoRicerca.toLowerCase().trim();

    //se il campo è vuoto non faccio nulla
    if (!testo) {
      this.pazientiFiltrati = [...this.pazienti];
      return;
    }

    this.pazientiFiltrati = this.pazienti.filter(paziente => {
      const nomeCompleto = (paziente.nome?.toLowerCase() || '') + ' ' + (paziente.cognome?.toLowerCase() || '');
      return nomeCompleto.includes(testo);
    })
  }


  apriProfilo(paz: utenteDTO) {
    this.router.navigate(['/medico/paziente', paz.id]);
  }
}
