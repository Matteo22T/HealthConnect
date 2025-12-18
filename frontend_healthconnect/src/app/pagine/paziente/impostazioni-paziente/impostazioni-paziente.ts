import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {AuthService} from '../../../service/auth-service';
import {validate} from '@angular/forms/signals';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-impostazioni-paziente',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './impostazioni-paziente.html',
  styleUrl: './impostazioni-paziente.css',
})
export class ImpostazioniPaziente implements OnInit{
  cambiaPasswordForm!: FormGroup;

  pass = {
    attuale: '',
    nuova: '',
    conferma: ''
  };

  notifiche = {
    visite: true,
    messaggi: false
  };

  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cambiaPasswordForm = this.fb.group({
      attuale: ['', [Validators.required]],
      nuova: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]],
      conferma: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator
      })
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const nuova = group.get('nuova')?.value;
    const conferma = group.get('conferma')?.value;
    return nuova && conferma && nuova !== conferma ? { passwordMismatch: true } : null;
  }

  cambiaPassword() {
    this.errorMessage = '';

    if (this.cambiaPasswordForm.valid){
      const {attuale, nuova} = this.cambiaPasswordForm.value;

      const pazienteId = this.authService.currentUserValue?.id;

      if(pazienteId){
        this.loading=true;
        this.authService.cambiaPassword(pazienteId,attuale, nuova).subscribe({
          next: (res) => {
            this.loading = false;
            this.cambiaPasswordForm.reset();
            alert('Password cambiata con successo')
            this.cdr.detectChanges();
          }, error: (err) => {
            this.loading = false;
            this.errorMessage = err.error || 'Errore durante il cambio password.';
            alert(this.errorMessage);
            console.error('changePassword error', err);

          }
        })
      }
    }
    else {
      this.cambiaPasswordForm.markAllAsTouched()
    }
  }


  salvaNotifiche() {
    console.log('Notifiche aggiornate:', this.notifiche);
    // Feedback visivo o toast notification
  }

}
