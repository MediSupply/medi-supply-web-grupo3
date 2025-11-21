import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Proveedor {
  nit: number;
  nombre: string;
  pais: string;
  direccion: string;
  telefono: number;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las cabeceras HTTP con el token de autenticación
   * @returns HttpHeaders con el token JWT
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Registra un nuevo proveedor
   * @param proveedor Datos del proveedor a registrar
   * @returns Observable<any>
   */
  registrarProveedor(proveedor: Proveedor): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/provedores`, proveedor, { headers });
  }
}
