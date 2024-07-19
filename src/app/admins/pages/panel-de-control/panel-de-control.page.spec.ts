import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDeControlPage } from './panel-de-control.page';

describe('PanelDeControlPage', () => {
  let component: PanelDeControlPage;
  let fixture: ComponentFixture<PanelDeControlPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelDeControlPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanelDeControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
