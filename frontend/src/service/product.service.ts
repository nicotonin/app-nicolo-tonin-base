
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Product } from './product.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  protected http = inject(HttpClient);

  list() {
    return this.http.get<Product[]>(
      `${environment.apiUrl}/product`
    );
  }

  get(id: string) {
    return this.http.get<Product>(
      `${environment.apiUrl}/product/${id}`
    );
  }

  create(data: Partial<Product>) {
    return this.http.post<Product>(
      `${environment.apiUrl}/product`,
      data
    );
  }

  update(id: string, body: Partial<Product>) {
    return this.http.put<Product>(
      `${environment.apiUrl}/product/${id}`,
      body
    );
  }

  remove(id: string) {
    return this.http.delete(
      `${environment.apiUrl}/product/${id}`
    );
  }
}
