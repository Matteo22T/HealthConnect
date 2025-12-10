import { TestBed } from '@angular/core/testing';

import { MessaggioService } from './messaggio-service';

describe('MessaggioService', () => {
  let service: MessaggioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessaggioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
