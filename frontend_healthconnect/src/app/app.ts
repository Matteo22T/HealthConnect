import {Component, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GoogleMapsLoaderService} from './service/google-maps-loader-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.html',
  styleUrl: './app.css'

})
export class App implements OnInit{
  protected readonly title = signal('frontend_healthconnect');
  constructor(private mapsLoader: GoogleMapsLoaderService) {}

  ngOnInit() {

    this.mapsLoader.load().then(() => {
      console.log('maps funziona godo');
    });
  }
}
