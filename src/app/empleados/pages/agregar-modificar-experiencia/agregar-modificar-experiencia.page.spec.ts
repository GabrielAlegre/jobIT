import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarModificarExperienciaPage } from './agregar-modificar-experiencia.page';

describe('AgregarModificarExperienciaPage', () => {
  let component: AgregarModificarExperienciaPage;
  let fixture: ComponentFixture<AgregarModificarExperienciaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarModificarExperienciaPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarModificarExperienciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
