import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargarProductoComponent } from './components/cargar-producto/cargar-producto.component';
import { ListarProductosComponent } from './components/listar-productos/listar-productos.component';
import { LocalizarProductoComponent } from './components/localizar-producto/localizar-producto.component';

@NgModule({
  declarations: [],
  imports: [CommonModule,CargarProductoComponent,ListarProductosComponent, LocalizarProductoComponent ],
})
export class ProductoModule {}
