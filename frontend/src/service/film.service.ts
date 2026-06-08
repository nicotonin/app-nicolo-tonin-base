import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Film } from './film.entity';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  protected http = inject(HttpClient);

  list() {
    return this.http.get<Film[]>(`${environment.apiUrl}/films`);
  }

  get(id: string) {
    return this.http.get<Film>(`${environment.apiUrl}/films/${id}`);
  }

  create(data: Partial<Film>) {
    return this.http.post<Film>(`${environment.apiUrl}/films`, data);
  }

  update(id: string, body: Partial<Film>) {
    return this.http.put<Film>(`${environment.apiUrl}/films/${id}`, body);
  }

  remove(id: string) {
    return this.http.delete(`${environment.apiUrl}/films/${id}`);
  }
}
