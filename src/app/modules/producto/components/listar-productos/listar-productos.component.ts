import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ProductoService } from '../../services/producto.service';
import { Product } from '../../models/product';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.scss'
})
export class ListarProductosComponent implements OnInit, AfterViewInit{
  private productService = inject(ProductoService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  
  displayedColumns = signal<string[]>(['id', 'name', 'description', 'price', 'amount','actions']);
  dataSource = new MatTableDataSource<Product>();
  loading = signal<boolean>(true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
    
  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts(): void {
    this.loading.set(true);
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.dataSource.data = products;
        this.loading.set(false);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading.set(false);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addProduct(){
      this.router.navigate(['/producto'], {
      queryParams: {
        action: 'new',
        source: 'productos'
      }
      // state: { data: {} }
    });
  }

  editProduct(product: Product){
    console.log(product)
    this.router.navigate(['/producto'], {
      state: { 
        product: product,
        action: 'edit'
     } 
    });
  }
}
