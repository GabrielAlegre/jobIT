import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPacksPage } from './listar-packs.page';

describe('ListarPacksPage', () => {
  let component: ListarPacksPage;
  let fixture: ComponentFixture<ListarPacksPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPacksPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarPacksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
