import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../../../service/auth-service';
import { PrescrizioniService } from '../../../../../service/prescrizioni-service';
import { prescrizioneDTO } from '../../../../../model/prescrizioneDTO';

@Component({
  selector: 'app-tab-prescrizioni',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './tab-prescrizioni.html',
  styleUrl: './tab-prescrizioni.css'
})
export class TabPrescrizioni implements OnInit {
  prescrizioniAttive: prescrizioneDTO[] = [];
  prescrizioniScadute: prescrizioneDTO[] = [];
  loading = true;

  constructor(private auth: AuthService, private prescService: PrescrizioniService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    const user = this.auth.currentUserValue;
    if (user) {
      this.prescService.getStoricoPrescrizioni(user.id).subscribe({
        next: (dati) => {
          this.dividiPrescrizioni(dati);
          this.loading = false;
          this.cd.detectChanges();
        },
        error: () => this.loading = false
      });
    }
  }

  // Divide le prescrizioni in attive e scadute
  private dividiPrescrizioni(tutte: prescrizioneDTO[]) {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    tutte.forEach(p => {
      if (!p.dataFine || new Date(p.dataFine) >= oggi) {
        this.prescrizioniAttive.push(p);
      } else {
        this.prescrizioniScadute.push(p);
      }
    });

    this.prescrizioniAttive.sort((a, b) => new Date(b.dataEmissione!).getTime() - new Date(a.dataEmissione!).getTime());
    this.prescrizioniScadute.sort((a, b) => new Date(b.dataEmissione!).getTime() - new Date(a.dataEmissione!).getTime());
  }
}
