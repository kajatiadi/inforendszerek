import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { importProvidersFrom, LOCALE_ID } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes";
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';

registerLocaleData(localeHu);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'hu-HU' }
  ]
}).catch(err => console.error(err));
