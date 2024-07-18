import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDatosEmpleadoPage } from './mis-datos-empleado.page';

describe('MisDatosEmpleadoPage', () => {
  let component: MisDatosEmpleadoPage;
  let fixture: ComponentFixture<MisDatosEmpleadoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisDatosEmpleadoPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisDatosEmpleadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
