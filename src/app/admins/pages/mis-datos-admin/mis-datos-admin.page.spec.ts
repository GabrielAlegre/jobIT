import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDatosAdminPage } from './mis-datos-admin.page';

describe('MisDatosAdminPage', () => {
  let component: MisDatosAdminPage;
  let fixture: ComponentFixture<MisDatosAdminPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisDatosAdminPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisDatosAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
