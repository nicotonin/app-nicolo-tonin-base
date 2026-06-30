import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../../service/auth.service';

export const passwordStrengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value || '';
  const errors: any = {};

  if (value.length < 8) errors.minLength = true;
  if (!/[A-Z]/.test(value)) errors.missingUppercase = true;
  if (!/[a-z]/.test(value)) errors.missingLowercase = true;
  if (!/\d/.test(value)) errors.missingNumber = true;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.missingSpecialChar = true;

  return Object.keys(errors).length ? errors : null;
};

export const emailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value || '';
  const errors: any = {};
  const atIndex = value.indexOf('@');
  if (atIndex < 1) errors.missingLocalPart = true;
  if (atIndex < 1 || atIndex === value.length - 1) errors.missingDomain = true;
  const afterAt = value.slice(atIndex + 1);
  if (afterAt && (!afterAt.includes('.') || afterAt.endsWith('.'))) errors.missingTld = true;
  return Object.keys(errors).length ? errors : null;
};

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordsMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone:false
})
export class RegisterComponent implements OnInit, OnDestroy {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);
  protected cdr = inject(ChangeDetectorRef);

  protected destroyed$ = new Subject<void>();
  registerError = '';
  submitted = false;
  loading = false;
  registered = false;

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, emailValidator]],
    password: ['', [Validators.required, passwordStrengthValidator]],
    confirmPassword: ['', Validators.required],
    role: ['', Validators.required]
  }, { validators: passwordsMatchValidator });

  ngOnInit(): void {
    this.registerForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.registered = false;
        this.registerError = '';
        Object.keys(this.registerForm.controls).forEach(key => {
          const control = this.registerForm.get(key);
          if (control?.errors?.['backend']) {
            const { backend, ...rest } = control.errors;
            control.setErrors(Object.keys(rest).length ? rest : null);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  register() {
    this.submitted = true;
    if (this.registerForm.invalid) return;
    this.registerError = '';
    this.loading = true;

    const formValue = this.registerForm.value;

    this.authSrv.register({
      firstName: formValue.firstName || '',
      lastName: formValue.lastName || '',
      email: formValue.email || '',
      password: formValue.password || '',
      confirmPassword: formValue.confirmPassword || '',
      role: formValue.role || ''
    })
      .pipe(
        catchError(err => {
          if (err.error?.error === 'UserExists') {
            this.registerForm.get('email')?.setErrors({ backend: 'This email is already registered' });
          } else {
            const details = err.error?.details;
            if (details && Array.isArray(details)) {
              details.forEach((d: any) => {
                const control = this.registerForm.get(d.property);
                if (control) {
                  control.setErrors({ ...control.errors, backend: Object.values(d.constraints || {}).join('; ') });
                }
              });
            } else {
              this.registerError = err.error?.message || err.message || 'Registration failed';
            }
          }
          this.loading = false;
          return throwError(() => err);
        })
    )
    .subscribe(() => {
      this.registered = true;
      this.loading = false;
      this.cdr.detectChanges();
      setTimeout(() => this.router.navigate(['/login']), 3000);
    });
  }
}
