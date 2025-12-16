import {ChangeDetectorRef, Component} from '@angular/core';
import {Condition, DiagnosisResponse, Evidence, Question} from '../../../../model/tipi-sintomiDTO';
import {AiService} from '../../../../service/ai-service';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat-sintomi',
  imports: [
    DecimalPipe,
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './chat-sintomi.html',
  styleUrl: './chat-sintomi.css',
})
export class ChatSintomi {
  userInput: string = '';
  age: number = 30;
  sex: string = 'male';

  step: 'start' | 'question' | 'result' = 'start';
  isLoading: boolean = false;

  evidence: Evidence[] = [];
  currentQuestion: Question | null = null;
  conditions: Condition[] = [];

  //Set per tenere traccia delle checkbox selezionate
  selectedSymptomIds: Set<string> = new Set();

  constructor(private symptomService: AiService, private cd: ChangeDetectorRef) {}

  startDiagnosis() {
    if (!this.userInput.trim()) return;

    this.isLoading = true;
    this.symptomService.initDiagnosis(this.userInput, this.age, this.sex)
      .subscribe({
        next: (response) => this.handleResponse(response),
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          alert('Errore durante l\'analisi. Controlla la console.');
        }
      });
  }

  handleResponse(response: DiagnosisResponse) {
    this.isLoading = false;
    this.conditions = response.conditions;

    if (response.should_stop || !response.question) {
      this.step = 'result';
      this.cd.detectChanges()
      this.currentQuestion = null;
    } else {
      this.step = 'question';
      this.currentQuestion = response.question;
      this.selectedSymptomIds.clear();
      this.cd.detectChanges();
    }
  }

  //Gestisce solo l'aggiunta della prova singola
  submitAnswer(itemId: string, choiceId: string) {
    this.addEvidence(itemId, choiceId);
    this.callDiagnosisBackend();
  }

  //Gestisce il click sulle checkbox (aggiunge/rimuove dal Set)
  toggleSelection(itemId: string) {
    if (this.selectedSymptomIds.has(itemId)) {
      this.selectedSymptomIds.delete(itemId);
    } else {
      this.selectedSymptomIds.add(itemId);
    }
  }

  //Invia le risposte multiple (Group Multiple)
  submitGroupMultiple() {
    if (!this.currentQuestion) return;

    //Per ogni item della domanda, controlliamo se è stato selezionato
    this.currentQuestion.items.forEach((item: any) => {
      const choiceId = this.selectedSymptomIds.has(item.id) ? 'present' : 'absent';
      this.addEvidence(item.id, choiceId);
    });

    this.callDiagnosisBackend();
  }

  //Metodo helper per aggiungere evidence evitando duplicati
  private addEvidence(itemId: string, choiceId: string) {
    const newEvidence: Evidence = {
      id: itemId,
      choice_id: choiceId,
      source: 'initial'
    };
    // Rimuovo se esiste già per evitare duplicati
    this.evidence = this.evidence.filter(e => e.id !== itemId);
    this.evidence.push(newEvidence);
  }

  private callDiagnosisBackend() {
    const request = {
      sex: this.sex,
      age: { value: this.age, unit: 'year' },
      evidence: this.evidence
    };

    this.isLoading = true;

    this.symptomService.updateDiagnosis(request)
      .subscribe({
        next: (res) => {
          this.handleResponse(res);
          this.cd.detectChanges();

        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  reset() {
    this.step = 'start';
    this.userInput = '';
    this.evidence = [];
    this.conditions = [];
    this.selectedSymptomIds.clear(); // Pulisci anche il set
  }
}
