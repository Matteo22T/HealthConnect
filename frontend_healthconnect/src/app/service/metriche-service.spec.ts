import { TestBed } from '@angular/core/testing';

import { MetricheService } from './metriche-service';

describe('MetricheService', () => {
  let service: MetricheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
