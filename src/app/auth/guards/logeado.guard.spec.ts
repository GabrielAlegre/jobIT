import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { logeadoGuard } from './logeado.guard';

describe('logeadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => logeadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
