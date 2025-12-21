import {utenteDTO} from './utenteDTO';

export interface prenotazioneDTO {
  id: number;
  paziente: utenteDTO;
  medico: utenteDTO;
  dataVisita: string;
  stato: string;
  motivo: string;
}
