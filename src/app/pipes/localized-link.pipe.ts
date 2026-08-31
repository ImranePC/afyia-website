import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'localizedLink', standalone: true })
export class LocalizedLinkPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(path: unknown[] | string = ''): unknown[] {
    const segments = Array.isArray(path)
      ? path
      : String(path).split('/').filter(Boolean);
    return ['/', this.translate.currentLang || 'fr', ...segments];
  }
}
