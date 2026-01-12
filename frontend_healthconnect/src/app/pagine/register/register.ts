import {Component, ElementRef, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { GoogleMapsService } from '../../service/google-maps-service';
import { SpecializzazioniService } from '../../service/specializzazioni-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  errorMessage = '';
  isLoading = false;
  specializzazioni: any[] = [];

  @ViewChild('addressInput') addressInput?: ElementRef<google.maps.places.PlaceAutocompleteElement>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private googleMapsService: GoogleMapsService,
    private specializzazioniService: SpecializzazioniService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      ruolo: ['PAZIENTE', Validators.required],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dataNascita: ['', [Validators.required, this.ageValidator]],
      sesso: ['', Validators.required],
      specializzazione_id: [null],
      numero_albo: [''],
      indirizzo_studio: [''],
      biografia: ['']
    });

    // Carica le specializzazioni
    this.specializzazioniService.getAllSpecializzazioni().subscribe({
      next: (data) => {
        this.specializzazioni = data;
      },
      error: (error) => {
        console.error('Errore nel caricamento delle specializzazioni:', error);
      }
    });

    // Aggiungi o rimuovi validatori quando cambia il ruolo
    this.registerForm.get('ruolo')?.valueChanges.subscribe(async ruolo => {
      this.updateValidators(ruolo);
      if (ruolo === 'MEDICO') {
        await this.googleMapsService.loadPlaces();
      }
    });
  }

  async ngAfterViewInit() {
    await this.googleMapsService.loadPlaces();
  }

  async onAddressSelected(event: any) {
    console.log('gmp-select event:', event);

    // Nel tuo screenshot è QUI:
    const prediction = event.placePrediction ?? event.detail?.placePrediction;
    if (!prediction) {
      console.warn('placePrediction non trovata nell’evento');
      return;
    }

    const place = prediction.toPlace();

    await place.fetchFields({
      fields: ['formattedAddress', 'displayName'],
    });

    const formatted = place.formattedAddress;
    const display =
      typeof place.displayName === 'string'
        ? place.displayName
        : place.displayName?.text;

    const address = formatted || display || '';
    console.log('Address:', address);

    const ctrl = this.registerForm.get('indirizzo_studio');
    ctrl?.setValue(address);
    ctrl?.markAsDirty();
    ctrl?.markAsTouched();
    ctrl?.updateValueAndValidity();
  }

  get isMedico(): boolean {
    return this.registerForm.get('ruolo')?.value === 'MEDICO';
  }

  private updateValidators(ruolo: string) {
    const specializzazioneControl = this.registerForm.get('specializzazione_id');
    const numeroAlboControl = this.registerForm.get('numero_albo');
    const indirizzoStudioControl = this.registerForm.get('indirizzo_studio');

    if (ruolo === 'MEDICO') {
      specializzazioneControl?.setValidators([Validators.required]);
      numeroAlboControl?.setValidators([Validators.required]);
      indirizzoStudioControl?.setValidators([Validators.required]);
    } else {
      specializzazioneControl?.clearValidators();
      numeroAlboControl?.clearValidators();
      indirizzoStudioControl?.clearValidators();
    }

    specializzazioneControl?.updateValueAndValidity();
    numeroAlboControl?.updateValueAndValidity();
    indirizzoStudioControl?.updateValueAndValidity();
  }

  private ageValidator(control: any) {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18 ? null : {minAge: true};
    }

    return age >= 18 ? null : {minAge: true};
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = { ...this.registerForm.value };

      this.authService.register(formData).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error || 'Errore durante la registrazione';
          this.cd.detectChanges();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  protected readonly console = console;
}
