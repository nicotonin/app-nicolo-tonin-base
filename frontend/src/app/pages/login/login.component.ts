import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Subject, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { emailValidator, passwordStrengthValidator } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:false
})
export class LoginComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private authSrv = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private destroyed$ = new Subject<void>();

  loginForm = this.fb.group({
    email: ['', [Validators.required, emailValidator]],
    password: ['', [Validators.required, passwordStrengthValidator]]
  });

  submitted = false;
  loginError = '';
  requestedUrl: string | null = null;

  loading = false;

  ngOnInit() {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loginError = '';
        Object.keys(this.loginForm.controls).forEach(key => {
          const control = this.loginForm.get(key);
          if (control?.errors?.['backend']) {
            const { backend, ...rest } = control.errors;
            control.setErrors(Object.keys(rest).length ? rest : null);
          }
        });
      });

    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.destroyed$),
        map(params => params['requestedUrl'])
      )
      .subscribe(url => {
        this.requestedUrl = url;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.loading = true;

    this.authSrv.login(email!, password!)
      .pipe(
        catchError(err => {
          if (err.error?.message === 'invalid email') {
            this.loginForm.get('email')?.setErrors({ backend: 'Email not found' });
          } else if (err.error?.message === 'password supplied') {
            this.loginForm.get('password')?.setErrors({ backend: 'Wrong password' });
          } else {
            this.loginError = err?.error?.message || 'Login error';
          }
          this.loading = false;
          return throwError(() => err);
        })
      )
      .subscribe(() => {
        this.loading = false;
        this.router.navigate([this.requestedUrl ? this.requestedUrl : '/home']);
      });
  }
}