import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from '../../../service/auth-service';

@Component({
  selector: 'app-navbar-admin',
    imports: [
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.css',
})
export class NavbarAdmin {

  constructor(private auth: AuthService, private router:Router) {
  }


  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Errore logout", err);
        this.router.navigate(['/login']);
      }
    });
  }

}
