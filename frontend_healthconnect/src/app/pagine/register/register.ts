import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../../service/auth-service';
import {CommonModule} from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {SpecializzazioneDTO} from '../../model/specializzazioneDTO';



@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  isMedico: boolean = false;
  errorMessage: string = '';
  specializzazioni: SpecializzazioneDTO[] = [{ id:0, nome: 'Cardiologia'}];


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z]{2,63})+$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]],
      telefono: ['', [Validators.required, Validators.pattern("^[0-9]{9,15}$")]],
      dataNascita: ['', [Validators.required, ageValidator(18)]],
      ruolo: ['PAZIENTE', Validators.required],
      sesso: ['', Validators.required],
      specializzazione_id: [''],
      numero_albo: [''],
      biografia: [''],
      indirizzo_studio: ['']
    });

    this.registerForm.get('ruolo')?.valueChanges.subscribe(val => {
      this.onRuoloChange(val);
    });
  }

  onRuoloChange(ruolo: string) {
    const medicoControls = ['specializzazione_id', 'numero_albo', 'biografia', 'indirizzo_studio'];

    if (ruolo === 'MEDICO') {
      this.isMedico = true;
      // Aggiungi validatori se è medico
      medicoControls.forEach(control => {
        const formControl = this.registerForm.get(control);
        formControl?.setValidators([Validators.required]);
        formControl?.updateValueAndValidity();
      });

    } else {
      this.isMedico = false;
      // Rimuovi validatori e resetta i valori se non è medico
      medicoControls.forEach(control => {
        const formControl = this.registerForm.get(control);
        formControl?.clearValidators();
        formControl?.setValue('');
        formControl?.updateValueAndValidity();
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const payload = { ...this.registerForm.value };

      // Rimuovi i campi medico se è paziente
      if (!this.isMedico) {
        delete payload.specializzazione_id;
        delete payload.numero_albo;
        delete payload.biografia;
        delete payload.indirizzo_studio;
      } else {
        // Se è medico, imposta stato default
        payload.stato_approvazione = 'PENDING';
        payload.specializzazione_id = Number(payload.specializzazione_id);
      }

      this.authService.register(payload).subscribe({
        next: (res) => {
          console.log('Registrazione OK', res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Errore durante la registrazione';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Completa tutti i campi obbligatori';
      this.cdr.detectChanges();
    }
  }
}

// Funzione validatrice personalizzata
export function ageValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Se il campo è vuoto, lasciamo che se ne occupi Validators.required
    if (!control.value) {
      return null;
    }

    // Convertiamo il valore del controllo in una data
    const birthDate = new Date(control.value);
    const today = new Date();

    // Calcolo base dell'età (anno corrente - anno nascita)
    let age = today.getFullYear() - birthDate.getFullYear();

    // Correzione precisa: se il compleanno non è ancora avvenuto quest'anno, sottrai 1
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Se l'età è inferiore alla minima richiesta, restituisci l'errore
    return age >= minAge ? null : { underage: true };
  };
}

