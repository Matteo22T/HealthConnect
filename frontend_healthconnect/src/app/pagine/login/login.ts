import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../service/auth-service';
import {utenteDTO} from '../../model/utenteDTO';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private auth: AuthService, private router: Router) {
  }

  email=""
  password=""

  login(){
    this.auth.login(this.email, this.password).subscribe({
      next:(utenteTrovato: utenteDTO) => {
        if (utenteTrovato){
          localStorage.setItem('userId', utenteTrovato.id.toString())
          this.router.navigate(['/home'])
        }
        else{
          this.password=""
        }
      }
    })
  }

}
