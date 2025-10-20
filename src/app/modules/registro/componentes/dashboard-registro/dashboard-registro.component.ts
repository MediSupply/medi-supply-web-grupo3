import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-registro',
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
  templateUrl: './dashboard-registro.component.html',
  styleUrl: './dashboard-registro.component.scss'
})
export class DashboardRegistroComponent {

  constructor(private router: Router) {}

  addSeller(){
    
  }

  addSupplier(){
    this.router.navigate(['/dashboard/registro-proveedor']);
  }
}
