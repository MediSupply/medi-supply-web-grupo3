import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5001'; // Según tu colección Postman

  constructor(private http: HttpClient) {}

  signup(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, usuario);
  }
}
