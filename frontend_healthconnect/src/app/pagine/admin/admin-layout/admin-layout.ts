import { Component } from '@angular/core';
import {NavbarAdmin} from '../navbar-admin/navbar-admin';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [
    NavbarAdmin,
    RouterOutlet
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

}
