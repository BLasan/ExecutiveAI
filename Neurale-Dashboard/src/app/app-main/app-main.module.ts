import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SignupVerificationComponent } from './auth/signup-verification/signup-verification.component';
import { CommonDialogComponent } from '../app-common/common-dialog/common-dialog.component';
import { ConfirmForgotPasswordComponent } from './auth/confirm-forgot-password/confirm-forgot-password.component';

// Main components that needs to be loaded only once

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    SidebarComponent,
    HeaderComponent,
    AuthLayoutComponent,
    HomeLayoutComponent,
    SignupComponent,
    LoginComponent,
    ForgotPasswordComponent,
    FooterComponent,
    SignupVerificationComponent,
    ConfirmForgotPasswordComponent
  ],
  entryComponents: [CommonDialogComponent]
})
export class AppMainModule { }
