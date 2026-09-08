import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Translation loader used during prerendering (Node): the HTTP loader can't
 * resolve the relative `./assets/i18n/` URL without a running server, so we
 * read the JSON files straight from disk instead.
 */
export class TranslateServerLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<Record<string, unknown>> {
    try {
      const path = join(process.cwd(), 'src', 'assets', 'i18n', `${lang}.json`);
      return of(JSON.parse(readFileSync(path, 'utf-8')));
    } catch {
      return of({});
    }
  }
}
