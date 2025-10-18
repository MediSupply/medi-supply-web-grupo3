import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser = {
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    password: 'password123',
    role: 'USER',
  };

  const mockLogin = {
    email: 'juan@ejemplo.com',
    password: 'password123',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería realizar una petición POST a /auth/signup', () => {
    service.signup(mockUser).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.message).toBe('Usuario creado correctamente');
    });

    const req = httpMock.expectOne('http://localhost:5001/auth/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);

    // Simula la respuesta del servidor
    req.flush({ message: 'Usuario creado correctamente' });
  });

  it('debería realizar una petición POST a /auth/login', () => {
    const token = 'abc123token';
    service.login(mockLogin.email, mockLogin.password).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.token).toBe(token);
    });

    const req = httpMock.expectOne('http://localhost:5001/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLogin);

    // Simula la respuesta del servidor
    req.flush({ token });
  });

  // 🔹 Prueba de isAuthenticated()
  it('debería retornar true si existe un token en localStorage', () => {
    localStorage.setItem('jwt_token', 'fake-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('debería retornar false si NO existe token en localStorage', () => {
    localStorage.removeItem('jwt_token');
    expect(service.isAuthenticated()).toBeFalse();
  });

  // 🔹 Prueba de logout()
  it('debería eliminar el token del localStorage al cerrar sesión', () => {
    localStorage.setItem('jwt_token', 'fake-token');
    service.logout();
    expect(localStorage.getItem('jwt_token')).toBeNull();
  });
});
