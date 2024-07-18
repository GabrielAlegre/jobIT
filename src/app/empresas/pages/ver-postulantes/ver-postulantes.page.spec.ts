import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPostulantesPage } from './ver-postulantes.page';

describe('VerPostulantesPage', () => {
  let component: VerPostulantesPage;
  let fixture: ComponentFixture<VerPostulantesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerPostulantesPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerPostulantesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
