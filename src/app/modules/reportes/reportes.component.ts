import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import {
  VendedoresService,
  Vendedor,
  IndicadoresVendedor,
} from '../../services/vendedores.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss',
})
export class ReportesComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChart', { static: false }) lineChartRef!: ElementRef;
  @ViewChild('barChart', { static: false }) barChartRef!: ElementRef;
  @ViewChild('pieChart', { static: false }) pieChartRef!: ElementRef;

  vendedorForm: FormGroup;
  cargando = false;
  vendedores: Vendedor[] = [];
  vendedorSeleccionado: Vendedor | null = null;
  indicadores: IndicadoresVendedor | null = null;
  mostrarIndicadores = false;
  sinDatos = false;
  errorCarga = false;

  private lineChart: Chart | null = null;
  private barChart: Chart | null = null;
  private pieChart: Chart | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private vendedoresService: VendedoresService
  ) {
    this.vendedorForm = this.createForm();
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.cargarVendedores();
  }

  ngAfterViewInit(): void {
    // Los gráficos se crearán cuando se seleccione un vendedor
  }

  private createForm(): FormGroup {
    return this.fb.group({
      vendedor: ['', Validators.required],
    });
  }

  cargarVendedores(): void {
    this.vendedoresService.getVendedores().subscribe({
      next: vendedores => {
        this.vendedores = vendedores;
      },
      error: error => {
        console.error('Error al cargar vendedores:', error);
        this.snackBar.open('Error al cargar la lista de vendedores', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  seleccionarVendedor(): void {
    const vendedorId = this.vendedorForm.get('vendedor')?.value;
    console.log('Vendedor seleccionado ID:', vendedorId);

    if (vendedorId) {
      this.vendedorSeleccionado =
        this.vendedores.find(v => v.id === vendedorId) || null;
      console.log('Vendedor encontrado:', this.vendedorSeleccionado);

      if (this.vendedorSeleccionado) {
        this.cargarIndicadores();
      }
    } else {
      this.snackBar.open(
        'Debe seleccionar un vendedor para visualizar su información',
        'Cerrar',
        {
          duration: 3000,
        }
      );
    }
  }

  cargarIndicadores(): void {
    if (!this.vendedorSeleccionado) return;

    console.log('Cargando indicadores para:', this.vendedorSeleccionado.nombre);
    this.cargando = true;
    this.mostrarIndicadores = false;
    this.sinDatos = false;
    this.errorCarga = false;

    this.vendedoresService
      .getIndicadoresVendedor(this.vendedorSeleccionado.id)
      .subscribe({
        next: indicadores => {
          console.log('Indicadores recibidos:', indicadores);

          if (indicadores) {
            this.indicadores = indicadores;
            this.mostrarIndicadores = true;
            this.sinDatos = false;
            console.log('Mostrando indicadores:', this.mostrarIndicadores);
            // Crear gráficos después de un pequeño delay para asegurar que los elementos estén disponibles
            setTimeout(() => {
              this.crearGraficos();
            }, 100);
          } else {
            this.sinDatos = true;
            this.mostrarIndicadores = false;
            this.snackBar.open(
              'No se encontraron datos para los criterios seleccionados',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
          this.cargando = false;
        },
        error: error => {
          console.error('Error al cargar indicadores:', error);
          this.errorCarga = true;
          this.mostrarIndicadores = false;
          this.snackBar.open(
            'Ha ocurrido un error al cargar los reportes, intente nuevamente',
            'Cerrar',
            {
              duration: 3000,
            }
          );
          this.cargando = false;
        },
      });
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  }

  private crearGraficos(): void {
    this.crearLineChart();
    this.crearBarChart();
    this.crearPieChart();
  }

  private crearLineChart(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    const ctx = this.lineChartRef?.nativeElement?.getContext('2d');
    if (!ctx || !this.vendedorSeleccionado) return;

    this.vendedoresService
      .getDatosVentasHistoricas(this.vendedorSeleccionado.id)
      .subscribe(data => {
        this.lineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [
              'Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
            ],
            datasets: [
              {
                label: 'Ventas Totales (Miles)',
                data: data,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Ventas (Miles de COP)',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Meses',
                },
              },
            },
          },
        });
      });
  }

  private crearBarChart(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }

    const ctx = this.barChartRef?.nativeElement?.getContext('2d');
    if (!ctx || !this.vendedorSeleccionado) return;

    this.vendedoresService
      .getDatosClientes(this.vendedorSeleccionado.id)
      .subscribe(data => {
        this.barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              'Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
            ],
            datasets: [
              {
                label: 'Clientes Atendidos',
                data: data.clientesAtendidos,
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
              },
              {
                label: 'Nuevos Clientes',
                data: data.nuevosClientes,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Número de Clientes',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Meses',
                },
              },
            },
          },
        });
      });
  }

  private crearPieChart(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const ctx = this.pieChartRef?.nativeElement?.getContext('2d');
    if (!ctx || !this.vendedorSeleccionado) return;

    this.vendedoresService
      .getDatosDistribucion(this.vendedorSeleccionado.id)
      .subscribe(data => {
        this.pieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: data.labels,
            datasets: [
              {
                data: data.data,
                backgroundColor: [
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                ],
                borderColor: [
                  'rgb(54, 162, 235)',
                  'rgb(255, 99, 132)',
                  'rgb(255, 206, 86)',
                  'rgb(75, 192, 192)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  font: {
                    size: 14,
                  },
                },
              },
              title: {
                display: true,
                text: 'Indicadores de Desempeño del Vendedor',
                font: {
                  size: 16,
                  weight: 'bold',
                },
              },
            },
          },
        });
      });
  }
}
