import {VisitaDTO} from './visitaDTO';

export interface prescrizioneDTO{
  id: number;
  visita: VisitaDTO;
  nome_farmaco: string;
  dosaggio: string;
  data_emissione: string;
  data_fine: string;
}
