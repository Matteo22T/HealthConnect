import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Aggiungi DatePipe
import { AndamentoMetricheVitali } from '../../components/andamento-metriche-vitali/andamento-metriche-vitali';
import { AuthService } from '../../../../service/auth-service';
import { MetricheService } from '../../../../service/metriche-service';
import { MetricheSaluteDTO } from '../../../../model/metricheSaluteDTO';

@Component({
  selector: 'app-tab-metriche',
  standalone: true,
  imports: [CommonModule, AndamentoMetricheVitali, DatePipe], // Aggiungi DatePipe
  templateUrl: './tab-metriche.html',
  styleUrl: './tab-metriche.css'
})
export class TabMetriche implements OnInit {

  // Variabile per la tabella
  elencoMetriche: MetricheSaluteDTO[] = [];
  loading: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    private auth: AuthService,
    private metricheService: MetricheService
  ) {}

  ngOnInit() {
    const user = this.auth.currentUserValue;
    if (user) {
      this.metricheService.getMetricheUltimi6Mesi(user.id).subscribe({
        next: (data) => {
          // Ordina per data decrescente (dal più recente)
          this.elencoMetriche = data.sort((a, b) =>
            new Date(b.data).getTime() - new Date(a.data).getTime()
          );
          this.loading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  // Helper per rendere belli i nomi (es. PRESSIONE_MAX -> Pressione Max)
  formattaLabel(tipo: string): string {
    return tipo.replace(/_/g, ' ').toLowerCase();
  }
}
