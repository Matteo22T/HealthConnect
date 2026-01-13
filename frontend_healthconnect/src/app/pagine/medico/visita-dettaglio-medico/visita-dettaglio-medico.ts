import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {VisitaService} from '../../../service/visita-service';
import {VisitaDettaglioDTO} from '../../../model/visitaDettaglioDTO';
import {Location, NgIf} from '@angular/common';
import {VisitaDettaglioHeader} from '../components/visita-dettaglio-header/visita-dettaglio-header';
import {FormsModule} from '@angular/forms';
import {GestisciPrescrizioniMedico} from '../components/gestisci-prescrizioni-medico/gestisci-prescrizioni-medico';

@Component({
  selector: 'app-visita-dettaglio-medico',
  imports: [
    VisitaDettaglioHeader,
    NgIf,
    FormsModule,
    GestisciPrescrizioniMedico
  ],
  templateUrl: './visita-dettaglio-medico.html',
  styleUrl: './visita-dettaglio-medico.css',
})
export class VisitaDettaglioMedico implements OnInit{

  visita: VisitaDettaglioDTO | undefined;
  messaggio_successo = ''

  constructor(private route: ActivatedRoute,
              private location: Location,
              private visService: VisitaService,
              private changeDet: ChangeDetectorRef) {}

  ngOnInit() {
    const visitaId = this.route.snapshot.paramMap.get('id');
    if (visitaId){
      this.visService.getVisitaById(visitaId).subscribe({
        next: vis =>  {this.visita = vis
        this.changeDet.detectChanges()
        },
        error: err => {console.error('Errore server', err)}
      })
    }
  }

  salva() {
    if (this.visita) {

      this.visService.salvaVisita(this.visita).subscribe({
        next: risposta => {
          this.messaggio_successo = 'Visita salvata con successo!'
          this.changeDet.detectChanges();
          window.scrollBy({
            top: 150,
            left: 0,
            behavior: 'smooth'
          });
        },
        error: err => {
          console.error('Errore server', err)
        }
      })
    }
  }

  tornaIndietro() {
    this.location.back()
  }
}
