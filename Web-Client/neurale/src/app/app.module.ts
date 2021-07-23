import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutUsComponent } from './Pages/about-us/about-us.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './Pages/home/home.component';
import { ContactComponent } from './Pages/contact/contact.component';
import { BlogComponent } from './Pages/blog/blog.component';
import { TeamComponent } from './Pages/team/team.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ContactComponent,
    BlogComponent,
    TeamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
