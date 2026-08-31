import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'localizedLink', standalone: true, pure: false })
export class LocalizedLinkPipe implements PipeTransform {
  private lastKey = '';
  private lastValue: unknown[] = [];

  constructor(private translate: TranslateService) {}

  transform(path: unknown[] | string = ''): unknown[] {
    const segments = Array.isArray(path)
      ? path
      : String(path).split('/').filter(Boolean);
    const lang = this.translate.currentLang || 'fr';
    const key = `${lang}|${segments.join('/')}`;

    if (key !== this.lastKey) {
      this.lastKey = key;
      this.lastValue = ['/', lang, ...segments];
    }

    return this.lastValue;
  }
}
