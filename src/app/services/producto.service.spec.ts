import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProductoService } from './producto.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Product } from '../modules/producto/models/product';

interface ProductsResponse {
  products: Product[];
}

describe('ProductoService', () => {
  let httpMock: HttpTestingController;
  let service: ProductoService;

  const mockProducts: Product[] = [
    {
      id: 2,
      nombre: 'Ibuprofeno 400mg',
      descripcion:
        'Antiinflamatorio no esteroideo para dolor, inflamación y fiebre',
      valor_unitario: 12000,
      cantidad_disponible: 85,
      categoria: '2',
      condiciones_almacenamiento: 'Proteger de la luz. Mantener en envase original',
      fecha_vencimiento: '2026-03-20',
      lote: 'LOT-IB202401',
      id_proveedor: '2',
      tiempo_estimado_entrega: '48-72 horas',
    },
    {
      id: 3,
      nombre: 'Amoxicilina 500mg',
      descripcion:
        'Antibiótico de amplio espectro para infecciones bacterianas',
      valor_unitario: 18500,
      cantidad_disponible: 60,
      categoria: '3',
      condiciones_almacenamiento: 'Refrigerar entre 2°C y 8°C después de reconstituir',
      fecha_vencimiento: '2024-11-30',
      lote: 'LOT-AM202402',
      id_proveedor: '3',
      tiempo_estimado_entrega: '72 horas',
    },
  ];
  const newProduct: Omit<Product, 'id'> = {
    nombre: 'Ibuprofeno 400mg',
    descripcion:
      'Antiinflamatorio no esteroideo para dolor, inflamación y fiebre',
    valor_unitario: 12000,
    cantidad_disponible: 85,
    categoria: '2',
    condiciones_almacenamiento: 'Proteger de la luz. Mantener en envase original',
    fecha_vencimiento: '2026-03-20',
    lote: 'LOT-IB202401',
    id_proveedor: '2',
    tiempo_estimado_entrega: '48-72 horas',
  };
  const mockCreatedProduct: Product = {
    id: 4,
    ...newProduct
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería manejar la carga exitosa de productos', (done) => {
    const mockResponse: ProductsResponse = {
      products: mockProducts,
    };

    service.getAllProducts().subscribe({
      next: (result) => {
        expect(service.products()).toEqual(mockProducts);
        expect(service.loading()).toBeFalse();
        expect(service.error()).toBeNull();
        done();
      },
      error: done.fail
    });

    expect(service.loading()).toBeFalse();

    const req = httpMock.expectOne('http://localhost:5001/productos');
    expect(req.request.method).toBe('GET');
    
    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    
    req.flush(mockResponse);
  });

  it('debería realizar una petición GET a http://localhost:5001/productos', () => {
    const mockResponse: ProductsResponse = {
      products: mockProducts,
    };

    service.getAllProducts().subscribe(products => {
      expect(products).toBeTruthy();
      expect(products).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5001/productos');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

   it('debería crear un nuevo producto exitosamente', (done) => {
    service.createProduct(newProduct).subscribe({
      next: (response) => {
        expect(service.loading()).toBeFalse();
        expect(service.error()).toBeNull();
        done();
      },
      error: done.fail
    });

    const req = httpMock.expectOne('http://localhost:5001/productos/crear');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    
    req.flush(mockCreatedProduct);
  });

  it('debería manejar errores al cargar productos', (done) => {
    service.getAllProducts().subscribe({
      next: () => {
        done.fail('No debería tener éxito cuando hay error');
      },
      error: (error) => {
        expect(service.loading()).toBeFalse();
        expect(service.error()).toContain('Error cargando productos');
        expect(service.products()).toEqual([]);
        done();
      }
    });

    expect(service.loading()).toBeFalse();

    const req = httpMock.expectOne('http://localhost:5001/productos');
    expect(req.request.method).toBe('GET');
    
    req.flush('Error del servidor', { 
      status: 500, 
      statusText: 'Internal Server Error' 
    });
  });

  it('debería manejar errores al crear producto', (done) => {
    service.createProduct(newProduct).subscribe({
      next: () => {
        done.fail('No debería tener éxito cuando hay error');
      },
      error: (error) => {
        expect(service.loading()).toBeFalse();
        expect(service.error()).toContain('Error cargando productos');
        done();
      }
    });

    const req = httpMock.expectOne('http://localhost:5001/productos/crear');
    expect(req.request.method).toBe('POST');
    
    // Simular error
    req.flush('Error del servidor', { 
      status: 400, 
      statusText: 'Bad Request' 
    });
  });
});
