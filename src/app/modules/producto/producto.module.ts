import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargarProductoComponent } from './components/cargar-producto/cargar-producto.component';
import { ListarProductosComponent } from './components/listar-productos/listar-productos.component';



@NgModule({
  declarations: [
    CargarProductoComponent,
    ListarProductosComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProductoModule { }
