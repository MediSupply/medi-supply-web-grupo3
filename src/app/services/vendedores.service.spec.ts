import { TestBed } from '@angular/core/testing';
import { VendedoresService, Vendedor, IndicadoresVendedor } from './vendedores.service';

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
    it('should return list of vendedores', (done) => {
      service.getVendedores().subscribe(vendedores => {
        expect(vendedores).toBeDefined();
        expect(vendedores.length).toBe(4);
        expect(vendedores[0].id).toBe(1);
        expect(vendedores[0].nombre).toBe('Pedro Pablo Mercedes');
        expect(vendedores[0].activo).toBe(true);
        done();
      });
    });
  });

  describe('getIndicadoresVendedor', () => {
    it('should return indicadores for vendedor 1', (done) => {
      service.getIndicadoresVendedor(1).subscribe(indicadores => {
        expect(indicadores).toBeDefined();
        expect(indicadores?.ventasTotales).toBe(850000);
        expect(indicadores?.clientesAtendidos).toBe(120);
        expect(indicadores?.nuevosClientes).toBe(25);
        expect(indicadores?.montoPromedioVenta).toBe(35000);
        done();
      });
    });

    it('should return indicadores for vendedor 4', (done) => {
      service.getIndicadoresVendedor(4).subscribe(indicadores => {
        expect(indicadores).toBeDefined();
        expect(indicadores?.ventasTotales).toBe(1200000);
        expect(indicadores?.clientesAtendidos).toBe(180);
        expect(indicadores?.nuevosClientes).toBe(35);
        expect(indicadores?.montoPromedioVenta).toBe(42000);
        done();
      });
    });

    it('should return null for vendedor 3', (done) => {
      service.getIndicadoresVendedor(3).subscribe(indicadores => {
        expect(indicadores).toBeNull();
        done();
      });
    });

    it('should throw error for vendedor 2', (done) => {
      service.getIndicadoresVendedor(2).subscribe({
        next: () => fail('Should have thrown an error'),
        error: (error) => {
          expect(error.message).toBe('Error técnico al cargar los reportes');
          done();
        }
      });
    });
  });

  describe('getDatosVentasHistoricas', () => {
    it('should return ventas data for vendedor 1', (done) => {
      service.getDatosVentasHistoricas(1).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.length).toBe(7);
        expect(data[0]).toBe(8.5); // 850000 / 100000
        done();
      });
    });

    it('should return ventas data for vendedor 4', (done) => {
      service.getDatosVentasHistoricas(4).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.length).toBe(7);
        expect(data[0]).toBe(12); // 1200000 / 100000
        done();
      });
    });
  });

  describe('getDatosClientes', () => {
    it('should return clientes data for vendedor 1', (done) => {
      service.getDatosClientes(1).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.clientesAtendidos).toBeDefined();
        expect(data.nuevosClientes).toBeDefined();
        expect(data.clientesAtendidos.length).toBe(7);
        expect(data.nuevosClientes.length).toBe(7);
        done();
      });
    });
  });

  describe('getDatosDistribucion', () => {
    it('should return distribucion data for vendedor 1', (done) => {
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

    it('should return null data for vendedor 3', (done) => {
      service.getDatosDistribucion(3).subscribe(data => {
        expect(data).toBeDefined();
        expect(data.labels[0]).toBe('Sin datos');
        expect(data.data[0]).toBe(0);
        done();
      });
    });
  });
});
