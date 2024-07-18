import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarModificarTarjetaPage } from './agregar-modificar-tarjeta.page';

describe('AgregarModificarTarjetaPage', () => {
  let component: AgregarModificarTarjetaPage;
  let fixture: ComponentFixture<AgregarModificarTarjetaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarModificarTarjetaPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarModificarTarjetaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
