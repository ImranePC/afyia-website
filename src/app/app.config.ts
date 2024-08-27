import { ApplicationConfig } from '@angular/core';
import { provideRouter, InMemoryScrollingOptions, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(
    routes,
    // withInMemoryScrolling(scrollConfig),
  ), provideClientHydration()]
};
