import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./product/product-detail.component').then(m => m.ProductDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];