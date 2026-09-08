import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { TranslateLoader } from '@ngx-translate/core';
import { appConfig } from './app.config';
import { TranslateServerLoader } from './i18n/translate-server.loader';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: TranslateLoader, useClass: TranslateServerLoader },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
