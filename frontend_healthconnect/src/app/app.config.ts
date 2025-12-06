import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      //per lo scroll
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', //riporta in cima quando cambiamo pagina
        anchorScrolling: 'enabled',
      })
    )
  ]
};
