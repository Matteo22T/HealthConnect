import {utenteDTO} from './utenteDTO';

export interface prenotazioneDTO {
  id: number;
  paziente: utenteDTO;
  idMedico: number;
  dataVisita: string;
  stato: string;
  motivo: string;
}
