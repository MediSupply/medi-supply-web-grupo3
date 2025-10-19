import { TestBed } from '@angular/core/testing';

import { ProductoService } from './producto.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductoService', () => {
  let service: ProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
