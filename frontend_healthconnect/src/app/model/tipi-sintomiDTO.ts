
export interface Choice {
  id: string;      // "present", "absent", "unknown"
  label: string;   // "Yes", "No", "Don't know"
}

export interface Item {
  id: string;
  name: string;
  choices: Choice[];
}

export interface Question {
  type: string;    // "group_multiple", "single", "group_single"
  text: string;
  items: Item[];
  extras?: any;
}

export interface Condition {
  id: string;
  name: string;
  common_name: string;
  probability: number;
}

export interface DiagnosisResponse {
  question: Question;
  conditions: Condition[];
  should_stop: boolean;
  has_emergency_evidence: boolean;
}

// Questo è l'oggetto che inviamo al backend per l'aggiornamento
export interface Evidence {
  id: string;
  choice_id: string;
  source?: string;
}

export interface DiagnosisRequest {
  sex: string;
  age: { value: number; unit: string };
  evidence: Evidence[];
  text?: string; // Opzionale, serve solo per la prima chiamata
}
