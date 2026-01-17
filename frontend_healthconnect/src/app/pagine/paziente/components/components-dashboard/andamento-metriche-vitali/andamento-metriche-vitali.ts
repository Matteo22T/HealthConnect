import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AuthService } from '../../../../../service/auth-service';
import { MetricheService } from '../../../../../service/metriche-service';
import { MetricheSaluteDTO, TipoMetrica } from '../../../../../model/metricheSaluteDTO';

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
import {utenteDTO} from '../../../../../model/utenteDTO';

//Chart.js è una libreria "tree-shakable". Per evitare di caricare codice inutile
//registro esplicitamente solo i componenti che uso
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

  // Inizializzazione degli oggetti che conterranno i dati
  public pesoData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] }; //labels indica le date, datasets l'insieme delle serie di dati (linee)
  public pressioneData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public glicemiaData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  @Input({required: true}) user: utenteDTO = {} as utenteDTO;

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false, // Permette al grafico di espandersi nel contenitore CSS
    plugins: {
      legend: { display: true, position: 'top' }
    },
    scales: {
      y: { beginAtZero: false } // Non forza lo zero come base
    }
  };

  ngOnInit(): void {
    this.caricaDati(this.user.id);
    // Aggiorna i dati quando viene emesso un evento di refresh (campanello)
    this.metricheService.refreshNeeded$.subscribe(() => this.caricaDati(this.user.id));
  }

  caricaDati(id: number) {
    this.metricheService.getMetricheUltimi6Mesi(id).subscribe({
      next: (dati) => this.processaDati(dati),
      error: (err) => console.error("Errore metriche:", err)
    });
  }

  processaDati(dati: MetricheSaluteDTO[]) {
    this.pesoData = this.creaConfigurazioneGrafico(dati, [TipoMetrica.PESO], ['#10b981'], ['Peso (kg)']);

    this.pressioneData = this.creaConfigurazioneGrafico(
      dati,
      [TipoMetrica.PRESSIONE_MAX, TipoMetrica.PRESSIONE_MIN],
      ['#ef4444', '#f59e0b'],
      ['Pressione Max', 'Pressione Min']
    );

    this.glicemiaData = this.creaConfigurazioneGrafico(dati, [TipoMetrica.GLICEMIA], ['#3b82f6'], ['Glicemia']);

    this.cd.detectChanges();
  }

  creaConfigurazioneGrafico(
    allData: MetricheSaluteDTO[],
    tipi: TipoMetrica[],
    colori: string[],
    labels: string[]
  ): ChartConfiguration<'line'>['data'] {

    const datiPertinenti = allData.filter(d => tipi.includes(d.tipoMetrica));

    if (datiPertinenti.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Crea l'asse X (date) unico: estrae le date, le formatta "gg/mm" e rimuove i duplicati con Set.
    const dateLabels = [...new Set(datiPertinenti.map(d =>
      this.datePipe.transform(d.data, 'dd/MM') || ''
    ))];

    // Per ogni tipo di metrica richiesto, crea un dataset (una linea sul grafico).
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

    // Allineamento dati: per ogni data sull'asse X, cerca se esiste un valore.
    const dataPoints = labelsX.map(lbl => {
      const point = metricheTipo.find(d => (this.datePipe.transform(d.data, 'dd/MM') || '') === lbl);
      return point ? point.valore : null; // Usa null per i punti mancanti
    });

    return {
      data: dataPoints,
      label: label,
      borderColor: color,
      backgroundColor: color,
      pointBackgroundColor: '#fff',
      pointBorderColor: color,
      tension: 0.3, // Rende la linea curva (smooth) invece che a spigoli vivi
      spanGaps: true // Collega i punti anche se ci sono valori nulli
    };
  }
}
