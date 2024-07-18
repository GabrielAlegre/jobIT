import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

    getItem(key: string): null | unknown {
        const data = localStorage.getItem(key);
        if (!data) return null;
        try { return JSON.parse(data); }
        catch (error) {
            console.warn('LocalStorage it was touched...');
        }
        return null;
    }

    setItem(key: string, data: unknown): void {
        const dataString = JSON.stringify(data);
        localStorage.setItem(key, dataString);
    }

    removeitem(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
