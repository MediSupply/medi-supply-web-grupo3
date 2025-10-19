import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Product } from '../models/product';

interface ProductsResponse {
  products: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private dataUrl = 'assets/data/products.json';
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  products = this.productsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  loadProducts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http
      .get<ProductsResponse>(this.dataUrl)
      .pipe(
        map(response => response.products),
        tap({
          next: products => {
            this.productsSignal.set(products);
            this.loadingSignal.set(false);
          },
          error: error => {
            this.errorSignal.set('Error cargando productos: ' + error.message);
            this.loadingSignal.set(false);
            this.productsSignal.set([]);
          },
        })
      )
      .subscribe();
  }

  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<ProductsResponse>(this.dataUrl)
      .pipe(map(response => response.products));
  }

  createProduct(newProduct: Omit<Product, 'id'>): void {
    const currentProducts = this.productsSignal();
    const newId =
      currentProducts.length > 0
        ? Math.max(...currentProducts.map(p => p.id)) + 1
        : 1;
    const product: Product = { id: newId, ...newProduct };
    this.productsSignal.set([...currentProducts, product]);
  }
}
