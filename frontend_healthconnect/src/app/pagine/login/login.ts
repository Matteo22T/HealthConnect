import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../service/auth-service';
import {utenteDTO} from '../../model/utenteDTO';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
  }

  email=""
  password=""
  errorMessage=""

  login(){
    this.errorMessage="";
    this.auth.login(this.email, this.password).subscribe({
      next: (utente) => {
        if (utente) {
          // 1. SUCCESSO: L'utente è arrivato
          console.log('Benvenuto ' + utente.nome);

          // Reindirizza in base al ruolo (opzionale)
          if (utente.ruolo === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          }

          else if (utente.ruolo === 'MEDICO') {
            this.router.navigate(['/medico/dashboard']);
          }

          else if (utente.ruolo === 'PAZIENTE') {
            console.log('Paziente loggato');
            this.router.navigate(['/paziente/dashboard']);
          }

        } else {
          // 2. FALLIMENTO GESTITO: Il service ha restituito null (401 intercettato)
          this.errorMessage = 'Email o Password errati.';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Errore server', err);
        this.errorMessage = 'Si è verificato un errore di connessione.';
        this.cdr.detectChanges();
      }
    });
  }
}
