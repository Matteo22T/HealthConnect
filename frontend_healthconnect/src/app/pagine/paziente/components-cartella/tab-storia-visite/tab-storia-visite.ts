import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VisitaService } from '../../../../service/visita-service';
import { AuthService } from '../../../../service/auth-service';
import { VisitaDTO } from '../../../../model/visitaDTO';

@Component({
  selector: 'app-tab-storia-visite',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './tab-storia-visite.html',
  styleUrl: './tab-storia-visite.css'
})
export class TabStoriaVisite implements OnInit {
  storico: VisitaDTO[] = [];

  constructor(private visitaService: VisitaService, private auth: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    const user = this.auth.currentUserValue;
    if (user) {
      this.visitaService.getStoricoVisite(user.id).subscribe(data => {
        this.storico = data;

        this.cd.detectChanges();
      });
    }
  }
}
