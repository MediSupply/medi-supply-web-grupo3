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

  private productos_cargados: Product[] = [
    {
      "id": 1,
      "nombre": "Acetaminofén 500mg",
      "descripcion": "Analgésico y antipirético para el alivio del dolor leve a moderado y fiebre",
      "valor_unitario": 8500,
      "cantidad_disponible": 150,
      "categoria": "1",
      "condiciones_almacenamiento": "Almacenar en lugar fresco y seco. Temperatura menor a 30°C",
      "fecha_vencimiento": "2025-12-15",
      "lote": "LOT-AC202312",
      "id_proveedor": "1",
      "tiempo_estimado_entrega": "24-48 horas",
      "ubicacion":"Bodega 1"
    },
  ]

  private dataUrl = environment.baseUrl;
  productsSignal = signal<Product[]>([]);
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
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http
      .get(`${this.dataUrl}/productos`, {headers})
      .pipe(
        tap(response => {
          console.log(response)
          const productsToUse = this.productos_cargados;
          this.productsSignal.set(productsToUse);
          this.loadingSignal.set(false); 
          console.log(productsToUse)
          return productsToUse
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
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http
      .post(`${this.dataUrl}/productos/crear`, newProduct, {headers}, )
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
