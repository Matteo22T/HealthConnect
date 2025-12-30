import { utenteDTO } from './utenteDTO';

export interface MetricheSaluteDTO {
  id: number;
  paziente: utenteDTO;
  medico: utenteDTO;
  tipoMetrica: TipoMetrica;
  valore: number;
  unità_misura: string;
  data: string;
}

export enum TipoMetrica {
  PESO = 'PESO',
  PRESSIONE_MAX = 'PRESSIONE_MAX',
  PRESSIONE_MIN = 'PRESSIONE_MIN',
  GLICEMIA = 'GLICEMIA'
}

