import {VisitaDTO} from './visitaDTO';

export interface prescrizioneDTO{
  id: number;
  visita: VisitaDTO;
  nome_farmaco: string;
  dosaggio: string;
  dataEmissione: string;
  dataFine: string;
}
