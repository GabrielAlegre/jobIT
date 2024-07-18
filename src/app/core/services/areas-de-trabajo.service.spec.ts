import { TestBed } from '@angular/core/testing';

import { AreasDeTrabajoService } from './areas-de-trabajo.service';

describe('AreasDeTrabajoService', () => {
  let service: AreasDeTrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreasDeTrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
