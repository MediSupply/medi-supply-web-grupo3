import { TestBed } from '@angular/core/testing';

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
      name: 'Ibuprofeno 400mg',
      description:
        'Antiinflamatorio no esteroideo para dolor, inflamación y fiebre',
      price: 12000,
      amount: 85,
      category: '2',
      conditions: 'Proteger de la luz. Mantener en envase original',
      expirationDate: '2026-03-20',
      batch: 'LOT-IB202401',
      provider: '2',
      deliveryTime: '48-72 horas',
    },
    {
      id: 3,
      name: 'Amoxicilina 500mg',
      description:
        'Antibiótico de amplio espectro para infecciones bacterianas',
      price: 18500,
      amount: 60,
      category: '3',
      conditions: 'Refrigerar entre 2°C y 8°C después de reconstituir',
      expirationDate: '2024-11-30',
      batch: 'LOT-AM202402',
      provider: '3',
      deliveryTime: '72 horas',
    },
  ];

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

  it('debería manejar errores al cargar productos', () => {
    const mockResponse: ProductsResponse = {
      products: mockProducts,
    };

    service.loadProducts();

    expect(service.loading()).toBeTrue();

    const req = httpMock.expectOne('assets/data/products.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.products()).toEqual(mockProducts);
    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
  });

  it('debería realizar una petición GET a /assets/data/products.json', () => {
    const mockResponse: ProductsResponse = {
      products: mockProducts,
    };

    service.getAllProducts().subscribe(products => {
      expect(products).toBeTruthy();
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('assets/data/products.json');
    expect(req.request.method).toBe('GET');

    // Simula la respuesta del servidor
    req.flush(mockResponse);
  });

  it('debería crear un nuevo producto con ID autoincremental', () => {
    const newProductData: Omit<Product, 'id'> = {
      name: 'Ibuprofeno 400mg',
      description:
        'Antiinflamatorio no esteroideo para dolor, inflamación y fiebre',
      price: 12000,
      amount: 85,
      category: '2',
      conditions: 'Proteger de la luz. Mantener en envase original',
      expirationDate: '2026-03-20',
      batch: 'LOT-IB202401',
      provider: '2',
      deliveryTime: '48-72 horas',
    };

    // Establecer productos existentes
    service['productsSignal'].set(mockProducts);

    service.createProduct(newProductData);

    const expectedProduct: Product = {
      id: 4, // Math.max(1, 3) + 1 = 4
      ...newProductData,
    };

    expect(service.products()).toContain(expectedProduct);
    expect(service.products().length).toBe(3);
  });
});
