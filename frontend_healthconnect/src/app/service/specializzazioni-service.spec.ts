import { TestBed } from '@angular/core/testing';

import { SpecializzazioniService } from './specializzazioni-service';

describe('SpecializzazioniService', () => {
  let service: SpecializzazioniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecializzazioniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
