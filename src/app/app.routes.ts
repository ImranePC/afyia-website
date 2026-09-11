import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ContactComponent } from './views/contact/contact.component';
import { LegalComponent } from './views/legal/legal.component';
import { AboutComponent } from './views/about/about.component';
import { ProductsComponent } from './views/products/products.component';
import { ProductComponent } from './views/products/product/product.component';
import { NewsComponent } from './views/news/news.component';
import { NewsPageComponent } from './views/news/news-page/news-page.component';
import { SoftwareComponent } from './views/approach/software/software.component';
import { RequestAccountComponent } from './views/approach/software/request-account/request-account.component';
import { ManageNewsComponent } from './admin/manage-news/manage-news.component';
import { ManageNewsPageComponent } from './admin/manage-news/manage-news-page/manage-news-page.component';
import { PrivateLoginComponent } from './private-login/private-login.component';
import { authGuard } from './guards/auth.guard';
import { AboutIllnessComponent } from './views/about-illness/about-illness.component';
import { langResolver } from './resolvers/lang.resolver';
import { BiotechnologyComponent } from './views/approach/biotechnology/biotechnology.component';
import { ProcessComponent } from './views/approach/process/process.component';
import { HealthComponent } from './views/approach/health/health.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { langRedirectGuard } from './guards/lang-redirect.guard';
import { langMatchGuard } from './guards/lang-match.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [langRedirectGuard],
    children: [],
  },
  {
    path: ':lang',
    canMatch: [langMatchGuard],
    resolve: { lang: langResolver },
    children: [
      { path: '', component: HomeComponent, data: { seo: 'home' } },
      { path: 'account-request', component: RequestAccountComponent, data: { seo: 'account_request' } },
      { path: 'about', component: AboutComponent, data: { seo: 'about' } },
      { path: 'products/:id', component: AboutIllnessComponent },
      { path: 'software', component: SoftwareComponent, data: { seo: 'software' } },
      { path: 'news/:id', component: NewsPageComponent },
      { path: 'news', component: NewsComponent, data: { seo: 'news' } },
      { path: 'product/:id', component: ProductComponent },
      { path: 'products', component: ProductsComponent, data: { seo: 'products' } },
      { path: 'legal-mentions', component: LegalComponent, data: { seo: 'legal' } },
      { path: 'contact', component: ContactComponent, data: { seo: 'contact' } },
      { path: 'biotechnology', component: BiotechnologyComponent, data: { seo: 'biotechnology' } },
      { path: 'industrial-process', component: ProcessComponent, data: { seo: 'industrial_process' } },
      { path: 'human-health', component: HealthComponent, data: { seo: 'human_health' } },
      { path: '404', component: NotFoundComponent, data: { seo: 'not_found', noindex: true } },
    ]
  },
  { path: '**', component: NotFoundComponent, data: { seo: 'not_found', noindex: true } },
];
