import { TestBed } from '@angular/core/testing';

import { NotificacionregistroService } from './notificacionregistro.service';

describe('NotificacionregistroService', () => {
  let service: NotificacionregistroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionregistroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
