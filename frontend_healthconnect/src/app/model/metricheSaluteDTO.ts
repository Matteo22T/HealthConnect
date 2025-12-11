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

// Interface per raggruppare le metriche
export interface MetricheRaggruppate {
  [TipoMetrica.PESO]: MetricheSaluteDTO[];
  [TipoMetrica.PRESSIONE_MAX]: MetricheSaluteDTO[];
  [TipoMetrica.PRESSIONE_MIN]: MetricheSaluteDTO[];
  [TipoMetrica.GLICEMIA]: MetricheSaluteDTO[];
}
