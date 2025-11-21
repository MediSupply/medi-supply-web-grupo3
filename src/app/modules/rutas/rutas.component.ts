import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface Pedido {
  id: string;
  cliente: string;
  direccionEntrega: string;
  observaciones: string;
  estado: string;
  seleccionado: boolean;
  latitud?: number;
  longitud?: number;
}

export interface RutaGenerada {
  pedidos: Pedido[];
  distanciaTotal: number;
  tiempoEstimado: number;
}

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './rutas.component.html',
  styleUrl: './rutas.component.scss',
})
export class RutasComponent implements OnInit {
  constructor(private snackBar: MatSnackBar) {}
  displayedColumns: string[] = [
    'seleccionIdPedido',
    'cliente',
    'direccionEntrega',
    'observaciones',
    'estado',
  ];

  pedidos: Pedido[] = [
    {
      id: '001',
      cliente: 'Cliente 1',
      direccionEntrega: 'Cra 34 # 14-44',
      observaciones: 'Cadena de frío',
      estado: 'Pendiente',
      seleccionado: true,
    },
    {
      id: '002',
      cliente: 'Cliente 2',
      direccionEntrega: 'Cra 9 # 6-22',
      observaciones: 'Cadena de frío',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '003',
      cliente: 'Cliente 3',
      direccionEntrega: 'Cra 19 # 4d-44',
      observaciones: 'No aplica',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '004',
      cliente: 'Cliente 4',
      direccionEntrega: 'Calle 14 # 34-2',
      observaciones: 'Entrega prioritaria',
      estado: 'Pendiente',
      seleccionado: true,
    },
    {
      id: '005',
      cliente: 'Cliente 5',
      direccionEntrega: 'Calle 14 # 35-2',
      observaciones: 'Entrega prioritaria',
      estado: 'Pendiente',
      seleccionado: true,
    },
    {
      id: '006',
      cliente: 'Cliente 6',
      direccionEntrega: 'Cra 19 # 6-22',
      observaciones: 'Cadena de frío',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '007',
      cliente: 'Cliente 7',
      direccionEntrega: 'Cra 9 # 16-22',
      observaciones: 'No aplica',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '008',
      cliente: 'Cliente 8',
      direccionEntrega: 'Cra 29 # 6-22',
      observaciones: 'No aplica',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '009',
      cliente: 'Cliente 9',
      direccionEntrega: 'Cra 15 # 25-30',
      observaciones: 'Cadena de frío',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '010',
      cliente: 'Cliente 10',
      direccionEntrega: 'Calle 50 # 10-15',
      observaciones: 'Entrega prioritaria',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '011',
      cliente: 'Cliente 11',
      direccionEntrega: 'Cra 7 # 32-18',
      observaciones: 'No aplica',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '012',
      cliente: 'Cliente 12',
      direccionEntrega: 'Calle 72 # 5-20',
      observaciones: 'Cadena de frío',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '013',
      cliente: 'Cliente 13',
      direccionEntrega: 'Cra 30 # 45-12',
      observaciones: 'Entrega prioritaria',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '014',
      cliente: 'Cliente 14',
      direccionEntrega: 'Calle 100 # 8-50',
      observaciones: 'No aplica',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '015',
      cliente: 'Cliente 15',
      direccionEntrega: 'Cra 11 # 20-35',
      observaciones: 'Cadena de frío',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '016',
      cliente: 'Cliente 16',
      direccionEntrega: 'Calle 63 # 12-8',
      observaciones: 'Entrega prioritaria',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '017',
      cliente: 'Cliente 17',
      direccionEntrega: 'Cra 50 # 15-25',
      observaciones: 'No aplica',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '018',
      cliente: 'Cliente 18',
      direccionEntrega: 'Calle 80 # 22-10',
      observaciones: 'Cadena de frío',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '019',
      cliente: 'Cliente 19',
      direccionEntrega: 'Cra 13 # 30-40',
      observaciones: 'Entrega prioritaria',
      estado: 'Pendiente',
      seleccionado: false,
    },
    {
      id: '020',
      cliente: 'Cliente 20',
      direccionEntrega: 'Calle 45 # 18-22',
      observaciones: 'No aplica',
      estado: 'Pendiente',
      seleccionado: false,
    },
  ];

