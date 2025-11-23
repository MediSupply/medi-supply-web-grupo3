import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { Product } from '../models/product';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service).toBeInstanceOf(ProductoService);
  });

  it('should have getAllProducts method', () => {
    expect(service.getAllProducts).toBeDefined();
    expect(typeof service.getAllProducts).toBe('function');
  });

  describe('getAllProducts', () => {
    it('should return an empty array', done => {
      service.getAllProducts().subscribe({
        next: products => {
          expect(products).toEqual([]);
          expect(Array.isArray(products)).toBeTrue();
          done();
        },
        error: done.fail,
      });
    });

    it('should return an Observable of Product array', () => {
      const result = service.getAllProducts();
      expect(result).toBeDefined();
      result.subscribe(products => {
        expect(products).toBeDefined();
        expect(Array.isArray(products)).toBeTrue();
      });
    });

    it('should complete the observable', done => {
      service.getAllProducts().subscribe({
        next: () => {},
        complete: () => {
          done();
        },
        error: done.fail,
      });
    });
  });
});
