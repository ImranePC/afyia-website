import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  { path: 'contact', component: ContactComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', component: HomeComponent },
];
