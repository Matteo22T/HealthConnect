import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {StatCardAdmin} from '../components/stat-card-admin/stat-card-admin';
import {utenteDTO} from '../../../model/utenteDTO';
import {UtenteService} from '../../../service/utente-service';
import {VisitaService} from '../../../service/visita-service';
import {forkJoin} from 'rxjs';
import {ListaPending} from '../components/lista-pending/lista-pending';
import {ListaUtenti} from '../components/lista-utenti/lista-utenti';

@Component({
  selector: 'app-dashboard-admin',
  imports: [
    StatCardAdmin,
    ListaPending,
    ListaUtenti
  ],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements OnInit{
  utenti: utenteDTO[] = []
  medici: number = 0
  mediciDaApprovare: utenteDTO[] = []
  pazienti: number = 0
  visite: number = 0;

  constructor(private visiteService: VisitaService ,private utenteService: UtenteService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    forkJoin({
      vis: this.visiteService.getNumeroVisiteOdierne(),
      ut: this.utenteService.getUtenteAll()
    }).subscribe({
      next: result => {
        this.visite = result.vis;
        this.utenti = result.ut;
        this.dividiUtenti();
        this.cd.detectChanges();
      },
      error: err => {
        console.error('Errore server', err);
      }
    });
  }

  dividiUtenti(){
    for (const utente of this.utenti){
      if(utente.ruolo==='MEDICO'){
        this.medici+=1;
        if(utente.stato_approvazione==='PENDING'){
          this.mediciDaApprovare.push(utente);
        }
      }
      else if(utente.ruolo==='PAZIENTE'){
        this.pazienti+=1;
      }
    }
  }

  accettaMedico(idMedico: number) {
    this.utenteService.approvaMedico(idMedico).subscribe({
      next: (res) => {
        console.log('Medico accettato', res);
        this.mediciDaApprovare = this.mediciDaApprovare.filter(m => m.id !== idMedico);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Errore server', err);
      }
    })
  }

  rifiutaMedico(idMedico: number) {
    this.utenteService.rifiutaMedico(idMedico).subscribe({
      next: (res) => {
        console.log('Medico rifiutato', res);
        this.mediciDaApprovare = this.mediciDaApprovare.filter(m => m.id !== idMedico);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Errore server', err);
      }
    })
  }







}
