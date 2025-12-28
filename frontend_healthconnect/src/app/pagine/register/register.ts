import { ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../service/auth-service';
import { SpecializzazioneDTO } from '../../model/specializzazioneDTO';
import { SpecializzazioniService } from '../../service/specializzazioni-service';
import { GoogleMapsService, PlacesAutocompleteHandle } from '../../service/google-maps-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  styleUrls: ['./register.css'],
})
export class Register implements OnInit, OnDestroy {
  @ViewChild('addressInput') set addressInput(content: ElementRef<HTMLInputElement> | undefined) {
    if (content && this.isMedico) {
      this.initPlacesAutocomplete(content.nativeElement);
    }
  }

  registerForm!: FormGroup;
  isMedico = false;
  errorMessage = '';
  specializzazioni: SpecializzazioneDTO[] = [];
  isLoading = false;
  showPassword = false;

  private placesHandle?: PlacesAutocompleteHandle;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private specializzazioniService: SpecializzazioniService,
    private googleMaps: GoogleMapsService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z]{2,63})+$'
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),
        ],
      ],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9,15}$')]],
      dataNascita: ['', [Validators.required, ageValidator(18)]],
      ruolo: ['PAZIENTE', Validators.required],
      sesso: ['', Validators.required],
      specializzazione_id: [''],
      numero_albo: [''],
      biografia: [''],
      indirizzo_studio: [''],
    });

    this.registerForm.get('ruolo')?.valueChanges.subscribe((val) => this.onRuoloChange(val));

    this.specializzazioniService.getAllSpecializzazioni().subscribe({
      next: (res) => {
        this.specializzazioni = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore caricamento specializzazioni', err),
    });
  }

  ngOnDestroy(): void {
    this.destroyPlacesAutocomplete();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onRuoloChange(ruolo: string): void {
    const medicoControls = ['specializzazione_id', 'numero_albo', 'biografia', 'indirizzo_studio'];

    if (ruolo === 'MEDICO') {
      this.isMedico = true;

      medicoControls.forEach((control) => {
        const fc = this.registerForm.get(control);
        fc?.setValidators([Validators.required]);
        fc?.updateValueAndValidity();
      });
    } else {
      this.isMedico = false;

      this.destroyPlacesAutocomplete();

      medicoControls.forEach((control) => {
        const fc = this.registerForm.get(control);
        fc?.clearValidators();
        fc?.setValue('');
        fc?.updateValueAndValidity();
      });

      this.registerForm.get('indirizzo_studio')?.updateValueAndValidity();
    }
  }

  private destroyPlacesAutocomplete(): void {
    this.placesHandle?.destroy();
    this.placesHandle = undefined;
  }

  private async initPlacesAutocomplete(inputElement: HTMLInputElement) {
    try {
      if (this.placesHandle) return;

      this.placesHandle = await this.googleMaps.mountAutocompleteOnInput(
        inputElement,
        (address: string) => {
          this.ngZone.run(() => {
            this.registerForm.get('indirizzo_studio')?.setValue(address);
            this.registerForm.get('indirizzo_studio')?.markAsTouched();
          });
        }
      );
    } catch (error) {
      console.error('Errore inizializzazione Places Autocomplete:', error);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const payload: any = { ...this.registerForm.value };

      if (!this.isMedico) {
        delete payload.specializzazione_id;
        delete payload.numero_albo;
        delete payload.biografia;
        delete payload.indirizzo_studio;
      } else {
        payload.stato_approvazione = 'PENDING';
        payload.specializzazione_id = Number(payload.specializzazione_id);
      }

      this.authService.register(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error('Errore registrazione:', err);

          const backendError = err.error;

          if (typeof backendError === 'string') {
            this.errorMessage = backendError;
          } else if (backendError && typeof backendError === 'object') {
            this.errorMessage = backendError.message || backendError.error || 'Errore durante la registrazione';
          } else {
            this.errorMessage = `Errore del server (${err.status}): Riprova più tardi.`;
          }

          this.registerForm.markAllAsTouched();
        },
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
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge ? null : {underage: true};
  };
}
