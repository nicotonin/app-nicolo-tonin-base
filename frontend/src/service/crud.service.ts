import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Crud } from './crud.entity';



@Injectable({
  providedIn: 'root'
})
export class CrudService {

  protected http = inject(HttpClient);

  list() {
    return this.http.get<Crud[]>(
      `${environment.apiUrl}/crud`
    );
  }

  get(id: string) {
    return this.http.get<Crud>(
      `${environment.apiUrl}/crud/${id}`
    );
  }

  create(crud: Partial<Crud>) {
    return this.http.post<Crud>(
      `${environment.apiUrl}/crud`,
      crud
    );
  }

  update(id: string, body: Partial<Crud>) {
    return this.http.put<Crud>(
      `${environment.apiUrl}/crud/${id}`,
      body
    );
  }

  remove(id: string) {
    return this.http.delete(
      `${environment.apiUrl}/crud/${id}`
    );
  }
}