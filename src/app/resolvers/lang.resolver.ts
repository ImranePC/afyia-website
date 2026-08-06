import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export const langResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot) => {
  const translate = inject(TranslateService);
  const lang = route.paramMap.get('lang') ?? 'fr';

  const supportedLangs = ['fr', 'en'];
  const activeLang = supportedLangs.includes(lang) ? lang : 'fr';

  translate.setDefaultLang('fr');
  return translate.use(activeLang);
};