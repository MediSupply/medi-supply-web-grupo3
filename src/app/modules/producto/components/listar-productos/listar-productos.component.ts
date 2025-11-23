import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Product } from '../../models/product';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductoService } from '../../../../services/producto.service';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.scss',
})
export class ListarProductosComponent implements OnInit, AfterViewInit {
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  snackBar = inject(MatSnackBar);

  displayedColumns = signal<string[]>([
    'id',
    'name',
    'description',
    'price',
    'amount',
    'actions',
  ]);
  dataSource = new MatTableDataSource<Product>();
  loading = signal<boolean>(true);
  mensaje = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts() {
    this.loading.set(true);
    this.productService
      .getAllProducts()
      .pipe(
        finalize(() => {
          setTimeout(() => {
            //this.cargando = false;
          }, 400);
        })
      )
      .subscribe({
        next: (response: any) => {
          const products = this.productService.productsSignal();
          if (products.length === 0) {
            this.snackBar.open('No hay productos registrados', 'Cerrar', {
              duration: 3000,
            });
          } else {
            this.dataSource.data = products;
          }
        },
        error: (err: any) => {
          if (err.status === 401) {
            this.mensaje = 'Usuario no autorizado';
          } else {
            this.mensaje =
              'Error al consultar la información, intente nuevamente';
          }
          this.snackBar.open(this.mensaje, 'Cerrar', {
            duration: 3000,
          });
          console.error('Error:', err);
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.dataSource.filteredData.length === 0) {
      this.snackBar.open('Producto no encontrado', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  addProduct() {
    this.router.navigate(['../producto'], {
      relativeTo: this.route,
      queryParams: {
        action: 'new',
        source: 'productos',
      },
    });
  }

  editProduct(product: Product) {
    this.router.navigate(['../producto'], {
      relativeTo: this.route,
      state: {
        product: product,
        action: 'edit',
      },
    });
  }

  locateProduct() {
    this.router.navigate(['/dashboard/localizar-producto']);
  }
}
