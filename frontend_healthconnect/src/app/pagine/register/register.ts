import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../service/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  registerForm: FormGroup;
  isMedico: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inizializzazione form base
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      dataNascita: ['', Validators.required],
      ruolo: ['PAZIENTE', Validators.required],
      sesso: ['', Validators.required],

      // Campi Medico (inizialmente disabilitati o non validati)
      specializzazione_id: [''],
      numero_albo: [''],
      biografia: [''],
      indirizzo_studio: ['']
    });
  }

  ngOnInit(): void {
    // Osserva i cambiamenti del ruolo
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
        this.registerForm.get(control)?.setValidators(Validators.required);
        this.registerForm.get(control)?.updateValueAndValidity();
      });
    } else {
      this.isMedico = false;
      // Rimuovi validatori se non è medico
      medicoControls.forEach(control => {
        this.registerForm.get(control)?.clearValidators();
        this.registerForm.get(control)?.updateValueAndValidity();
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const payload = this.registerForm.value;

      // Se è medico, imposta stato default (backend lo aspetta)
      if (this.isMedico) {
        payload.stato_approvazione = 'PENDING';
      }

      this.authService.register(payload).subscribe({
        next: (res) => {
          console.log('Registrazione OK', res);
          this.router.navigate(['/login']); // Reindirizza al login
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Errore durante la registrazione: ' + (err.error || 'Server error');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
