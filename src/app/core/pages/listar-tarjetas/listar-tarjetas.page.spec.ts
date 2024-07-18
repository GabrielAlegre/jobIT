import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTarjetasPage } from './listar-tarjetas.page';

describe('ListarTarjetasPage', () => {
  let component: ListarTarjetasPage;
  let fixture: ComponentFixture<ListarTarjetasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarTarjetasPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarTarjetasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
