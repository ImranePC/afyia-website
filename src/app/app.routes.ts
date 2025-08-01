import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LegalComponent } from './legal/legal.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './products/product/product.component';
import { AboutFebrileRashComponent } from './about-illness/about-febrile-rash/about-febrile-rash.component';
import { AboutBloodborneComponent } from './about-illness/about-bloodborne/about-bloodborne.component';
import { AboutRespiratoryComponent } from './about-illness/about-respiratory/about-respiratory.component';
import { NewsComponent } from './news/news.component';
import { NewsPageComponent } from './news/news-page/news-page.component';
import { SoftwareComponent } from './software/software.component';
import { RequestAccountComponent } from './software/request-account/request-account.component';
import { ManageNewsComponent } from './admin/manage-news/manage-news.component';
import { ManageNewsPageComponent } from './admin/manage-news/manage-news-page/manage-news-page.component';
import { PrivateLoginComponent } from './private-login/private-login.component';
import { authGuard } from './guards/auth.guard';

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
  { path: 'bloodborne', component: AboutBloodborneComponent },
  { path: 'febrile-rash', component: AboutFebrileRashComponent },
  { path: 'respiratory', component: AboutRespiratoryComponent },
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
