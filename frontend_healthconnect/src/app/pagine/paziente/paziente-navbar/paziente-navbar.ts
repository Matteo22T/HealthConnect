import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf} from '@angular/common';
import {AuthService} from '../../../service/auth-service';

@Component({
  selector: 'app-paziente-navbar',
  imports: [
    RouterLink,
    NgIf,
    RouterLinkActive
  ],
  templateUrl: './paziente-navbar.html',
  styleUrl: './paziente-navbar.css',
})
export class PazienteNavbar implements OnInit{
  isProfileMenuOpen = false
  nomePaziente: string = ""
  cognomePaziente: string = ""

  constructor(private auth: AuthService, private router: Router, private changeDet: ChangeDetectorRef) {}


  ngOnInit(){
    const currentUser = this.auth.currentUserValue;

    if (currentUser) {
      this.nomePaziente = currentUser.nome;
      this.cognomePaziente = currentUser.cognome;
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
