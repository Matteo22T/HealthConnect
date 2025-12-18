import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {inject} from '@angular/core';

export const AuthGuard: CanActivateFn = (route,state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.currentUserValue;

  //se non sono loggato vado al login
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  //se hai il ruolo sbagliato vado alla home
  const ruoloRichiesto = route.data['ruolo'];
  if (ruoloRichiesto && user.ruolo !== ruoloRichiesto) {
    return router.createUrlTree(['/']);
  }

  return true;
};
