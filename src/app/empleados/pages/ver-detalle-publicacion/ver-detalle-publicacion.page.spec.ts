import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetallePublicacionPage } from './ver-detalle-publicacion.page';

describe('VerDetallePublicacionPage', () => {
  let component: VerDetallePublicacionPage;
  let fixture: ComponentFixture<VerDetallePublicacionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerDetallePublicacionPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerDetallePublicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
