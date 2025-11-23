import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    // TODO: Implementar llamada real al API
    // Por ahora retorna un array vacío para evitar errores
    return of([]);
  }
}

