import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noLogeadoGuard } from './no-logeado.guard';

describe('noLogeadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noLogeadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
