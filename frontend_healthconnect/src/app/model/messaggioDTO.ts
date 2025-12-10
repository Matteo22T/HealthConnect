import {utenteDTO} from './utenteDTO';

export interface MessaggioDTO {
  id: number;
  mittente: utenteDTO;
  destinatario: utenteDTO;
  testo: string;
  letto: boolean;
  data_invio: string;
}
