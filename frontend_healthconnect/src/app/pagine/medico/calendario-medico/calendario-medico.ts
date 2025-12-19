import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Aggiunto DatePipe
import {
  CalendarEvent,
  CalendarView,
  CalendarNextViewDirective,
  CalendarPreviousViewDirective,
  CalendarTodayDirective,
  CalendarWeekViewComponent
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { AuthService } from '../../../service/auth-service';
import { VisitaService } from '../../../service/visita-service';
import { VisitaDTO } from '../../../model/visitaDTO';

@Component({
  selector: 'app-calendario-medico',
  standalone: true,
  imports: [
    CommonModule,
    CalendarNextViewDirective,
    CalendarPreviousViewDirective,
    CalendarTodayDirective,
    CalendarWeekViewComponent,
    DatePipe
  ],
  templateUrl: './calendario-medico.html',
  styleUrl: './calendario-medico.css'
})
export class CalendarioMedico implements OnInit {

  // Vista settimanale di default
  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();

  // Lista eventi
  events: CalendarEvent[] = [];

  // Trigger refresh grafico
  refresh = new Subject<void>();

  // Evento selezionato per il popup
  selectedEvent: CalendarEvent | null = null;

  constructor(
    private visService: VisitaService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const medicoId = this.auth.currentUserValue?.id;
    if (medicoId) {
      this.visService.getVisiteByMedico(medicoId).subscribe({
        next: (visite) => {
          this.events = this.mappaEventi(visite);
          this.refresh.next(); // aggiornamento grafico forzato
        },
        error: (err) => console.error(err)
      });
    }
  }

  mappaEventi(visite: VisitaDTO[]): CalendarEvent[] {
    return visite.map(v => {
      // Sicurezza per evitare errori di calcolo della data
      if (!v.dataVisita) return null;

      const start = new Date(v.dataVisita);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // Durata 1 ora di base

      const orarioInizio = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const orarioFine = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return {
        start: start,
        end: end,
        // Titolo visualizzato nella card del calendario
        title: `${orarioInizio} - ${orarioFine}\n Paziente: ${v.paziente?.nome} ${v.paziente?.cognome}\n Motivo: ${v.prenotazione?.motivo}`,
        color: { primary: '#0066cc', secondary: '#D1E8FF' }, // Colori blu medico
        meta: {
          visitaId: v.id,
          paziente: v.paziente, // Salviamo i dati per il popup
          motivo: v.prenotazione?.motivo
        }
      };
    }).filter(e => e !== null) as CalendarEvent[];
  }

  // Gestione Popup
  openEventPopup(event: CalendarEvent) {
    this.selectedEvent = event;
  }

  closePopup() {
    this.selectedEvent = null;
  }
}
