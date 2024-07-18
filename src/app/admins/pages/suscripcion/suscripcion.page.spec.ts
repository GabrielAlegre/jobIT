import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscripcionPage } from './suscripcion.page';

describe('SubscripcionPage', () => {
    let component: SubscripcionPage;
    let fixture: ComponentFixture<SubscripcionPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SubscripcionPage]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SubscripcionPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
