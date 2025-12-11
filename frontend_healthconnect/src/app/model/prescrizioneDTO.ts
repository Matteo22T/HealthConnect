import {VisitaDTO} from './visitaDTO';

export interface prescrizioneDTO{
  id: number;
  id_visita: number;
  nome_farmaco: string;
  dosaggio: string;
  dataEmissione: string;
  dataFine: string;
}
