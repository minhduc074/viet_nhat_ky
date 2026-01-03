import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { AiUsageComponent } from './components/ai-usage/ai-usage.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './services/admin.service';

// Auth guard
const authGuard = () => {
  const adminService = inject(AdminService);
  const router = inject(Router);
  
  if (adminService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: 'ai-usage', component: AiUsageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
