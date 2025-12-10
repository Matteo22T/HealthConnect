import { TestBed } from '@angular/core/testing';

import { PrescrizioniService } from './prescrizioni-service';

describe('PrescrizioniService', () => {
  let service: PrescrizioniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrescrizioniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
