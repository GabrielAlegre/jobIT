import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprarPackPage } from './comprar-pack.page';

describe('ComprarPackPage', () => {
  let component: ComprarPackPage;
  let fixture: ComponentFixture<ComprarPackPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprarPackPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprarPackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
