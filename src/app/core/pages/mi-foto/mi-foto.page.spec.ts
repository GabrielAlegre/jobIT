import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiFotoPage } from './mi-foto.page';

describe('MiFotoPage', () => {
  let component: MiFotoPage;
  let fixture: ComponentFixture<MiFotoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiFotoPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiFotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
