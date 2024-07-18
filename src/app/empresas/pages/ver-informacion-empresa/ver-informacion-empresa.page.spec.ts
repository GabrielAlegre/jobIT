import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInformacionEmpresaPage } from './ver-informacion-empresa.page';

describe('VerInformacionEmpresaPage', () => {
  let component: VerInformacionEmpresaPage;
  let fixture: ComponentFixture<VerInformacionEmpresaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerInformacionEmpresaPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerInformacionEmpresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
