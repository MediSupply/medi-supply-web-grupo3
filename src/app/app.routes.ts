import { Routes } from '@angular/router';

export const routes: Routes = [
{
    path: 'productos',
    loadComponent: () => import('./modules/producto/components/listar-productos/listar-productos.component').then(m => m.ListarProductosComponent)
},
{
    path: 'producto',
    loadComponent: () => import('./modules/producto/components/cargar-producto/cargar-producto.component').then(m => m.CargarProductoComponent)
},
{ path: '', redirectTo: '/productos', pathMatch: 'full' },
  /*{ 
    path: '**', 
    loadComponent: () => import('./shared/components/not-found/not-found.component')
      .then(m => m.NotFoundComponent) 
  }*/
];
