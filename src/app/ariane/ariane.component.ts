import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export interface Path {
  name: string,
  link: string,
  active?: boolean,
}

@Component({
  selector: 'app-ariane',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './ariane.component.html',
  styleUrl: './ariane.component.scss'
})
export class ArianeComponent {
  @Input()
  path: Path[] = [
    { name: 'header.product', link: '/products' },
  ];
}
