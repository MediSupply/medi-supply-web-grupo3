import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProveedoresService, Proveedor } from './proveedores.service';
import { environment } from '../../environments/environment';

describe('ProveedoresService', () => {
  let service: ProveedoresService;
  let httpMock: HttpTestingController;

  const mockProveedor: Proveedor = {
    nit: 123456789,
    nombre: 'Proveedor Test S.A.',
    pais: 'colombia',
    direccion: 'Calle 123 #45-67',
    telefono: 6012345678,
    email: 'test@proveedor.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProveedoresService);
    httpMock = TestBed.inject(HttpTestingController);
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registrarProveedor', () => {
    it('debería realizar una petición POST al endpoint correcto', () => {
      const mockResponse = { success: true, message: 'Proveedor registrado' };

      service.registrarProveedor(mockProveedor).subscribe(response => {
        expect(response).toBeTruthy();
        expect(response.success).toBe(true);
        expect(response.message).toBe('Proveedor registrado');
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/provedores`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProveedor);

      req.flush(mockResponse);
    });

    it('debería incluir las cabeceras de autenticación cuando hay token', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('jwt_token', token);
      const mockResponse = { success: true };

      service.registrarProveedor(mockProveedor).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/provedores`);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');

      req.flush(mockResponse);
    });

    it('debería incluir las cabeceras correctas cuando no hay token', () => {
      localStorage.removeItem('jwt_token');
      const mockResponse = { success: true };

      service.registrarProveedor(mockProveedor).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/provedores`);
      expect(req.request.headers.get('Authorization')).toBe('Bearer null');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');

      req.flush(mockResponse);
    });

    it('debería enviar los datos del proveedor correctamente', () => {
      const mockResponse = { success: true };

      service.registrarProveedor(mockProveedor).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/provedores`);
      expect(req.request.body).toEqual(mockProveedor);
      expect(req.request.body.nit).toBe(123456789);
      expect(req.request.body.nombre).toBe('Proveedor Test S.A.');
      expect(req.request.body.pais).toBe('colombia');
      expect(req.request.body.direccion).toBe('Calle 123 #45-67');
      expect(req.request.body.telefono).toBe(6012345678);
      expect(req.request.body.email).toBe('test@proveedor.com');

      req.flush(mockResponse);
    });

    it('debería manejar errores de red correctamente', () => {
      const errorMessage = 'Error de conexión';
      const mockError = { status: 500, statusText: 'Internal Server Error' };

      service.registrarProveedor(mockProveedor).subscribe({
        next: () => fail('debería haber fallado'),
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/provedores`);
      req.flush(errorMessage, mockError);
    });

    it('debería manejar errores 400 (Bad Request) correctamente', () => {
      const mockError = {
        status: 400,
        statusText: 'Bad Request',
        error: { error: 'Ya existe un proveedor con NIT 123456789' },
      };

      service.registrarProveedor(mockProveedor).subscribe({
        next: () => fail('debería haber fallado'),
        error: error => {
          expect(error.status).toBe(400);
          expect(error.error.error).toBe(
            'Ya existe un proveedor con NIT 123456789'
          );
        },
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/provedores`);
      req.flush(mockError.error, mockError);
    });

    it('debería manejar diferentes tipos de proveedores', () => {
      const proveedorChile: Proveedor = {
        nit: 987654321,
        nombre: 'Proveedor Chile S.A.',
        pais: 'chile',
        direccion: 'Av. Principal 100',
        telefono: 56912345678,
        email: 'chile@proveedor.com',
      };
      const mockResponse = { success: true };

      service.registrarProveedor(proveedorChile).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/provedores`);
      expect(req.request.body).toEqual(proveedorChile);
      expect(req.request.body.pais).toBe('chile');

      req.flush(mockResponse);
    });
  });
});
