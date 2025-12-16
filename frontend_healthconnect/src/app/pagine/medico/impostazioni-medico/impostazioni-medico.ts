import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-impostazioni-medico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './impostazioni-medico.html',
  styleUrl: './impostazioni-medico.css'
})
export class ImpostazioniMedico {

  // Oggetti per il binding dei form
  pass = {
    attuale: '',
    nuova: '',
    conferma: ''
  };

  preferenze = {
    durataVisita: 30, // Default 30 min
    inizioLavoro: '09:00',
    fineLavoro: '18:00'
  };

  notifiche = {
    richieste: true,
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

    // Reset form
    this.pass = { attuale: '', nuova: '', conferma: '' };
  }

  salvaPreferenze() {
    // Qui salverai le preferenze nel DB (es. tabella medico_settings)
    console.log('Preferenze salvate:', this.preferenze);
    alert('Preferenze orario salvate!');
  }

  salvaNotifiche() {
    console.log('Notifiche aggiornate:', this.notifiche);
    // Feedback visivo o toast notification
  }
}
