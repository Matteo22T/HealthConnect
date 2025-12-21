import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {inject} from '@angular/core';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.currentUserValue;

  if (user){
    if (user.ruolo === 'MEDICO')  return router.createUrlTree(["/medico/dashboard"])
    if (user.ruolo === 'PAZIENTE') return router.createUrlTree(['/paziente/dashboard']);
    if (user.ruolo === 'ADMIN') return router.createUrlTree(['/admin/dashboard']);
  }
  return true;
};
