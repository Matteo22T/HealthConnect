import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../service/auth-service';
import {utenteDTO} from '../../model/utenteDTO';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
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
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login(){
    this.errorMessage="";
    this.auth.login(this.email, this.password).subscribe({
      next: (utente) => {
        if (utente) {
          // Reindirizza in base al ruolo
          if (utente.ruolo === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          }

          else if (utente.ruolo === 'MEDICO') {
            this.router.navigate(['/medico']);
          }

          else if (utente.ruolo === 'PAZIENTE') {
            this.router.navigate(['/paziente/dashboard']);
          }

        } else {
          this.errorMessage = 'Email o Password errati.';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Errore server', err);
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      }
    });
  }
}
