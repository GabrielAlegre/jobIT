import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisSuscripcionesPage } from './mis-suscripciones.page';

describe('MisSuscripcionesPage', () => {
  let component: MisSuscripcionesPage;
  let fixture: ComponentFixture<MisSuscripcionesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisSuscripcionesPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisSuscripcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
