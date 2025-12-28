import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth-service';
import { UtenteService } from '../../../service/utente-service';

// Interfaccia per i dati delle notifiche
export interface ImpostazioniNotifiche {
  utenteId: number;
  notificheEmail: boolean;
}

@Component({
  selector: 'app-impostazioni-medico',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './impostazioni-paziente.html',
  styleUrl: './impostazioni-paziente.css'
})
export class ImpostazioniPaziente implements OnInit {
  cambiaPasswordForm!: FormGroup;
  loading = false;
  errorMessage = '';

  impostazioni: ImpostazioniNotifiche = {
    utenteId: 0,
    notificheEmail: false
  };
  utenteId: number | null = null;

  constructor(
    private authService: AuthService,
    private utenteService: UtenteService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cambiaPasswordForm = this.fb.group({
      attuale: ['', [Validators.required]],
      nuova: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]],
      conferma: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator
    });


    const user = this.authService.currentUserValue;
    if (user) {
      this.utenteId = user.id;
      this.impostazioni.utenteId = user.id;

      this.caricaImpostazioniNotifiche(user.id);
    }
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const nuova = group.get('nuova')?.value;
    const conferma = group.get('conferma')?.value;
    return nuova && conferma && nuova !== conferma ? { passwordMismatch: true } : null;
  }

  cambiaPassword() {
    this.errorMessage = '';

    if (this.cambiaPasswordForm.valid && this.utenteId) {
      const { attuale, nuova } = this.cambiaPasswordForm.value;

      this.loading = true;
      this.authService.cambiaPassword(this.utenteId, attuale, nuova).subscribe({
        next: (res) => {
          this.loading = false;
          this.cambiaPasswordForm.reset();
          alert('Password cambiata con successo');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error || 'Errore durante il cambio password.';
          alert(this.errorMessage);
          console.error('changePassword error', err);
        }
      });
    } else {
      this.cambiaPasswordForm.markAllAsTouched();
    }
  }

  caricaImpostazioniNotifiche(id: number) {
    this.utenteService.getImpostazioni(id).subscribe({
      next: (res) => {
        if (res) {
          this.impostazioni = res;
          console.log('Stato notifiche caricato:', this.impostazioni.notificheEmail);
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error("Errore caricamento preferenze", err)
    });
  }

  salvaPreferenze() {
    if (this.utenteId) {
      this.utenteService.aggiornaImpostazioni(this.utenteId).subscribe({
        next: (nuovoStato) => {
          console.log('Preferenze salvate. Nuovo stato:', nuovoStato);
          this.impostazioni.notificheEmail = nuovoStato;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Errore salvataggio preferenze', err);
          alert('Errore nel salvataggio delle preferenze');
          this.impostazioni.notificheEmail = !this.impostazioni.notificheEmail;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
