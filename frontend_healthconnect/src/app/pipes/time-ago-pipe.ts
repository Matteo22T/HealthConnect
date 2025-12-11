import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';

    // Converti la data di invio in oggetto Date e ottieni il timestamp
    const dataInvio = new Date(value);
    const ora = new Date();

    // Calcola la differenza in secondi
    const secondiPassati = Math.floor((ora.getTime() - dataInvio.getTime()) / 1000);

    // Gestione dei vari intervalli temporali
    if (secondiPassati < 60) {
      return 'poco fa';
    }

    const minuti = Math.floor(secondiPassati / 60);
    if (minuti < 60) {
      return minuti + ' min fa';
    }

    const ore = Math.floor(minuti / 60);
    if (ore < 24) {
      return ore + ' ore fa';
    }

    const giorni = Math.floor(ore / 24);
    if (giorni < 7) {
      return giorni + ' giorni fa';
    }

    // Se è passato più di una settimana, mostra la data normale
    return dataInvio.toLocaleDateString('it-IT');
  }
}
