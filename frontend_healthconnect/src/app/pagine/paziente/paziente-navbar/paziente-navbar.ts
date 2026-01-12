import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf} from '@angular/common';
import {AuthService} from '../../../service/auth-service';
import {MessaggioDTO} from '../../../model/messaggioDTO';
import {MessaggioService} from '../../../service/messaggio-service';

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
  isProfileMenuOpen = false;
  isMobileMenuOpen = false;
  nomePaziente: string = "";
  cognomePaziente: string = "";
  messaggi: MessaggioDTO[] = [];


  constructor(
    private auth: AuthService,
    private router: Router,
    private messService: MessaggioService,
    private changeDet: ChangeDetectorRef
  ) {}

  ngOnInit(){
    const currentUser = this.auth.currentUserValue;

    if (currentUser) {
      this.nomePaziente = currentUser.nome;
      this.cognomePaziente = currentUser.cognome;
      this.messService.getMessaggiNonLetti(currentUser.id).subscribe({
        next: mess => {
          this.messaggi = mess;
          this.changeDet.detectChanges();
        },
        error: (err) => {
          console.error('Errore server', err);
        }
      });
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) {
      this.isMobileMenuOpen = false; // Chiudi mobile menu se aperto
    }
  }

  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isProfileMenuOpen = false; // Chiudi profile menu se aperto
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  closeAllMenus() {
    this.isMobileMenuOpen = false;
    this.isProfileMenuOpen = false;
  }

  logout() {
    this.closeAllMenus(); // Chiudi i menu prima del logout
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
