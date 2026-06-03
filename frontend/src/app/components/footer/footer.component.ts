import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  year = new Date().getFullYear();

     private authSrv = inject(AuthService);

  userRole: string | null = null;

  currentUser$ = this.authSrv.currentUser$;

  ngOnInit() {
    this.userRole = this.authSrv.getCurrentUser()?.role ?? null;
  }

  logout() {
    this.authSrv.logout();
  }
}