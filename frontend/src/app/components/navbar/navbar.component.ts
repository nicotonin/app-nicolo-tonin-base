import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private authSrv = inject(AuthService);

  currentUser$ = this.authSrv.currentUser$;

  logout() {
    this.authSrv.logout();
  }
}