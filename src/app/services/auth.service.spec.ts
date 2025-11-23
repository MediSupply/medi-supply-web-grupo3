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
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
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

  it('debería guardar token e isAdmin en localStorage cuando signup retorna token', () => {
    const token = 'abc123token';
    const isAdmin = true;
    localStorage.clear();

    service.signup(mockUser).subscribe();

    const req = httpMock.expectOne('http://localhost:5001/auth/signup');
    req.flush({ token, isAdmin });

    expect(localStorage.getItem('jwt_token')).toBe(token);
    expect(localStorage.getItem('isAdmin')).toBe('true');
  });

  it('debería no guardar token cuando signup no retorna token', () => {
    localStorage.clear();

    service.signup(mockUser).subscribe();

    const req = httpMock.expectOne('http://localhost:5001/auth/signup');
    req.flush({ message: 'Usuario creado correctamente' });

    expect(localStorage.getItem('jwt_token')).toBeNull();
  });

  it('debería usar false como valor por defecto cuando isAdmin es undefined en signup', () => {
    const token = 'abc123token';
    localStorage.clear();

    service.signup(mockUser).subscribe();

    const req = httpMock.expectOne('http://localhost:5001/auth/signup');
    req.flush({ token });

    expect(localStorage.getItem('jwt_token')).toBe(token);
    expect(localStorage.getItem('isAdmin')).toBe('false');
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

  it('debería guardar token e isAdmin en localStorage cuando login retorna token', () => {
    const token = 'abc123token';
    const isAdmin = false;
    localStorage.clear();

    service.login(mockLogin.email, mockLogin.password).subscribe();

    const req = httpMock.expectOne('http://localhost:5001/auth/login');
    req.flush({ token, isAdmin });

    expect(localStorage.getItem('jwt_token')).toBe(token);
    expect(localStorage.getItem('isAdmin')).toBe('false');
  });

  it('debería no guardar token cuando login no retorna token', () => {
    localStorage.clear();

    service.login(mockLogin.email, mockLogin.password).subscribe();

    const req = httpMock.expectOne('http://localhost:5001/auth/login');
    req.flush({ message: 'Credenciales inválidas' });

    expect(localStorage.getItem('jwt_token')).toBeNull();
  });

  it('debería usar false como valor por defecto cuando isAdmin es undefined en login', () => {
    const token = 'abc123token';
    localStorage.clear();

    service.login(mockLogin.email, mockLogin.password).subscribe();

    const req = httpMock.expectOne('http://localhost:5001/auth/login');
    req.flush({ token });

    expect(localStorage.getItem('jwt_token')).toBe(token);
    expect(localStorage.getItem('isAdmin')).toBe('false');
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

  // 🔹 Prueba de isAdmin()
  it('debería retornar true si isAdmin es "true" en localStorage', () => {
    localStorage.setItem('isAdmin', 'true');
    expect(service.isAdmin()).toBeTrue();
  });

  it('debería retornar false si isAdmin no es "true" en localStorage', () => {
    localStorage.setItem('isAdmin', 'false');
    expect(service.isAdmin()).toBeFalse();
  });

  // 🔹 Prueba de logout()
  it('debería eliminar el token del localStorage al cerrar sesión', () => {
    localStorage.setItem('jwt_token', 'fake-token');
    service.logout();
    expect(localStorage.getItem('jwt_token')).toBeNull();
  });
});
