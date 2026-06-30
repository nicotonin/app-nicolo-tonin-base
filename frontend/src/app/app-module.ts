import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { App } from './app';
import { AppComponent } from './app.component';
import { authInterceptor } from '../utils/auth.interceptor';
import { logoutInterceptor } from '../utils/logout.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavUserComponent } from './components/nav-user/nav-user.component';
import { IfAuthenticatedDirective } from '../utils/if-authenticated.directive';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryDetailComponent } from './pages/category/category-detail.component';
import { FilmComponent } from './pages/film/film.component';
import { FilmDetailComponent } from './pages/film/film-detail.component';
import { AnalisiComponent } from './pages/analisi/analisi.component';
import { AnalisiDetailComponent } from './pages/analisi/analisi-detail.component';
import { AppRoutingModule } from './app-routing-module';

@NgModule({
  declarations: [
    AnalisiComponent,
    AnalisiDetailComponent,
    App,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarComponent,
    NavUserComponent,
    IfAuthenticatedDirective,
    CategoryComponent,
    CategoryDetailComponent,
    FilmComponent,
    FilmDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
 providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, logoutInterceptor])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
