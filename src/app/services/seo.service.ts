import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

/** Canonical origin for the site. If www/non-www changes, change it here. */
export const SITE_URL = 'https://www.afyia-diagnostics.com';

const DEFAULT_IMAGE = `${SITE_URL}/assets/img/afyia_logo.png`;
const SUPPORTED_LANGS = ['fr', 'en'];
const OG_LOCALE: Record<string, string> = { fr: 'fr_FR', en: 'en_US' };

export interface SeoData {
  title: string;
  description: string;
  /** Absolute path of the current page, e.g. `/fr/about`. */
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  /** `<meta name="robots">` value. Defaults to `index,follow`. */
  robots?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private doc = inject(DOCUMENT);

  constructor(private title: Title, private meta: Meta) {}

  update({ title, description, path, image, type = 'website', robots = 'index,follow' }: SeoData): void {
    const cleanPath = path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    const lang = SUPPORTED_LANGS.includes(cleanPath.split('/')[1]) ? cleanPath.split('/')[1] : 'fr';
    const url = SITE_URL + cleanPath;
    const img = image ?? DEFAULT_IMAGE;

    this.title.setTitle(title);
    this.doc.documentElement.lang = lang;

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: robots });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:image', content: img });
    this.meta.updateTag({ property: 'og:site_name', content: 'AFYIA Diagnostics' });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALE[lang] });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: img });

    this.setCanonical(url);
    this.setAlternates(cleanPath);
  }

  private setCanonical(url: string): void {
    this.upsertLink('canonical', url);
  }

  /** fr/en/x-default alternates for the same page in the other language. */
  private setAlternates(cleanPath: string): void {
    const rest = cleanPath.split('/').slice(2).join('/');
    const suffix = rest ? `/${rest}` : '';
    for (const l of SUPPORTED_LANGS) {
      this.upsertLink('alternate', `${SITE_URL}/${l}${suffix}`, l);
    }
    this.upsertLink('alternate', `${SITE_URL}/fr${suffix}`, 'x-default');
  }

  private upsertLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]:not([hreflang])`;
    let el = this.doc.head.querySelector<HTMLLinkElement>(selector);
    if (!el) {
      el = this.doc.createElement('link');
      el.setAttribute('rel', rel);
      if (hreflang) el.setAttribute('hreflang', hreflang);
      this.doc.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }
}
