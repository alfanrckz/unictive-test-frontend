import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductsResponse } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  getProducts(limit: number = 30, skip: number = 0): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.API_URL}/products?limit=${limit}&skip=${skip}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
  }

  searchProducts(query: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.API_URL}/products/search?q=${query}`);
  }
}