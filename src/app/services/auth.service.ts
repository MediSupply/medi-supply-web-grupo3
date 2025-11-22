import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  signup(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, usuario).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('isAdmin', String(response?.isAdmin ?? false));
        }
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.baseUrl}/auth/login`, body).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('isAdmin', String(response?.isAdmin ?? false));
        }
      })
    );
  }

  // 🧭 Verificación de token
  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  // 🔐 Verificar si el usuario es admin
  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  // 🚪 Cerrar sesión
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('isAdmin');
    this.router.navigate(['/login']);
  }
}
