import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiCvPage } from './mi-cv.page';

describe('MiCvPage', () => {
  let component: MiCvPage;
  let fixture: ComponentFixture<MiCvPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiCvPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiCvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
