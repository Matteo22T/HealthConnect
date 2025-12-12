import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../../service/auth-service';
import {NgIf} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {SpecializzazioniService} from '../../../service/specializzazioni-service';
import {SpecializzazioneDTO} from '../../../model/specializzazioneDTO';
import {MessaggioDTO} from '../../../model/messaggioDTO';
import {MessaggioService} from '../../../service/messaggio-service';
import {forkJoin} from 'rxjs';
import {prenotazioneDTO} from '../../../model/prenotazioneDTO';
import {PrenotazioneService} from '../../../service/prenotazione-service';

@Component({
  selector: 'app-medico-navbar',
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './medico-navbar.html',
  styleUrl: './medico-navbar.css',
})
export class MedicoNavbar implements OnInit{
  isProfileMenuOpen = false
  nomeMedico: string = ""
  cognomeMedico: string = ""
  specializzazione: SpecializzazioneDTO | null = null;
  messaggi: MessaggioDTO[] = []
  richiesteInAttesa: prenotazioneDTO[] = []

  constructor(private auth: AuthService, private router: Router, private specService: SpecializzazioniService, private messService: MessaggioService, private prenService: PrenotazioneService, private changeDet: ChangeDetectorRef) {}

  ngOnInit(){
    const currentUser = this.auth.currentUserValue;
    this.prenService.refreshNeeded$.subscribe(() => {
      this.caricaVisiteOdierne();
    });

    if (currentUser) {
      this.nomeMedico = currentUser.nome;
      this.cognomeMedico = currentUser.cognome;
      if (currentUser.specializzazione_id != null) {
        forkJoin({
          mess: this.messService.getMessaggiNonLetti(currentUser.id),
          spec: this.specService.getSpecializzazione(currentUser.specializzazione_id),
          pren: this.prenService.getPrenotazioniInAttesaMedico(currentUser.id)
        }).subscribe({
          next: result => {
            this.specializzazione = result.spec
            this.messaggi = result.mess
            this.richiesteInAttesa = result.pren
            this.changeDet.detectChanges();
          },
          error: (err) => {
            if (err.status === 404) {
              console.error('Errore 404 specializzazione non trovata');
            } else {
              console.error('Errore server', err);
            }
          }
        })
      }
    }
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  caricaVisiteOdierne() {
    this.prenService.getPrenotazioniInAttesaMedico(this.auth.currentUserValue!.id) .subscribe({
      next:(res)=>{
        this.richiesteInAttesa=res;
        this.changeDet.detectChanges();
      }, error:(err)=>{
        console.error('Errore server', err);
      }
    });
  }
}
