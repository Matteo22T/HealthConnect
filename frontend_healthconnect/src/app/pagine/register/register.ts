import {AfterViewInit, ChangeDetectorRef,Component,CUSTOM_ELEMENTS_SCHEMA,OnDestroy,OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AbstractControl,FormBuilder,FormGroup,ReactiveFormsModule,ValidationErrors,ValidatorFn,Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../service/auth-service';
import { GoogleMapsService } from '../../service/google-maps-service';
import { SpecializzazioniService } from '../../service/specializzazioni-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register.html',
  styleUrl: './register.css'
})


export class Register implements OnInit, AfterViewInit, OnDestroy {
  registerForm!: FormGroup;
  showPassword = false;
  errorMessage = '';
  isLoading = false;
  specializzazioni: any[] = [];

  private destroy$ = new Subject<void>();
  private addressSelectedFromList = false;
  private lastSelectedAddress = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private googleMapsService: GoogleMapsService,
    private specializzazioniService: SpecializzazioniService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      ruolo: ['PAZIENTE', Validators.required],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]
      ],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dataNascita: ['', [Validators.required, this.ageValidator]],
      sesso: ['', Validators.required],
      specializzazione_id: [null],
      numero_albo: [''],
      indirizzo_studio: [''],
      biografia: ['']
    });

    this.registerForm
      .get('indirizzo_studio')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        const v = (val ?? '').toString();
        if (v !== this.lastSelectedAddress) {
          this.addressSelectedFromList = false;
        }
      });

    this.updateValidators(this.registerForm.get('ruolo')?.value);

    this.specializzazioniService.getAllSpecializzazioni().subscribe({
      next: (data) => {
        this.specializzazioni = data;
      },
      error: (error) => {
        console.error('Errore nel caricamento delle specializzazioni:', error);
      }
    });

    this.registerForm
      .get('ruolo')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(async (ruolo) => {
        this.updateValidators(ruolo);

        if (ruolo === 'MEDICO') {
          await this.googleMapsService.loadPlaces();
        } else {
          this.addressSelectedFromList = false;
          this.lastSelectedAddress = '';

          this.registerForm.patchValue(
            {
              specializzazione_id: null,
              numero_albo: '',
              indirizzo_studio: '',
              biografia: ''
            },
            { emitEvent: false }
          );

          this.registerForm.get('specializzazione_id')?.markAsPristine();
          this.registerForm.get('numero_albo')?.markAsPristine();
          this.registerForm.get('indirizzo_studio')?.markAsPristine();
          this.registerForm.get('biografia')?.markAsPristine();
        }
      });
  }

  async ngAfterViewInit() {
    if (this.registerForm.get('ruolo')?.value === 'MEDICO') {
      await this.googleMapsService.loadPlaces();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //appeno seleziono un indirizzo dalla lista
  async onAddressSelected(event: any) {
    const prediction = event.placePrediction ?? event.detail?.placePrediction;
    if (!prediction) return;

    //prediction era soltanto un PlacePrediction mentre ora lo trasformo in Place che è un oggetto
    const place = prediction.toPlace();


    await place.fetchFields({
      fields: ['formattedAddress', 'displayName']
    });

    const formatted = place.formattedAddress;
    const display = typeof place.displayName === 'string' ? place.displayName : place.displayName?.text;
    const address = formatted || display || '';

    this.addressSelectedFromList = true;
    this.lastSelectedAddress = address;

    const ctrl = this.registerForm.get('indirizzo_studio');
    ctrl?.setValue(address);
    //attivo interazioni utente, rimuovo errori precedenti e rivalido il campo
    ctrl?.markAsDirty();
    ctrl?.markAsTouched();
    ctrl?.setErrors(null);
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
      indirizzoStudioControl?.setErrors(null);
    }

    specializzazioneControl?.updateValueAndValidity();
    numeroAlboControl?.updateValueAndValidity();
    indirizzoStudioControl?.updateValueAndValidity();
  }

  private ageValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    if (isNaN(birthDate.getTime())) return { invalidDate: true };

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { minAge: true };
  };

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    const addrCtrl = this.registerForm.get('indirizzo_studio');
    if (this.isMedico) {
      const addrVal = (addrCtrl?.value ?? '').toString().trim();
      if (addrVal && !this.addressSelectedFromList) {
        addrCtrl?.setErrors({ ...(addrCtrl.errors ?? {}), notSelected: true });
      }
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = { ...this.registerForm.value };

    this.authService
      .register(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message ??
            (typeof error?.error === 'string' ? error.error : null) ??
            'Errore durante la registrazione';
          this.cd.detectChanges();
        }
      });
  }
}
