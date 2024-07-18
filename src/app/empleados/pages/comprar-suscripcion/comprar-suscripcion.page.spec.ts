import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprarSuscripcionPage } from './comprar-suscripcion.page';

describe('ComprarSuscripcionPage', () => {
  let component: ComprarSuscripcionPage;
  let fixture: ComponentFixture<ComprarSuscripcionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprarSuscripcionPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprarSuscripcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
