import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { AuthService } from '../../../service/auth-service';
import { VisitaService } from '../../../service/visita-service';
import { VisitaDTO } from '../../../model/visitaDTO';

@Component({
  selector: 'app-calendario-medico',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule
  ],
  templateUrl: './calendario-medico.html',
  styleUrl: './calendario-medico.css'
})
export class CalendarioMedico implements OnInit {

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
    const medicoId = this.auth.currentUserValue?.id;
    if (medicoId) {
      this.visService.getVisiteByMedico(medicoId).subscribe({
        next: (visite) => {
          this.events = this.mappaEventi(visite);
          this.refresh.next(); //aggiornamento grafico forzato
        },
        error: (err) => console.error(err)
      });
    }
  }

  mappaEventi(visite: VisitaDTO[]): CalendarEvent[] {
    return visite.map(v => {
      //sicurezza per evitare errori di calcolo della data
      if (!v.dataVisita) return null;

      const start = new Date(v.dataVisita);
      const end = new Date(start.getTime() + 60 * 60 * 1000);//durata 1 ora di base

      return {
        start: start,
        end: end,
        title: `${v.paziente?.nome} ${v.paziente?.cognome} - ${v.prenotazione?.motivo}`,
        color: { primary: '#0066cc', secondary: '#D1E8FF' }, // Colori blu medico
        meta: { visitaId: v.id } // Dati extra utili al click
      };
    }).filter(e => e !== null) as CalendarEvent[];
  }

  protected readonly alert = alert;
}
