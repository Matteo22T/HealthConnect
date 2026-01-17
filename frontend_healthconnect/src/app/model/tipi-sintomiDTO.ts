// Interfaccia per le scelte possibili in una domanda
export interface Choice {
  id: string;      // "present", "absent", "unknown"
  label: string;   // "Yes", "No", "Don't know"
}

// Singolo item della domanda
export interface Item {
  id: string;
  name: string;
  choices: Choice[];
}

// Domanda posta dalla API
export interface Question {
  type: string;    // "group_multiple", "single", "group_single"
  text: string;
  items: Item[];
  extras?: any;
}


// Condizione medica suggerita
export interface Condition {
  id: string;
  name: string;
  common_name: string;
  probability: number;
}

// Risposta dalla API di diagnosi
export interface DiagnosisResponse {
  question: Question;
  conditions: Condition[];
  should_stop: boolean;
  has_emergency_evidence: boolean;
}

// Evidenza fornita dall'utente
export interface Evidence {
  id: string;
  choice_id: string;
  source?: string;
}

// Richiesta di diagnosi da inviare alla API
export interface DiagnosisRequest {
  sex: string;
  age: { value: number; unit: string };
  evidence: Evidence[];
  text?: string;
}
