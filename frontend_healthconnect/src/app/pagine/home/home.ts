import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FooterComponent} from '../footer/footer';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    FooterComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
