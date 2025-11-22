import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Product } from '../modules/producto/models/product';
import { environment } from '../../environments/environment';

interface ProductsResponse {
  products: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  private dataUrl = environment.baseUrl;
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  products = this.productsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getAllProducts(): Observable<any>  {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http
      .get<ProductsResponse>(`${this.dataUrl}/productos`, {headers})
      .pipe(
        tap(response => {
          this.productsSignal.set(response.products);
          this.loadingSignal.set(false); 
        }),
        catchError(error => {
          this.errorSignal.set('Error cargando productos: ' + error.message);
          this.loadingSignal.set(false);
          this.productsSignal.set([]);
          return throwError(() => error);
        })
      )
  }

  createProduct(newProduct: Omit<Product, 'id'>): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http
      .post(`${this.dataUrl}/productos`, newProduct, {headers}, )
      .pipe(
        tap(response => {
          this.loadingSignal.set(false); 
        }),
        catchError(error => {
          this.errorSignal.set('Error cargando productos: ' + error.message);
          this.loadingSignal.set(false);
          this.productsSignal.set([]);
          return throwError(() => error);
        })
      )
  }
}