  pedidosPaginados: Pedido[] = [];
  pageSize = 8;
  pageIndex = 0;
  length = this.pedidos.length;

  ngOnInit() {
    this.actualizarPedidosPaginados();
  }

  actualizarPedidosPaginados() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pedidosPaginados = this.pedidos.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarPedidosPaginados();
  }

  totalPaginas(): number {
    return Math.ceil(this.length / this.pageSize);
  }

  irAPrimeraPagina() {
    if (this.pageIndex > 0) {
      this.pageIndex = 0;
      this.actualizarPedidosPaginados();
    }
  }

  irAUltimaPagina() {
    const total = this.totalPaginas();
    if (this.pageIndex < total - 1) {
      this.pageIndex = total - 1;
      this.actualizarPedidosPaginados();
    }
  }

  paginaAnterior() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.actualizarPedidosPaginados();
    }
  }

  paginaSiguiente() {
    const total = this.totalPaginas();
    if (this.pageIndex < total - 1) {
      this.pageIndex++;
      this.actualizarPedidosPaginados();
    }
  }

  toggleSeleccion(pedido: Pedido) {
    pedido.seleccionado = !pedido.seleccionado;
  }

  toggleSeleccionTodos() {
    const todosSeleccionados = this.pedidosPaginados.every(
      p => p.seleccionado
    );
    this.pedidosPaginados.forEach(p => {
      p.seleccionado = !todosSeleccionados;
    });
    // Actualizar también en el array principal
    this.pedidosPaginados.forEach(pedidoPaginado => {
      const pedido = this.pedidos.find(p => p.id === pedidoPaginado.id);
      if (pedido) {
        pedido.seleccionado = pedidoPaginado.seleccionado;
      }
    });
  }

  toggleSeleccionTodosEnHeader() {
    this.toggleSeleccionTodos();
  }

  todosSeleccionados(): boolean {
    return (
      this.pedidosPaginados.length > 0 &&
      this.pedidosPaginados.every(p => p.seleccionado)
    );
  }

  algunosSeleccionados(): boolean {
    return (
      this.pedidosPaginados.some(p => p.seleccionado) &&
      !this.todosSeleccionados()
    );
  }

  rutaGenerada: RutaGenerada | null = null;
  mostrandoRuta = false;
  generandoRuta = false;

  generarRuta() {
    // Validar que haya pedidos pendientes
    const pedidosPendientes = this.pedidos.filter(
      p => p.estado === 'Pendiente'
    );

    if (pedidosPendientes.length === 0) {
      this.snackBar.open(
        'No existen pedidos pendientes para generar ruta.',
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['warning-snackbar'],
        }
      );
      return;
    }

    // Validar que haya pedidos seleccionados
    const pedidosSeleccionados = this.pedidos.filter(p => p.seleccionado);

    if (pedidosSeleccionados.length === 0) {
      this.snackBar.open(
        'Por favor seleccione al menos un pedido para generar la ruta.',
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['warning-snackbar'],
        }
      );
      return;
    }

    // Iniciar generación de ruta
    this.generandoRuta = true;
    this.mostrandoRuta = false;
    this.rutaGenerada = null;

    try {
      // Simular cálculo de coordenadas (en producción vendrían de un servicio de geocodificación)
      const pedidosConCoordenadas = this.agregarCoordenadas(pedidosSeleccionados);

      // Calcular ruta optimizada (máximo 3 segundos)
      const inicioTiempo = Date.now();
      const rutaOptimizada = this.calcularRutaOptimizada(pedidosConCoordenadas);
      const tiempoTranscurrido = Date.now() - inicioTiempo;

      // Asegurar que no exceda 3 segundos
      if (tiempoTranscurrido < 3000) {
        setTimeout(() => {
          // Actualizar estado de los pedidos incluidos en la ruta
          rutaOptimizada.forEach(pedidoRuta => {
            const pedidoOriginal = this.pedidos.find(p => p.id === pedidoRuta.id);
            if (pedidoOriginal) {
              pedidoOriginal.estado = 'En ruta';
              pedidoOriginal.seleccionado = false; // Deseleccionar después de generar ruta
            }
          });

          // Actualizar la lista paginada
          this.actualizarPedidosPaginados();

          this.rutaGenerada = {
            pedidos: rutaOptimizada,
            distanciaTotal: this.calcularDistanciaTotal(rutaOptimizada),
            tiempoEstimado: Math.ceil(
              this.calcularDistanciaTotal(rutaOptimizada) / 30
            ), // Asumiendo 30 km/h promedio
          };
          this.generandoRuta = false;
          this.mostrandoRuta = true;

          this.snackBar.open(
            'Ruta de entrega generada exitosamente.',
            'Cerrar',
            {
              duration: 4000,
              panelClass: ['success-snackbar'],
            }
          );
        }, 3000 - tiempoTranscurrido);
      } else {
        throw new Error('Tiempo de cálculo excedido');
      }
    } catch (error) {
      this.generandoRuta = false;
      this.snackBar.open(
        'Ha ocurrido un error al generar la ruta, intente nuevamente.',
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  agregarCoordenadas(pedidos: Pedido[]): Pedido[] {
    // Simular coordenadas basadas en las direcciones
    // En producción, esto se haría con un servicio de geocodificación
    return pedidos.map((pedido, index) => {
      // Generar coordenadas simuladas (Bogotá aproximadamente)
      const baseLat = 4.6097;
      const baseLng = -74.0817;
      return {
        ...pedido,
        latitud: baseLat + (Math.random() - 0.5) * 0.1,
        longitud: baseLng + (Math.random() - 0.5) * 0.1,
      };
    });
  }

  calcularRutaOptimizada(pedidos: Pedido[]): Pedido[] {
    if (pedidos.length <= 1) return pedidos;

    // Algoritmo Nearest Neighbor (vecino más cercano) para optimización de ruta
    const ruta: Pedido[] = [];
    const noVisitados = [...pedidos];
    let actual = noVisitados[0]; // Punto de partida (almacén)
    ruta.push(actual);
    noVisitados.splice(0, 1);

    while (noVisitados.length > 0) {
      let masCercano = noVisitados[0];
      let distanciaMinima = this.calcularDistancia(actual, masCercano);
      let indiceMasCercano = 0;

      for (let i = 1; i < noVisitados.length; i++) {
        const distancia = this.calcularDistancia(actual, noVisitados[i]);
        if (distancia < distanciaMinima) {
          distanciaMinima = distancia;
          masCercano = noVisitados[i];
          indiceMasCercano = i;
        }
      }

      ruta.push(masCercano);
      noVisitados.splice(indiceMasCercano, 1);
      actual = masCercano;
    }

    return ruta;
  }

  calcularDistancia(pedido1: Pedido, pedido2: Pedido): number {
    if (!pedido1.latitud || !pedido1.longitud || !pedido2.latitud || !pedido2.longitud) {
      return Math.random() * 10; // Distancia aleatoria si no hay coordenadas
    }

    // Fórmula de Haversine para calcular distancia entre dos puntos
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(pedido2.latitud - pedido1.latitud);
    const dLon = this.toRad(pedido2.longitud - pedido1.longitud);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(pedido1.latitud)) *
        Math.cos(this.toRad(pedido2.latitud)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  calcularDistanciaTotal(pedidos: Pedido[]): number {
    let distanciaTotal = 0;
    for (let i = 0; i < pedidos.length - 1; i++) {
      distanciaTotal += this.calcularDistancia(pedidos[i], pedidos[i + 1]);
    }
    return Math.round(distanciaTotal * 10) / 10; // Redondear a 1 decimal
  }

  cerrarRuta() {
    this.mostrandoRuta = false;
    this.rutaGenerada = null;
  }
}

