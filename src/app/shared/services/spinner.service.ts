import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {

    private readonly observable: BehaviorSubject<boolean>
        = new BehaviorSubject<boolean>(false);

    mostrar(): void {
        this.observable.next(true);
    }

    ocultar(): void {
        timer(1000).subscribe(() => {
            this.observable.next(false);
        });
    }

    estado(): BehaviorSubject<boolean> {
        return this.observable;
    }
}
