import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5001'; // Según tu colección Postman

  constructor(private http: HttpClient) {}

  signup(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, usuario);
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.baseUrl}/auth/login`, body).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
          console.log('Token guardado en localStorage:', response.token);
        }
      })
    );
  }

  // 🧭 Verificación de token
  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  // 🚪 Cerrar sesión
  logout(): void {
    localStorage.removeItem('jwt_token');
  }
}
