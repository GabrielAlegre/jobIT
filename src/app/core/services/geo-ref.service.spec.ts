import { TestBed } from '@angular/core/testing';

import { GeoRefService } from './geo-ref.service';

describe('GeoRefService', () => {
  let service: GeoRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoRefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
