import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContainerComponent } from './app-features/dashboard/dashboard-container/dashboard-container.component';
import { ConfirmForgotPasswordComponent } from './app-main/auth/confirm-forgot-password/confirm-forgot-password.component';
import { ForgotPasswordComponent } from './app-main/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './app-main/auth/login/login.component';
import { SignupVerificationComponent } from './app-main/auth/signup-verification/signup-verification.component';
import { SignupComponent } from './app-main/auth/signup/signup.component';
import { AuthLayoutComponent } from './app-main/layouts/auth-layout/auth-layout.component';
import { HomeLayoutComponent } from './app-main/layouts/home-layout/home-layout.component';
import { AuthGuardGuard } from './guards/auth-guard.guard';

// Two main routes here - lazy load children
// Authlayout -> Children - signin,login,forget password
// Homelayout -> Children - dashboard, clustering, prediction etc..

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'confirm-forgot-password', component: ConfirmForgotPasswordComponent },
      { path: 'email-verification', component: SignupVerificationComponent },
    ],
  },
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [],
    children: [
      { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
      // { path: 'dashboard', component: DashboardContainerComponent },
      {
        path: 'dashboard',
        loadChildren: () => import('./app-features/dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthGuardGuard]
      },
      {
        path: 'cluster',
        loadChildren: () => import('./app-features/clustering/clustering.module').then((m) => m.ClusteringModule),
        canActivate: [AuthGuardGuard]
      },
      {
        path: 'prediction',
        loadChildren: () => import('./app-features/prediction/prediction.module').then((m) => m.PredictionModule),
        canActivate: [AuthGuardGuard]
      },
      {
        path: 'team',
        loadChildren: () => import('./app-features/team/team.module').then((m) => m.TeamModule),
        canActivate: [AuthGuardGuard]
      },
      {
        path: 'trend',
        loadChildren: () => import('./app-features/trend/trend.module').then((m) => m.TrendModule),
        canActivate: [AuthGuardGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./app-features/profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [AuthGuardGuard]
      },
      {
        path: 'data-management',
        loadChildren: () => import('./app-features/data-management/data-management.module').then((m) => m.DataManagementModule),
        canActivate: [AuthGuardGuard]
      },
      {
        path: '**',
        loadChildren: () => import('./app-features/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
