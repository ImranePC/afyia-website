import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CanActivateFn, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

const SUPPORTED_LANGS = ['fr', 'en'];
const DEFAULT_LANG = 'en';

export const langRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  const cookie = inject(CookieService);
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  const savedLang = cookie.get('language');
  if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
    router.navigate([`/${savedLang}`]);

    return false;
  }

  const browserLang = isBrowser ? navigator.language.split('-')[0] : DEFAULT_LANG;
  const lang = SUPPORTED_LANGS.includes(browserLang) ? browserLang : DEFAULT_LANG;

  router.navigate([`/${lang}`]);
  return false;
}
