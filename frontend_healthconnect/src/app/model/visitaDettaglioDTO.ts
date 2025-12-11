import {VisitaDTO} from './visitaDTO';
import {prescrizioneDTO} from './prescrizioneDTO';

export interface VisitaDettaglioDTO extends VisitaDTO{
  prescrizioni: prescrizioneDTO[];
}
