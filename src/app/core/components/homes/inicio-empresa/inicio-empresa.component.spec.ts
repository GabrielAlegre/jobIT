import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioEmpresaComponent } from './inicio-empresa.component';

describe('InicioEmpresaComponent', () => {
  let component: InicioEmpresaComponent;
  let fixture: ComponentFixture<InicioEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
