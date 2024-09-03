import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LegalComponent } from './legal/legal.component';

export const routes: Routes = [
  { path: 'legal-mentions', component: LegalComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', component: HomeComponent },
];
