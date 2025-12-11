
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MetricheService } from '../../../../service/metriche-service';
import { AuthService } from '../../../../service/auth-service';
import { MetricheSaluteDTO, TipoMetrica } from '../../../../model/metricheSaluteDTO';
import { CommonModule } from '@angular/common';

// Registra i componenti necessari di Chart.js
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-andamento-metriche-vitali',
  imports: [
    BaseChartDirective,
    CommonModule
  ],
  templateUrl: './andamento-metriche-vitali.html',
  styleUrl: './andamento-metriche-vitali.css'
})
export class AndamentoMetricheVitali implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Configurazione grafici
  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Data'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Valore'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  // Dati grafici
  public pesoChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  public pressioneChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  public glicemiaChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  constructor(
    private metricheService: MetricheService,
    private authService: AuthService
  ) {
    console.log('🏗️ AndamentoMetricheVitali - Costruttore chiamato');
  }

  ngOnInit() {
    console.log('🚀 AndamentoMetricheVitali - ngOnInit chiamato');
    this.caricaMetriche();
  }

  private caricaMetriche() {
    console.log('📊 Inizio caricamento metriche...');

    const currentUser = this.authService.currentUserValue;
    console.log('👤 Current user:', currentUser);

    if (!currentUser) {
      console.error('❌ Nessun utente autenticato trovato');
      return;
    }

    if (!currentUser.id) {
      console.error('❌ ID utente non trovato:', currentUser);
      return;
    }

    console.log('🔄 Chiamata API per utente ID:', currentUser.id);

    this.metricheService.getMetricheUltimi6Mesi(currentUser.id).subscribe({
      next: (metriche) => {
        console.log('✅ Metriche ricevute dal server:', metriche);
        console.log('📈 Numero totale metriche:', metriche?.length || 0);

        if (!metriche || metriche.length === 0) {
          console.log('⚠️ Nessuna metrica trovata');
          return;
        }

        // Log dettagliato di ogni metrica
        metriche.forEach((metrica, index) => {
          console.log(`📊 Metrica ${index + 1}:`, {
            id: metrica.id,
            tipo: metrica.tipoMetrica,
            valore: metrica.valore,
            unita: metrica.unità_misura,
            data: metrica.data,
            paziente: metrica.paziente?.nome,
            medico: metrica.medico?.nome
          });
        });

        const metricheRaggruppate = this.metricheService.raggruppaMetrichePerTipo(metriche);
        console.log('🗂️ Metriche raggruppate:', metricheRaggruppate);

        // Log per ogni tipo di metrica
        console.log('⚖️ Peso - count:', metricheRaggruppate[TipoMetrica.PESO]?.length || 0);
        console.log('🩸 Pressione MAX - count:', metricheRaggruppate[TipoMetrica.PRESSIONE_MAX]?.length || 0);
        console.log('🩸 Pressione MIN - count:', metricheRaggruppate[TipoMetrica.PRESSIONE_MIN]?.length || 0);
        console.log('🩺 Glicemia - count:', metricheRaggruppate[TipoMetrica.GLICEMIA]?.length || 0);

        this.preparaDatiPeso(metricheRaggruppate[TipoMetrica.PESO]);
        this.preparaDatiPressione(
          metricheRaggruppate[TipoMetrica.PRESSIONE_MAX],
          metricheRaggruppate[TipoMetrica.PRESSIONE_MIN]
        );
        this.preparaDatiGlicemia(metricheRaggruppate[TipoMetrica.GLICEMIA]);

        // Log stato finale dei grafici
        console.log('📊 Stato finale grafici:');
        console.log('⚖️ Peso datasets:', this.pesoChartData.datasets.length);
        console.log('🩸 Pressione datasets:', this.pressioneChartData.datasets.length);
        console.log('🩺 Glicemia datasets:', this.glicemiaChartData.datasets.length);
      },
      error: (err) => {
        console.error('❌ Errore nel caricamento delle metriche:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Message:', err.message);
        console.error('❌ URL:', err.url);
      }
    });
  }

  private preparaDatiPeso(peso: MetricheSaluteDTO[]) {
    console.log('⚖️ Preparazione dati PESO:', peso);

    if (!peso || peso.length === 0) {
      console.log('⚠️ Nessun dato peso trovato');
      return;
    }

    const labels = peso.map(m => this.formatDate(m.data));
    const data = peso.map(m => m.valore);

    console.log('⚖️ Labels peso:', labels);
    console.log('⚖️ Data peso:', data);

    this.pesoChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          label: `Peso (${peso[0]?.unità_misura || 'kg'})`,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };

    console.log('✅ Grafico peso configurato:', this.pesoChartData);
  }

  private preparaDatiPressione(pressioneMax: MetricheSaluteDTO[], pressioneMin: MetricheSaluteDTO[]) {
    console.log('🩸 Preparazione dati PRESSIONE:');
    console.log('🩸 Pressione MAX:', pressioneMax);
    console.log('🩸 Pressione MIN:', pressioneMin);

    if ((!pressioneMax || pressioneMax.length === 0) && (!pressioneMin || pressioneMin.length === 0)) {
      console.log('⚠️ Nessun dato pressione trovato');
      return;
    }

    // Unisci le date di entrambe le metriche
    const tutteDate = [...(pressioneMax || []), ...(pressioneMin || [])]
      .map(m => m.data)
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort();

    console.log('🩸 Date unificate pressione:', tutteDate);

    const labels = tutteDate.map(date => this.formatDate(date));
    const datasets = [];

    if (pressioneMax && pressioneMax.length > 0) {
      const dataMax = tutteDate.map(date => {
        const metrica = pressioneMax.find(p => p.data === date);
        return metrica ? metrica.valore : null;
      });

      console.log('🩸 Data MAX:', dataMax);

      datasets.push({
        data: dataMax,
        label: `Pressione Massima (${pressioneMax[0]?.unità_misura || 'mmHg'})`,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        tension: 0.4,
        spanGaps: true
      });
    }

    if (pressioneMin && pressioneMin.length > 0) {
      const dataMin = tutteDate.map(date => {
        const metrica = pressioneMin.find(p => p.data === date);
        return metrica ? metrica.valore : null;
      });

      console.log('🩸 Data MIN:', dataMin);

      datasets.push({
        data: dataMin,
        label: `Pressione Minima (${pressioneMin[0]?.unità_misura || 'mmHg'})`,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: false,
        tension: 0.4,
        spanGaps: true
      });
    }

    this.pressioneChartData = {
      labels: labels,
      datasets: datasets
    };

    console.log('✅ Grafico pressione configurato:', this.pressioneChartData);
  }

  private preparaDatiGlicemia(glicemia: MetricheSaluteDTO[]) {
    console.log('🩺 Preparazione dati GLICEMIA:', glicemia);

    if (!glicemia || glicemia.length === 0) {
      console.log('⚠️ Nessun dato glicemia trovato');
      return;
    }

    const labels = glicemia.map(m => this.formatDate(m.data));
    const data = glicemia.map(m => m.valore);

    console.log('🩺 Labels glicemia:', labels);
    console.log('🩺 Data glicemia:', data);

    this.glicemiaChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          label: `Glicemia (${glicemia[0]?.unità_misura || 'mg/dL'})`,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };

    console.log('✅ Grafico glicemia configurato:', this.glicemiaChartData);
  }

  private formatDate(dateString: string): string {
    if (!dateString) {
      console.warn('⚠️ Data string vuota o null:', dateString);
      return 'Data non valida';
    }

    try {
      const formatted = new Date(dateString).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'short'
      });
      console.log('📅 Data formattata:', dateString, '->', formatted);
      return formatted;
    } catch (error) {
      console.error('❌ Errore nella formattazione della data:', dateString, error);
      return 'Data non valida';
    }
  }
}
