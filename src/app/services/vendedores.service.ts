import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Vendedor {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface IndicadoresVendedor {
  ventasTotales: number;
  clientesAtendidos: number;
  nuevosClientes: number;
  montoPromedioVenta: number;
}

@Injectable({
  providedIn: 'root',
})
export class VendedoresService {
  constructor() {}

  /**
   * Obtiene la lista de vendedores activos
   * @returns Observable<Vendedor[]>
   */
  getVendedores(): Observable<Vendedor[]> {
    // Simular delay de red
    return of([
      { id: 1, nombre: 'Pedro Pablo Mercedes', activo: true },
      { id: 2, nombre: 'Juan Jose Torres', activo: true },
      { id: 3, nombre: 'María González', activo: true },
      { id: 4, nombre: 'Carlos Rodríguez', activo: true },
    ]).pipe(delay(500));
  }

  getVendedoresConMetricas(): Observable<{
    vendedores: Vendedor[];
    metricas: any;
  }> {
    // Simular una consulta que trae vendedores y todas sus métricas de una vez
    const vendedores = [
      { id: 1, nombre: 'Pedro Pablo Mercedes', activo: true },
      { id: 2, nombre: 'Juan Jose Torres', activo: true },
      { id: 3, nombre: 'María González', activo: true },
      { id: 4, nombre: 'Carlos Rodríguez', activo: true },
    ];

    const metricas = {
      1: {
        indicadores: {
          ventasTotales: 850000,
          clientesAtendidos: 120,
          nuevosClientes: 25,
          montoPromedioVenta: 35000,
        },
        ventasHistoricas: [1.2, 1.5, 1.8, 2.1, 1.9, 2.3, 2.0],
        datosClientes: {
          clientesAtendidos: [120, 125, 130, 135, 140, 145, 150],
          nuevosClientes: [25, 30, 28, 32, 35, 38, 40],
        },
        distribucion: {
          labels: [
            'Ventas Totales',
            'Monto Promedio x Venta',
            'Clientes Atendidos',
            'Nuevos Clientes',
          ],
          data: [850, 35, 120, 25],
        },
      },
      2: {
        indicadores: null, // Simular error técnico
        ventasHistoricas: [],
        datosClientes: { clientesAtendidos: [], nuevosClientes: [] },
        distribucion: { labels: [], data: [] },
      },
      3: {
        indicadores: null, // Simular sin datos
        ventasHistoricas: [],
        datosClientes: { clientesAtendidos: [], nuevosClientes: [] },
        distribucion: { labels: [], data: [] },
      },
      4: {
        indicadores: {
          ventasTotales: 1200000,
          clientesAtendidos: 180,
          nuevosClientes: 45,
          montoPromedioVenta: 42000,
        },
        ventasHistoricas: [1.8, 2.2, 2.5, 2.8, 3.1, 3.4, 3.7],
        datosClientes: {
          clientesAtendidos: [180, 185, 190, 195, 200, 205, 210],
          nuevosClientes: [45, 50, 48, 52, 55, 58, 60],
        },
        distribucion: {
          labels: [
            'Ventas Totales',
            'Monto Promedio x Venta',
            'Clientes Atendidos',
            'Nuevos Clientes',
          ],
          data: [1200, 42, 180, 45],
        },
      },
    };

    return of({
      vendedores: vendedores,
      metricas: metricas,
    }).pipe(delay(1000));
  }

  /**
   * Obtiene los indicadores de desempeño de un vendedor específico
   * @param vendedorId ID del vendedor
   * @returns Observable<IndicadoresVendedor | null>
   */
  getIndicadoresVendedor(
    vendedorId: number
  ): Observable<IndicadoresVendedor | null> {
    // Simular delay de red
    return new Observable(observer => {
      setTimeout(() => {
        try {
          // Simular diferentes escenarios según el vendedor
          switch (vendedorId) {
            case 1:
              // Pedro Pablo Mercedes - Datos normales
              observer.next({
                ventasTotales: 850000,
                clientesAtendidos: 120,
                nuevosClientes: 25,
                montoPromedioVenta: 35000,
              });
              break;

            case 2:
              // Juan Jose Torres - Error técnico
              observer.error(new Error('Error técnico al cargar los reportes'));
              break;

            case 3:
              // María González - Sin datos
              observer.next(null);
              break;

            case 4:
              // Carlos Rodríguez - Datos normales
              observer.next({
                ventasTotales: 1200000,
                clientesAtendidos: 180,
                nuevosClientes: 35,
                montoPromedioVenta: 42000,
              });
              break;

            default:
              observer.next(null);
          }
        } catch (error) {
          observer.error(error);
        }
        observer.complete();
      }, 1500); // Simular delay de 1.5 segundos
    });
  }

  /**
   * Obtiene datos históricos de ventas para gráficas
   * @param vendedorId ID del vendedor
   * @returns Observable<number[]>
   */
  getDatosVentasHistoricas(vendedorId: number): Observable<number[]> {
    const ventasTotales = this.getVentasTotalesPorVendedor(vendedorId);

    return of([
      ventasTotales / 100000,
      ventasTotales / 120000,
      ventasTotales / 80000,
      ventasTotales / 150000,
      ventasTotales / 90000,
      ventasTotales / 110000,
      ventasTotales / 130000,
    ]).pipe(delay(300));
  }

  /**
   * Obtiene datos de clientes para gráficas
   * @param vendedorId ID del vendedor
   * @returns Observable<{clientesAtendidos: number[], nuevosClientes: number[]}>
   */
  getDatosClientes(
    vendedorId: number
  ): Observable<{ clientesAtendidos: number[]; nuevosClientes: number[] }> {
    const clientesAtendidos = this.getClientesAtendidosPorVendedor(vendedorId);
    const nuevosClientes = this.getNuevosClientesPorVendedor(vendedorId);

    const clientesData = [
      clientesAtendidos,
      clientesAtendidos + 5,
      clientesAtendidos - 3,
      clientesAtendidos + 8,
      clientesAtendidos - 2,
      clientesAtendidos + 4,
      clientesAtendidos + 6,
    ];

    const nuevosData = [
      nuevosClientes,
      nuevosClientes + 2,
      nuevosClientes - 1,
      nuevosClientes + 3,
      nuevosClientes - 1,
      nuevosClientes + 2,
      nuevosClientes + 1,
    ];

    return of({
      clientesAtendidos: clientesData,
      nuevosClientes: nuevosData,
    }).pipe(delay(300));
  }

  /**
   * Obtiene datos para gráfica circular (pie chart)
   * @param vendedorId ID del vendedor
   * @returns Observable<{labels: string[], data: number[]}>
   */
  getDatosDistribucion(
    vendedorId: number
  ): Observable<{ labels: string[]; data: number[] }> {
    const indicadores = this.getIndicadoresPorVendedor(vendedorId);

    if (!indicadores) {
      return of({
        labels: ['Sin datos', 'Sin datos', 'Sin datos', 'Sin datos'],
        data: [0, 0, 0, 0],
      }).pipe(delay(300));
    }

    return of({
      labels: [
        'Ventas Totales',
        'Monto Promedio x Venta',
        'Clientes Atendidos',
        'Nuevos Clientes',
      ],
      data: [
        indicadores.ventasTotales / 1000, // Escalar para visualización
        indicadores.montoPromedioVenta / 100,
        indicadores.clientesAtendidos * 10,
        indicadores.nuevosClientes * 20,
      ],
    }).pipe(delay(300));
  }

  // Métodos privados para obtener datos base por vendedor
  private getVentasTotalesPorVendedor(vendedorId: number): number {
    switch (vendedorId) {
      case 1:
        return 850000;
      case 4:
        return 1200000;
      default:
        return 0;
    }
  }

  private getClientesAtendidosPorVendedor(vendedorId: number): number {
    switch (vendedorId) {
      case 1:
        return 120;
      case 4:
        return 180;
      default:
        return 0;
    }
  }

  private getNuevosClientesPorVendedor(vendedorId: number): number {
    switch (vendedorId) {
      case 1:
        return 25;
      case 4:
        return 35;
      default:
        return 0;
    }
  }

  private getIndicadoresPorVendedor(
    vendedorId: number
  ): IndicadoresVendedor | null {
    switch (vendedorId) {
      case 1:
        return {
          ventasTotales: 850000,
          clientesAtendidos: 120,
          nuevosClientes: 25,
          montoPromedioVenta: 35000,
        };
      case 4:
        return {
          ventasTotales: 1200000,
          clientesAtendidos: 180,
          nuevosClientes: 35,
          montoPromedioVenta: 42000,
        };
      default:
        return null;
    }
  }
}
