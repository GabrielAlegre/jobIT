import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetallePostulantePage } from './ver-detalle-postulante.page';

describe('VerDetallePostulantePage', () => {
  let component: VerDetallePostulantePage;
  let fixture: ComponentFixture<VerDetallePostulantePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerDetallePostulantePage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerDetallePostulantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
