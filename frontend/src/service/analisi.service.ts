
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Analisi } from './analisi.entity';

@Injectable({
  providedIn: 'root'
})
export class AnalisiService {

  protected http = inject(HttpClient);

  list() {
    return this.http.get<Analisi[]>(
      `${environment.apiUrl}/analisis`
    );
  }

  get(id: string) {
    return this.http.get<Analisi>(
      `${environment.apiUrl}/analisis/${id}`
    );
  }

  create(data: Partial<Analisi>) {
    return this.http.post<Analisi>(
      `${environment.apiUrl}/analisis`,
      data
    );
  }

  update(id: string, body: Partial<Analisi>) {
    return this.http.put<Analisi>(
      `${environment.apiUrl}/analisis/${id}`,
      body
    );
  }

  remove(id: string) {
    return this.http.delete(
      `${environment.apiUrl}/analisis/${id}`
    );
  }
}
