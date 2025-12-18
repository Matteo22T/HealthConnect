import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom, inject, provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// --- 1. AGGIUNGI QUESTE IMPORTAZIONI FONDAMENTALI ---
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {AuthService} from './service/auth-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),
    provideHttpClient(withInterceptorsFromDi()),

    // --- 2. IL TUO BLOCCO CALENDARIO (Ora funzionerà perché hai gli import sopra) ---
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),

    //appena avvio l'app mi checka l'autenticazione
    provideAppInitializer(() => {
      const authService = inject(AuthService);

      return authService.checkAuth();
    })
  ]
};
