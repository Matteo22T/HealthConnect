import { Routes } from '@angular/router';
import {Home} from './pagine/home/home';
import {Login} from './pagine/login/login';
import {Register} from './pagine/register/register';
import {DashboardMedico} from './pagine/medico/dashboard-medico/dashboard-medico';
import { DashboardAdmin } from "./pagine/admin/dashboard-admin/dashboard-admin";
import {DashboardPaziente} from './pagine/paziente/dashboard-paziente/dashboard-paziente';
import {MedicoLayout} from './pagine/medico/medico-layout/medico-layout';
import {PazienteLayout} from './pagine/paziente/paziente-layout/paziente-layout';
import {CalendarioMedico} from './pagine/medico/calendario-medico/calendario-medico';
import {PazientiMedico} from './pagine/medico/pazienti-medico/pazienti-medico';
import {ChatMedico} from './pagine/medico/chat-medico/chat-medico';
import {AppuntamentiMedico} from './pagine/medico/appuntamenti-medico/appuntamenti-medico';
import {AssistenteAi} from './pagine/paziente/assistente-ai/assistente-ai';
import {CartellaClinicaPaziente} from './pagine/paziente/cartella-clinica-paziente/cartella-clinica-paziente';
import {ProfiloMedico} from './pagine/medico/profilo-medico/profilo-medico';
import {ImpostazioniMedico} from './pagine/medico/impostazioni-medico/impostazioni-medico';
import {DettaglioPazienteMedico} from './pagine/medico/dettaglio-paziente-medico/dettaglio-paziente-medico';
import {VisitaDettaglioMedico} from './pagine/medico/visita-dettaglio-medico/visita-dettaglio-medico';
import {ProfiloPaziente} from './pagine/paziente/profilo-paziente/profilo-paziente';



export const routes: Routes = [
  { path: 'login', component: Login},
  { path: 'register', component: Register},

  {path: 'admin/dashboard', component: DashboardAdmin},

  {path: 'paziente', component: PazienteLayout, children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardPaziente},
      {path: 'ai', component: AssistenteAi},
      {path: 'cartella', component: CartellaClinicaPaziente},
      {path: 'profilo', component: ProfiloPaziente}

    ]},

  {path: 'medico', component: MedicoLayout, children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'profilo', component: ProfiloMedico},
      {path: 'impostazioni', component: ImpostazioniMedico},
      {path: 'dashboard', component: DashboardMedico},
      {path: 'calendario', component: CalendarioMedico},
      {path: 'paziente/:id', component: DettaglioPazienteMedico},
      {path: 'pazienti', component: PazientiMedico},
      {path: 'chat', component: ChatMedico},
      {path: 'visite/:id', component: VisitaDettaglioMedico}
    ]},

  { path: '**', component: Home}
];
