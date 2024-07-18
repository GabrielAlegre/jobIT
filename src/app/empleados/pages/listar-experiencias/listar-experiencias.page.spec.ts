import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarExperienciasPage } from './listar-experiencias.page';

describe('ListarExperienciasPage', () => {
  let component: ListarExperienciasPage;
  let fixture: ComponentFixture<ListarExperienciasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarExperienciasPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarExperienciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
