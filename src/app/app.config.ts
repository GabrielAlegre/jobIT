import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';

import { registerLocaleData } from '@angular/common';
import localEsAR from '@angular/common/locales/es-AR';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
registerLocaleData(localEsAR);



import { provideAnimations } from '@angular/platform-browser/animations';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';


export const appConfig: ApplicationConfig = {
    providers: [

        // * FIREBASE
        importProvidersFrom(AngularFireModule.initializeApp(environment.firebase)),
        importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
        importProvidersFrom(provideFirestore(() => getFirestore())),
        importProvidersFrom(provideDatabase(() => getDatabase())),
        importProvidersFrom(provideStorage(() => getStorage())),

        provideRouter(
            routes,
            withComponentInputBinding(),
            withViewTransitions()
        ),

        {
            provide: LOCALE_ID,
            useValue: 'es-AR',
        },

        provideAnimations(),

        provideHttpClient(
            withFetch(),
        ),


    ]
};
