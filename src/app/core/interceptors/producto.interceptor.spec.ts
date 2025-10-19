import { TestBed } from '@angular/core/testing';

import { ProductoInterceptor } from './producto.interceptor';

describe('ProductoInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ProductoInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ProductoInterceptor = TestBed.inject(ProductoInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
