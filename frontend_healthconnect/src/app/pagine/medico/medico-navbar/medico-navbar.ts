import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../../service/auth-service';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {utenteDTO} from '../../../model/utenteDTO';
import {SpecializzazioniService} from '../../../service/specializzazioni-service';
import {SpecializzazioneDTO} from '../../../model/specializzazioneDTO';

@Component({
  selector: 'app-medico-navbar',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './medico-navbar.html',
  styleUrl: './medico-navbar.css',
})
export class MedicoNavbar implements OnInit{
  isProfileMenuOpen = false
  nomeMedico: string = ""
  cognomeMedico: string = ""
  specializzazione: SpecializzazioneDTO | null = null;

  constructor(private auth: AuthService, private router: Router, private specService: SpecializzazioniService, private changeDet: ChangeDetectorRef) {}

  ngOnInit(){
    const currentUser = this.auth.currentUserValue;

    if (currentUser) {
      this.nomeMedico = currentUser.nome;
      this.cognomeMedico = currentUser.cognome;
      if (currentUser.specializzazione_id != null) {
        //prendo la specializzazione dal db
        this.specService.getSpecializzazione(currentUser.specializzazione_id).subscribe({
          next: (spec) => {
            this.specializzazione = spec
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
}
