import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ContactComponent } from './views/contact/contact.component';
import { LegalComponent } from './views/legal/legal.component';
import { AboutComponent } from './views/about/about.component';
import { ProductsComponent } from './views/products/products.component';
import { ProductComponent } from './views/products/product/product.component';
import { NewsComponent } from './views/news/news.component';
import { NewsPageComponent } from './views/news/news-page/news-page.component';
import { SoftwareComponent } from './views/software/software.component';
import { RequestAccountComponent } from './views/software/request-account/request-account.component';
import { ManageNewsComponent } from './admin/manage-news/manage-news.component';
import { ManageNewsPageComponent } from './admin/manage-news/manage-news-page/manage-news-page.component';
import { PrivateLoginComponent } from './private-login/private-login.component';
import { authGuard } from './guards/auth.guard';
import { AboutIllnessAComponent } from './views/about-illness/illness-a/about-illness-a.component';
import { AboutIllnessBComponent } from './views/about-illness/illness-b/about-illness-b.component';
import { AboutIllnessCComponent } from './views/about-illness/illness-c/about-illness-c.component';
import { AboutIllnessDComponent } from './views/about-illness/illness-d/about-illness-d.component';

export const adminRoutes: Routes = [
  { path: 'admin/manage-news/create', component: ManageNewsPageComponent, canActivate: [authGuard]},
  { path: 'admin/manage-news/:id', component: ManageNewsPageComponent, canActivate: [authGuard]},
  { path: 'admin/manage-news', component: ManageNewsComponent, canActivate: [authGuard]},
]

export const routes: Routes = [
  ...adminRoutes,
  { path: 'private-login', component: PrivateLoginComponent },
  { path: 'account-request', component: RequestAccountComponent },
  { path: 'about', component: AboutComponent },
  { path: 'products/febrile-rash', component: AboutIllnessAComponent },
  { path: 'products/hepatitis', component: AboutIllnessBComponent },
  { path: 'products/respiratory', component: AboutIllnessCComponent },
  { path: 'products/tuberculosis', component: AboutIllnessDComponent },
  { path: 'software', component: SoftwareComponent },
  { path: 'news/:id', component: NewsPageComponent },
  { path: 'news', component: NewsComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'legal-mentions', component: LegalComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
