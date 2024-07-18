import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDatosEmpresaPage } from './mis-datos-empresa.page';

describe('MisDatosEmpresaPage', () => {
  let component: MisDatosEmpresaPage;
  let fixture: ComponentFixture<MisDatosEmpresaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisDatosEmpresaPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisDatosEmpresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
