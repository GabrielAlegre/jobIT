import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarModificarPublicacionPage } from './agregar-modificar-publicacion.page';

describe('AgregarModificarPublicacionPage', () => {
  let component: AgregarModificarPublicacionPage;
  let fixture: ComponentFixture<AgregarModificarPublicacionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarModificarPublicacionPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarModificarPublicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
