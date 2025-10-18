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
});
