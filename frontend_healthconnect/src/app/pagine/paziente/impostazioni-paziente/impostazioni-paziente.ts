import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-impostazioni-paziente',
  imports: [
    FormsModule
  ],
  templateUrl: './impostazioni-paziente.html',
  styleUrl: './impostazioni-paziente.css',
})
export class ImpostazioniPaziente {
  pass = {
    attuale: '',
    nuova: '',
    conferma: ''
  };

  notifiche = {
    visite: true,
    messaggi: false
  };

  constructor() {}

  cambiaPassword() {
    if (this.pass.nuova !== this.pass.conferma) {
      alert('Le nuove password non coincidono!');
      return;
    }
    // Qui chiamerai il servizio authService.changePassword(...)
    console.log('Cambio password richiesto:', this.pass);
    alert('Password aggiornata con successo (Simulato)');

    this.pass = { attuale: '', nuova: '', conferma: '' };
  }


  salvaNotifiche() {
    console.log('Notifiche aggiornate:', this.notifiche);
    // Feedback visivo o toast notification
  }

}
