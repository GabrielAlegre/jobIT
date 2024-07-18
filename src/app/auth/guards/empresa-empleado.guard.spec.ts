import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { empresaEmpleadoGuard } from './empresa-empleado.guard';

describe('empresaEmpleadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => empresaEmpleadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
