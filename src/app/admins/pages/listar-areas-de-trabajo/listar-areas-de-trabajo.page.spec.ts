import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAreasDeTrabajoPage } from './listar-areas-de-trabajo.page';

describe('ListarAreasDeTrabajoPage', () => {
  let component: ListarAreasDeTrabajoPage;
  let fixture: ComponentFixture<ListarAreasDeTrabajoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAreasDeTrabajoPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarAreasDeTrabajoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
