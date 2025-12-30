import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chi-siamo',
  imports: [],
  templateUrl: './chi-siamo.html',
  styleUrl: './chi-siamo.css',
})
export class ChiSiamo implements OnInit{
  ngOnInit() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
