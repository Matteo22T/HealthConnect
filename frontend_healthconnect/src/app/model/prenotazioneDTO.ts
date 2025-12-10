import {utenteDTO} from './utenteDTO';

export interface prenotazioneDTO {
  id: number;
  paziente: utenteDTO;
  idMedico: number;
  data: string;
  stato: string;
  motivo: string;
}
