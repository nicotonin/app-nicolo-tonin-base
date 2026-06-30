
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Test } from './test.entity';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  protected http = inject(HttpClient);

  list() {
    return this.http.get<Test[]>(
      `${environment.apiUrl}/tests`
    );
  }

  get(id: string) {
    return this.http.get<Test>(
      `${environment.apiUrl}/tests/${id}`
    );
  }

  create(data: Partial<Test>) {
    return this.http.post<Test>(
      `${environment.apiUrl}/tests`,
      data
    );
  }

  update(id: string, body: Partial<Test>) {
    return this.http.put<Test>(
      `${environment.apiUrl}/tests/${id}`,
      body
    );
  }

  remove(id: string) {
    return this.http.delete(
      `${environment.apiUrl}/tests/${id}`
    );
  }
}
