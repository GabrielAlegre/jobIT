import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPagosPage } from './listar-pagos.page';

describe('ListarPagosPage', () => {
  let component: ListarPagosPage;
  let fixture: ComponentFixture<ListarPagosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPagosPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarPagosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
