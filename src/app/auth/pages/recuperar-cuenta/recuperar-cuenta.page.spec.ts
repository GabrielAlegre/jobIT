import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarCuentaPage } from './recuperar-cuenta.page';

describe('RecuperarCuentaPage', () => {
  let component: RecuperarCuentaPage;
  let fixture: ComponentFixture<RecuperarCuentaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarCuentaPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecuperarCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
