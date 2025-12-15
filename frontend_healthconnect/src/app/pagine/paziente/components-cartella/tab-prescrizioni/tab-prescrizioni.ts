import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../../service/auth-service';
import { PrescrizioniService } from '../../../../service/prescrizioni-service';
import { prescrizioneDTO } from '../../../../model/prescrizioneDTO';

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

  private dividiPrescrizioni(tutte: prescrizioneDTO[]) {
    const oggi = new Date();
    // Resetta l'orario per confrontare solo le date
    oggi.setHours(0, 0, 0, 0);

    tutte.forEach(p => {
      // Se dataFine è null, assumiamo sia una terapia cronica (quindi attiva)
      // Altrimenti controlliamo se la data di fine è nel futuro o oggi
      if (!p.dataFine || new Date(p.dataFine) >= oggi) {
        this.prescrizioniAttive.push(p);
      } else {
        this.prescrizioniScadute.push(p);
      }
    });

    // Ordiniamo: le attive per data emissione decrescente (più recenti in alto)
    this.prescrizioniAttive.sort((a, b) => new Date(b.dataEmissione!).getTime() - new Date(a.dataEmissione!).getTime());
    // Le scadute idem
    this.prescrizioniScadute.sort((a, b) => new Date(b.dataEmissione!).getTime() - new Date(a.dataEmissione!).getTime());
  }
}
