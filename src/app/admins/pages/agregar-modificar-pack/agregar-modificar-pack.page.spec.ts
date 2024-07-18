import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarModificarPackPage } from './agregar-modificar-pack.page';

describe('AgregarModificarPackPage', () => {
  let component: AgregarModificarPackPage;
  let fixture: ComponentFixture<AgregarModificarPackPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarModificarPackPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarModificarPackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
