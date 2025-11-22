import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http
      .get(`${this.dataUrl}/productos`, {headers})
      .pipe(
        tap({
          next: products => {
            //this.productsSignal.set(products);
            this.loadingSignal.set(false);
          },
          error: error => {
            this.errorSignal.set('Error cargando productos: ' + error.message);
            this.loadingSignal.set(false);
            this.productsSignal.set([]);
          },
        })
      )
  }

  createProduct(newProduct: Omit<Product, 'id'>): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log(newProduct)
    return this.http
      .post(`${this.dataUrl}/productos/crear`, newProduct, {headers: headers}, )
      .pipe(
        tap({
          next: products => {
            //this.productsSignal.set(products);
            this.loadingSignal.set(false);
          },
          error: error => {
            this.errorSignal.set('Error cargando productos: ' + error.message);
            this.loadingSignal.set(false);
            this.productsSignal.set([]);
          },
        })
      )
  }
}
