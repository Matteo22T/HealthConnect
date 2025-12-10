import {prenotazioneDTO} from './prenotazioneDTO';
import {utenteDTO} from './utenteDTO';

export interface VisitaDTO {
  id: number;
  prenotazione: prenotazioneDTO;
  paziente: utenteDTO;
  medico: utenteDTO;
  diagnosi: string;
  noteMedico: string;
  dataVisita: string;
}
