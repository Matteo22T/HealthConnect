import {Component, Input, OnInit} from '@angular/core';
import {
  CalendarEvent,
  CalendarNextViewDirective,
  CalendarPreviousViewDirective,
  CalendarTodayDirective, CalendarView,
  CalendarWeekViewComponent
} from 'angular-calendar';
import {DatePipe} from '@angular/common';
import {forkJoin, Subject} from 'rxjs';
import {VisitaService} from '../../../../../service/visita-service';
import {AuthService} from '../../../../../service/auth-service';
import {VisitaDTO} from '../../../../../model/visitaDTO';
import {PrenotazioneService} from '../../../../../service/prenotazione-service';
import {prenotazioneDTO} from '../../../../../model/prenotazioneDTO';

@Component({
  selector: 'app-calendario-paziente',
  imports: [
    CalendarNextViewDirective,
    CalendarPreviousViewDirective,
    CalendarTodayDirective,
    CalendarWeekViewComponent,
    DatePipe
  ],
  templateUrl: './calendario-paziente.html',
  styleUrl: './calendario-paziente.css',
})
export class CalendarioPaziente implements OnInit{

  @Input() listaVisite: VisitaDTO[] = [];
  @Input() listaPending: prenotazioneDTO[] = [];
  @Input() listaRifiutate: prenotazioneDTO[] = [];

  //vista settimanale di default
  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();

  //lista eventi
  events: CalendarEvent[] = [];

  //trigger refresh grafico
  refresh = new Subject<void>();

  selectedEvent: CalendarEvent | null = null;

  openEventPopup(event: CalendarEvent) {
    this.selectedEvent = event;
  }

  closePopup() {
    this.selectedEvent = null;
  }

  constructor(
    private visService: VisitaService,
    private auth: AuthService,
    private prenService: PrenotazioneService
  ) {}


  ngOnInit() {
    const pazienteId = this.auth.currentUserValue?.id;
    if (pazienteId) {
      forkJoin({
        visite: this.visService.getVisiteFuturePaziente(pazienteId),
        prenotazioni: this.prenService.getPrenotazioniInAttesaPaziente(pazienteId),
        prenRifiutate: this.prenService.getPrenotazioniRifiutatePaziente(pazienteId)
      }).subscribe({
        next: (res) => {
          const eventiVisite = this.mappaEventi(res.visite);
          const eventiPending = this.mappaPrenotazioniPending(res.prenotazioni);
          const eventiRifiutate = this.mappaPrenotazioniRifiutate(res.prenRifiutate);

          this.events = [...eventiVisite, ...eventiPending, ...eventiRifiutate];
          this.refresh.next();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  mappaEventi(visite: VisitaDTO[]): CalendarEvent[] {
    return visite.map(v => {
      if (!v.dataVisita) return null;

      const start = new Date(v.dataVisita);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const orarioInizio = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const orarioFine = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return {
        start: start,
        end: end,
        title: `${orarioInizio} - ${orarioFine}\n -${v.prenotazione?.motivo}\n Dr. ${v.medico?.nome} ${v.medico?.cognome} `,
        color: { primary: '#0066cc', secondary: '#D1E8FF' },
        meta: {
          visitaId: v.id,
          type: 'CONFIRMED',
          medico: v.medico,
          motivo: v.prenotazione?.motivo
        }
        };
    }).filter(e => e !== null) as CalendarEvent[];
  }

  mappaPrenotazioniPending(prenotazioni: prenotazioneDTO[]): CalendarEvent[] {
    return prenotazioni.map(p => {
      const start = new Date(p.dataVisita);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const orarioInizio = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const orarioFine = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


      return {
        start: start,
        end: end,
        title: `[IN ATTESA] - ${orarioInizio} - ${orarioFine}\n Dr. ${p.medico.nome} ${p.medico.cognome} \n ${p.motivo}`,
        color: { primary: '#e67e22', secondary: '#fbeee6' },
        meta: {
          type: 'PENDING',
          id: p.id,
          medico: p.medico,
          motivo: p.motivo
        },
        cssClass: 'event-pending'
      };
    });
  }

  mappaPrenotazioniRifiutate(prenotazioni: prenotazioneDTO[]): CalendarEvent[] {
    return prenotazioni.map(p => {
      const start = new Date(p.dataVisita);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const orarioInizio = start.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
      const orarioFine = end.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

      return {
        start: start,
        end: end,
        title: `[RIFIUTATO] - ${orarioInizio} - ${orarioFine}\n Dr. ${p.medico.nome} ${p.medico.cognome} \n ${p.motivo}`,
        color: {primary: '#ff0043', secondary: '#fbeee6'},
        meta: {
          type: 'RIFIUTATO',
          id: p.id,
          medico: p.medico,
          motivo: p.motivo
        },
        cssClass: 'event-rifiutate'
      };
    });
  }

    protected readonly alert = alert;

}
