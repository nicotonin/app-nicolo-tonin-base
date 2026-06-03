import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AppComponent } from './app.component';
import { authInterceptor } from '../utils/auth.interceptor';
import { logoutInterceptor } from '../utils/logout.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    App,
    AppComponent,
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
