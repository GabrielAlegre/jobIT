import { TestBed } from '@angular/core/testing';

import { CardsDeInicioService } from './cards-de-inicio.service';

describe('CardsDeInicioService', () => {
  let service: CardsDeInicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsDeInicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
