import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LegalComponent } from './legal/legal.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'legal-mentions', component: LegalComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
