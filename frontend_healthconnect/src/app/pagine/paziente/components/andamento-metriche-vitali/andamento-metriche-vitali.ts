import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AuthService } from '../../../../service/auth-service';
import { MetricheService } from '../../../../service/metriche-service';
import { MetricheSaluteDTO, TipoMetrica } from '../../../../model/metricheSaluteDTO';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-andamento-metriche-vitali',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [DatePipe],
  templateUrl: './andamento-metriche-vitali.html',
  styleUrl: './andamento-metriche-vitali.css'
})
export class AndamentoMetricheVitali implements OnInit {

  constructor(
    private metricheService: MetricheService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef
  ) {}

  // --- DATI PER I 3 GRAFICI ---
  public pesoData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public pressioneData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public glicemiaData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  // --- OPZIONI CONDIVISE ---
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    },
    scales: {
      y: { beginAtZero: false } // Non partire da 0 per vedere meglio le variazioni
    }
  };

  ngOnInit(): void {
    const user = this.auth.currentUserValue;
    if (user) {
      this.caricaDati(user.id);
    }
  }

  caricaDati(id: number) {
    this.metricheService.getMetricheUltimi6Mesi(id).subscribe({
      next: (dati) => this.processaDati(dati),
      error: (err) => console.error("Errore metriche:", err)
    });
  }

  processaDati(dati: MetricheSaluteDTO[]) {
    // 1. GRAFICO PESO
    this.pesoData = this.creaConfigurazioneGrafico(dati, [TipoMetrica.PESO], ['#10b981'], ['Peso (kg)']);

    // 2. GRAFICO PRESSIONE (Max e Min insieme)
    this.pressioneData = this.creaConfigurazioneGrafico(
      dati,
      [TipoMetrica.PRESSIONE_MAX, TipoMetrica.PRESSIONE_MIN],
      ['#ef4444', '#f59e0b'],
      ['Pressione Max', 'Pressione Min']
    );

    // 3. GRAFICO GLICEMIA
    this.glicemiaData = this.creaConfigurazioneGrafico(dati, [TipoMetrica.GLICEMIA], ['#3b82f6'], ['Glicemia']);

    this.cd.detectChanges();
  }

  // Metodo generico per creare la configurazione di un singolo grafico
  creaConfigurazioneGrafico(
    allData: MetricheSaluteDTO[],
    tipi: TipoMetrica[],
    colori: string[],
    labels: string[]
  ): ChartConfiguration<'line'>['data'] {

    // Filtra solo i dati pertinenti per questo grafico
    const datiPertinenti = allData.filter(d => tipi.includes(d.tipoMetrica));

    if (datiPertinenti.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Crea etichette date uniche SOLO per questi dati
    const dateLabels = [...new Set(datiPertinenti.map(d =>
      this.datePipe.transform(d.data, 'dd/MM') || ''
    ))].sort(); // Ordina le date se necessario, ma di solito arrivano già ordinate dal DB

    // Crea i dataset
    const datasets = tipi.map((tipo, index) => {
      return this.creaDataset(datiPertinenti, tipo, labels[index], colori[index], dateLabels);
    });

    return {
      labels: dateLabels,
      datasets: datasets
    };
  }

  creaDataset(datiFiltrati: MetricheSaluteDTO[], tipo: TipoMetrica, label: string, color: string, labelsX: string[]) {
    const metricheTipo = datiFiltrati.filter(d => d.tipoMetrica === tipo);

    const dataPoints = labelsX.map(lbl => {
      const point = metricheTipo.find(d => (this.datePipe.transform(d.data, 'dd/MM') || '') === lbl);
      return point ? point.valore : null;
    });

    return {
      data: dataPoints,
      label: label,
      borderColor: color,
      backgroundColor: color,
      pointBackgroundColor: '#fff',
      pointBorderColor: color,
      tension: 0.3,
      spanGaps: true
    };
  }
}
