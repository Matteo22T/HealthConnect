
export interface utenteDTO{
  id:number
  email: string
  nome: string
  cognome: string
  telefono: number
  dataNascita: string
  ruolo: string
  dataCreazione: string
  sesso: string

  specializzazione_id?: number;
  numero_albo?: string;
  biografia?: string;
  indirizzo_studio?: string;
  stato_approvazione?: 'PENDING' | 'APPROVATO' | 'RIFIUTATO';
}
