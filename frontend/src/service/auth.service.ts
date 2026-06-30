import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, map, of, ReplaySubject, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { User } from '../service/user.entity';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected http = inject(HttpClient);
  protected jwtSrv = inject(JwtService);
  protected router = inject(Router);

  protected _currentUser: User | null = null;
  protected _currentUser$ = new ReplaySubject<User | null>(1);
  currentUser$ = this._currentUser$.asObservable();

  getCurrentUser(): User | null {
    return this._currentUser;
  }

  constructor() {
    const token = this.jwtSrv.getToken();

    if (token) {
      const decoded = this.jwtSrv.decodeToken<User>();
      if (decoded) {
        this._currentUser = decoded;
        this._currentUser$.next(decoded);
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  isAuthenticated$ = this.currentUser$
                      .pipe(
                        map(user => !!user),
                        distinctUntilChanged()
                      );


  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, {email, password})
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token)),
        tap(res => { this._currentUser = res.user; this._currentUser$.next(res.user); }),
        map(res => res.user)
      );
  }

  register(user: {firstName: string; lastName: string; email: string; password: string; confirmPassword: string; role: string}) {
  return this.http.post<User>(`${environment.apiUrl}/auth/register`, user)
}


  logout() {
    this.jwtSrv.removeToken();
    this._currentUser = null;
    this._currentUser$.next(null);
  }

}