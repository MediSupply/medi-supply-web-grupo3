import { TestBed } from '@angular/core/testing';
import {
  VendedoresService,
  Vendedor,
  IndicadoresVendedor,
} from './vendedores.service';

describe('VendedoresService', () => {
  let service: VendedoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendedoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getVendedores', () => {
    it('should return list of vendedores', done => {
      service.getVendedores().subscribe(vendedores => {
        expect(vendedores).toBeDefined();
        expect(vendedores.length).toBe(4);
        expect(vendedores[0].id).toBe(1);
        expect(vendedores[0].nombre).toBe('Pedro Pablo Mercedes');
        expect(vendedores[0].activo).toBe(true);
        done();
      });
    });

    it('should return all vendedores with correct properties', done => {
      service.getVendedores().subscribe(vendedores => {
        expect(vendedores.length).toBe(4);
        vendedores.forEach(vendedor => {
          expect(vendedor.id).toBeDefined();
          expect(vendedor.nombre).toBeDefined();
          expect(vendedor.activo).toBeDefined();
          expect(typeof vendedor.id).toBe('number');
          expect(typeof vendedor.nombre).toBe('string');
          expect(typeof vendedor.activo).toBe('boolean');
        });
        done();
      });
    });

    it('should return vendedores with delay', done => {
      const startTime = Date.now();
      service.getVendedores().subscribe(() => {
        const endTime = Date.now();
        expect(endTime - startTime).toBeGreaterThanOrEqual(500);
        done();
      });
    });
  });

  describe('getIndicadoresVendedor', () => {
    it('should return indicadores for vendedor 1', done => {
      service.getIndicadoresVendedor(1).subscribe(indicadores => {
        expect(indicadores).toBeDefined();
        expect(indicadores?.ventasTotales).toBe(850000);
        expect(indicadores?.clientesAtendidos).toBe(120);
        expect(indicadores?.nuevosClientes).toBe(25);
        expect(indicadores?.montoPromedioVenta).toBe(35000);
        done();
      });
    });

    it('should return indicadores for vendedor 4', done => {
      service.getIndicadoresVendedor(4).subscribe(indicadores => {
        expect(indicadores).toBeDefined();
        expect(indicadores?.ventasTotales).toBe(1200000);
        expect(indicadores?.clientesAtendidos).toBe(180);
        expect(indicadores?.nuevosClientes).toBe(35);
        expect(indicadores?.montoPromedioVenta).toBe(42000);
        done();
      });
    });

    it('should return null for vendedor 3', done => {
      service.getIndicadoresVendedor(3).subscribe(indicadores => {
        expect(indicadores).toBeNull();
        done();
      });
    });

    it('should throw error for vendedor 2', done => {
      service.getIndicadoresVendedor(2).subscribe({
        next: () => fail('Should have thrown an error'),
        error: error => {
          expect(error.message).toBe('Error técnico al cargar los reportes');
          done();
        },
      });
    });

    it('should handle different vendedor IDs', done => {
      const testIds = [1, 2, 3, 4, 5, 999];
      let completedTests = 0;

      testIds.forEach(id => {
        service.getIndicadoresVendedor(id).subscribe({
          next: indicadores => {
            if (id === 2) {
              fail('Should have thrown an error for vendedor 2');
            } else if (id === 3) {
              expect(indicadores).toBeNull();
            } else {
              expect(indicadores).toBeDefined();
            }
            completedTests++;
            if (completedTests === testIds.length) {
              done();
            }
          },
          error: error => {
            if (id === 2) {
              expect(error.message).toBe(
                'Error técnico al cargar los reportes'
              );
            } else {
              fail(`Unexpected error for vendedor ${id}: ${error.message}`);
            }
            completedTests++;
            if (completedTests === testIds.length) {
              done();
            }
          },
        });
      });
    });

    it('should return indicadores with correct data types', done => {
      service.getIndicadoresVendedor(1).subscribe(indicadores => {
        expect(indicadores).toBeDefined();
        expect(typeof indicadores?.ventasTotales).toBe('number');
        expect(typeof indicadores?.clientesAtendidos).toBe('number');
        expect(typeof indicadores?.nuevosClientes).toBe('number');
        expect(typeof indicadores?.montoPromedioVenta).toBe('number');
        done();
      });
    });

    it('should have delay in response', done => {
      const startTime = Date.now();
      service.getIndicadoresVendedor(1).subscribe(() => {
        const endTime = Date.now();
        expect(endTime - startTime).toBeGreaterThanOrEqual(1500);
        done();
      });
    });
  });

  describe('getDatosVentasHistoricas', () => {
    it('should return ventas data for vendedor 1', done => {
      service.getDatosVentasHistoricas(1).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.length).toBe(7);
        expect(data[0]).toBe(8.5); // 850000 / 100000
        done();
      });
    });

    it('should return ventas data for vendedor 4', done => {
      service.getDatosVentasHistoricas(4).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.length).toBe(7);
        expect(data[0]).toBe(12); // 1200000 / 100000
        done();
      });
    });

    it('should return ventas data for different vendedores', done => {
      const testIds = [1, 2, 3, 4, 5, 999];
      let completedTests = 0;

      testIds.forEach(id => {
        service.getDatosVentasHistoricas(id).subscribe(data => {
          expect(data).toBeDefined();
          expect(data.length).toBe(7);
          expect(Array.isArray(data)).toBe(true);
          data.forEach(value => {
            expect(typeof value).toBe('number');
            expect(value).toBeGreaterThanOrEqual(0);
          });
          completedTests++;
          if (completedTests === testIds.length) {
            done();
          }
        });
      });
    });

    it('should return data with correct structure', done => {
      service.getDatosVentasHistoricas(1).subscribe(data => {
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(7);
        data.forEach((value, index) => {
          expect(typeof value).toBe('number');
          expect(value).toBeGreaterThan(0);
        });
        done();
      });
    });

    it('should have delay in response', done => {
      const startTime = Date.now();
      service.getDatosVentasHistoricas(1).subscribe(() => {
        const endTime = Date.now();
        expect(endTime - startTime).toBeGreaterThanOrEqual(100);
        done();
      });
    });
  });

  describe('getDatosClientes', () => {
    it('should return clientes data for vendedor 1', done => {
      service.getDatosClientes(1).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.clientesAtendidos).toBeDefined();
        expect(data.nuevosClientes).toBeDefined();
        expect(data.clientesAtendidos.length).toBe(7);
        expect(data.nuevosClientes.length).toBe(7);
        done();
      });
    });

    it('should return clientes data for different vendedores', done => {
      const testIds = [1, 2, 3, 4, 5, 999];
      let completedTests = 0;

      testIds.forEach(id => {
        service.getDatosClientes(id).subscribe(data => {
          expect(data).toBeDefined();
          expect(data.clientesAtendidos).toBeDefined();
          expect(data.nuevosClientes).toBeDefined();
          expect(Array.isArray(data.clientesAtendidos)).toBe(true);
          expect(Array.isArray(data.nuevosClientes)).toBe(true);
          expect(data.clientesAtendidos.length).toBe(7);
          expect(data.nuevosClientes.length).toBe(7);
          completedTests++;
          if (completedTests === testIds.length) {
            done();
          }
        });
      });
    });

    it('should return data with correct structure', done => {
      service.getDatosClientes(1).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.clientesAtendidos).toBeDefined();
        expect(data.nuevosClientes).toBeDefined();
        expect(Array.isArray(data.clientesAtendidos)).toBe(true);
        expect(Array.isArray(data.nuevosClientes)).toBe(true);
        expect(data.clientesAtendidos.length).toBe(7);
        expect(data.nuevosClientes.length).toBe(7);
        data.clientesAtendidos.forEach(value => {
          expect(typeof value).toBe('number');
          expect(value).toBeGreaterThanOrEqual(0);
        });
        data.nuevosClientes.forEach(value => {
          expect(typeof value).toBe('number');
          expect(value).toBeGreaterThanOrEqual(0);
        });
        done();
      });
    });

    it('should have delay in response', done => {
      const startTime = Date.now();
      service.getDatosClientes(1).subscribe(() => {
        const endTime = Date.now();
        expect(endTime - startTime).toBeGreaterThanOrEqual(100);
        done();
      });
    });
  });

  describe('getDatosDistribucion', () => {
    it('should return distribucion data for vendedor 1', done => {
      service.getDatosDistribucion(1).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.labels).toBeDefined();
        expect(data.data).toBeDefined();
        expect(data.labels.length).toBe(4);
        expect(data.data.length).toBe(4);
        expect(data.labels[0]).toBe('Ventas Totales');
        done();
      });
    });

    it('should return null data for vendedor 3', done => {
      service.getDatosDistribucion(3).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.labels[0]).toBe('Sin datos');
        expect(data.data[0]).toBe(0);
        done();
      });
    });

    it('should return distribucion data for different vendedores', done => {
      const testIds = [1, 2, 3, 4, 5, 999];
      let completedTests = 0;

      testIds.forEach(id => {
        service.getDatosDistribucion(id).subscribe(data => {
          expect(data).toBeDefined();
          expect(data.labels).toBeDefined();
          expect(data.data).toBeDefined();
          expect(Array.isArray(data.labels)).toBe(true);
          expect(Array.isArray(data.data)).toBe(true);
          expect(data.labels.length).toBe(4);
          expect(data.data.length).toBe(4);
          completedTests++;
          if (completedTests === testIds.length) {
            done();
          }
        });
      });
    });

    it('should return data with correct structure', done => {
      service.getDatosDistribucion(1).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.labels).toBeDefined();
        expect(data.data).toBeDefined();
        expect(Array.isArray(data.labels)).toBe(true);
        expect(Array.isArray(data.data)).toBe(true);
        expect(data.labels.length).toBe(4);
        expect(data.data.length).toBe(4);
        data.labels.forEach(label => {
          expect(typeof label).toBe('string');
          expect(label.length).toBeGreaterThan(0);
        });
        data.data.forEach(value => {
          expect(typeof value).toBe('number');
          expect(value).toBeGreaterThanOrEqual(0);
        });
        done();
      });
    });

    it('should have delay in response', done => {
      const startTime = Date.now();
      service.getDatosDistribucion(1).subscribe(() => {
        const endTime = Date.now();
        expect(endTime - startTime).toBeGreaterThanOrEqual(100);
        done();
      });
    });

    it('should handle edge cases', done => {
      const edgeCases = [0, -1, 999999];
      let completedTests = 0;

      edgeCases.forEach(id => {
        service.getDatosDistribucion(id).subscribe(data => {
          expect(data).toBeDefined();
          expect(data.labels).toBeDefined();
          expect(data.data).toBeDefined();
          completedTests++;
          if (completedTests === edgeCases.length) {
            done();
          }
        });
      });
    });
  });

  describe('Service initialization', () => {
    it('should be injectable', () => {
      expect(service).toBeDefined();
      expect(service instanceof VendedoresService).toBe(true);
    });

    it('should have all required methods', () => {
      expect(typeof service.getVendedores).toBe('function');
      expect(typeof service.getIndicadoresVendedor).toBe('function');
      expect(typeof service.getDatosVentasHistoricas).toBe('function');
      expect(typeof service.getDatosClientes).toBe('function');
      expect(typeof service.getDatosDistribucion).toBe('function');
    });
  });
});
