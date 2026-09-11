import { CanMatchFn, UrlSegment } from '@angular/router';

const SUPPORTED_LANGS = ['fr', 'en'];

/**
 * Only let the `:lang` route match when the first segment is a supported
 * language. Anything else falls through to the `**` (not-found) route instead
 * of being served as `/fr` content.
 */
export const langMatchGuard: CanMatchFn = (_route, segments: UrlSegment[]) =>
  SUPPORTED_LANGS.includes(segments[0]?.path);
