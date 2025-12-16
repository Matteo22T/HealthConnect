import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MetricheSaluteDTO, TipoMetrica} from '../../../model/metricheSaluteDTO';
import {utenteDTO} from '../../../model/utenteDTO';
import {NgForOf} from '@angular/common';

export interface NuovaMetrica {
  tipo: TipoMetrica | null;
  valore: number | null;
  data: string;
  unitaDiMisura: string | null;
}

@Component({
  selector: 'app-aggiungi-metrica-form',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './aggiungi-metrica-form.html',
  styleUrl: './aggiungi-metrica-form.css',
})
export class AggiungiMetricaForm {
    @Input({required:true}) paziente: utenteDTO | null = null;
    @Input({required:true}) medico: utenteDTO | null = null;
    @Output() metricaAggiunta = new EventEmitter<MetricheSaluteDTO>();

    tipoMetrica = TipoMetrica;
    tipiMetrica = Object.values(TipoMetrica);

    nuovaMetrica: NuovaMetrica = {
      tipo : null,
      valore : null,
      data : '',
      unitaDiMisura: null
    }

    oggi: string = new Date().toISOString().split('T')[0];

  aggiungiMetrica() {
    if (this.formValido() && this.paziente && this.medico) {
      const metricaCompleta: MetricheSaluteDTO = {
        id: -1,
        tipoMetrica: this.nuovaMetrica.tipo!,
        valore: this.nuovaMetrica.valore!,
        data: this.nuovaMetrica.data,
        unità_misura: this.nuovaMetrica.unitaDiMisura!,
        paziente: this.paziente,
        medico: this.medico,
      };

      this.metricaAggiunta.emit(metricaCompleta);

      this.resetForm();
    }
  }


  formValido() {
    return !!(
      this.nuovaMetrica.tipo &&
      this.nuovaMetrica.valore !== null &&
      this.nuovaMetrica.valore > 0 &&
      this.nuovaMetrica.unitaDiMisura &&
      this.nuovaMetrica.unitaDiMisura.trim() !== '' &&
      this.nuovaMetrica.data &&
      this.paziente &&
      this.medico
    );
  }

  resetForm(): void {
    this.nuovaMetrica = {
      tipo: null,
      valore: null,
      data: '',
      unitaDiMisura: null
    };
  }
}
