import { Component } from '@angular/core';
import {
  CalendarEvent,
  CalendarNextViewDirective,
  CalendarPreviousViewDirective,
  CalendarTodayDirective, CalendarView,
  CalendarWeekViewComponent
} from 'angular-calendar';
import {DatePipe} from '@angular/common';
import {Subject} from 'rxjs';
import {VisitaService} from '../../../service/visita-service';
import {AuthService} from '../../../service/auth-service';
import {VisitaDTO} from '../../../model/visitaDTO';

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
export class CalendarioPaziente {

  //vista settimanale di default
  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();

  //lista eventi
  events: CalendarEvent[] = [];

  //trigger refresh grafico
  refresh = new Subject<void>();

  constructor(
    private visService: VisitaService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const pazienteId = this.auth.currentUserValue?.id;
    if (pazienteId) {
      this.visService.getVisiteFuturePaziente(pazienteId).subscribe({
        next: (visite) => {
          this.events = this.mappaEventi(visite);
          this.refresh.next();
        },
        error: (err) => console.error(err)
      });
    }
  }

  mappaEventi(visite: VisitaDTO[]): CalendarEvent[] {
    return visite.map(v => {
      if (!v.dataVisita) return null;

      const start = new Date(v.dataVisita);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      return {
        start: start,
        end: end,
        title: `Dr. ${v.medico?.nome} ${v.medico?.cognome} - ${v.prenotazione?.motivo}`,
        color: { primary: '#0066cc', secondary: '#D1E8FF' },
        meta: { visitaId: v.id }
      };
    }).filter(e => e !== null) as CalendarEvent[];
  }

  protected readonly alert = alert;

}
