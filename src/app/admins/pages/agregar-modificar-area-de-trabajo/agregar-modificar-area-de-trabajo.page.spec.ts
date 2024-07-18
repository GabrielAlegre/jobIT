import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarModificarAreaDeTrabajoPage } from './agregar-modificar-area-de-trabajo.page';

describe('AgregarModificarAreaDeTrabajoPage', () => {
  let component: AgregarModificarAreaDeTrabajoPage;
  let fixture: ComponentFixture<AgregarModificarAreaDeTrabajoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarModificarAreaDeTrabajoPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarModificarAreaDeTrabajoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
