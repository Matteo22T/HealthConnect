import {ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../../service/auth-service';
import {CommonModule} from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {SpecializzazioneDTO} from '../../model/specializzazioneDTO';
import {SpecializzazioniService} from '../../service/specializzazioni-service';


declare var google: any;
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
  specializzazioni: SpecializzazioneDTO[] = [];
  isLoading = false;

  @ViewChild('addressInput') addressInput: ElementRef | undefined;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private specializzazioniService: SpecializzazioniService
  ) {
  }

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

    this.specializzazioniService.getAllSpecializzazioni().subscribe({
      next: (res) => {
        this.specializzazioni = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Errore caricamento specializzazioni", err)
      }
    })
  }

  onRuoloChange(ruolo: string) {
    const medicoControls = ['specializzazione_id', 'numero_albo', 'biografia', 'indirizzo_studio'];

    if (ruolo === 'MEDICO') {
      this.isMedico = true;

      medicoControls.forEach(control => {
        const formControl = this.registerForm.get(control);
        formControl?.setValidators([Validators.required]);
        formControl?.updateValueAndValidity();
      });

      this.cdr.detectChanges();
      setTimeout(() => {
        this.initAutocomplete();
      }, 100);

    } else {
      this.isMedico = false;
      medicoControls.forEach(control => {
        const formControl = this.registerForm.get(control);
        formControl?.clearValidators();
        formControl?.setValue('');
        formControl?.updateValueAndValidity();
      });
    }
  }

  initAutocomplete() {
    // Controlli di sicurezza
    if (!this.addressInput || !this.addressInput.nativeElement || typeof google === 'undefined') {
      return;
    }

    try {
      const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement, {
        types: ['address'],
        componentRestrictions: {country: 'it'}
      });

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();

          // Se abbiamo un indirizzo valido, lo scriviamo nel form
          if (place.geometry && place.formatted_address) {
            this.registerForm.get('indirizzo_studio')?.setValue(place.formatted_address);
          }
        });
      });
    } catch (e) {
      console.error("Errore Google Maps:", e);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const payload = {...this.registerForm.value};

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
        next: () => {
          this.isLoading = false;
          this.cdr.detectChanges()
          // Registrazione avvenuta con successo
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges()
          console.error('Errore registrazione:', err);

          // Gestione dinamica dell'errore dal Backend
          const backendError = err.error;

          // 1. Se il backend restituisce una stringa semplice (es. "Email già esistente")
          if (typeof backendError === 'string') {
            this.errorMessage = backendError;
          }
            // 2. Se il backend restituisce un oggetto JSON (es. Spring Boot standard)
          // Cerca proprietà comuni come 'message' o 'error'
          else if (backendError && typeof backendError === 'object') {
            this.errorMessage = backendError.message || backendError.error || 'Errore durante la registrazione';
          }
          // 3. Fallback sul messaggio di stato HTTP se non c'è body
          else {
            this.errorMessage = `Errore del server (${err.status}): Riprova più tardi.`;
          }

          // Segna il form come "toccato" per evidenziare eventuali campi non validi se necessario
          this.registerForm.markAllAsTouched();
        }
      });

    } else {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Completa tutti i campi obbligatori';
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

