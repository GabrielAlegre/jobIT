import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosLayoutPage } from './datos-layout.page';

describe('DatosLayoutPage', () => {
  let component: DatosLayoutPage;
  let fixture: ComponentFixture<DatosLayoutPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosLayoutPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
