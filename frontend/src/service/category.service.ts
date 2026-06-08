import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Category } from './category.entity';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  protected http = inject(HttpClient);

  list() {
    return this.http.get<Category[]>(`${environment.apiUrl}/categorys`);
  }

  get(id: string) {
    return this.http.get<Category>(`${environment.apiUrl}/categorys/${id}`);
  }

  create(data: Partial<Category>) {
    return this.http.post<Category>(`${environment.apiUrl}/categorys`, data);
  }

  update(id: string, body: Partial<Category>) {
    return this.http.put<Category>(`${environment.apiUrl}/categorys/${id}`, body);
  }

  remove(id: string) {
    return this.http.delete(`${environment.apiUrl}/categorys/${id}`);
  }
}
