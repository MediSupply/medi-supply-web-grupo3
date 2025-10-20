import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { ListarProductosComponent } from './modules/producto/components/listar-productos/listar-productos.component';
import { CargarProductoComponent } from './modules/producto/components/cargar-producto/cargar-producto.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardRegistroComponent } from './modules/registro/componentes/dashboard-registro/dashboard-registro.component';
import { RegistroProveedorComponent } from './modules/registro/componentes/registro-proveedor/registro-proveedor.component';

export const routes: Routes = [
  // { path: '**', redirectTo: 'login', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      { path: 'productos', component: ListarProductosComponent },
      { path: 'producto', component: CargarProductoComponent },
      { path: 'registro', component: DashboardRegistroComponent },
      { path: 'registro-proveedor', component: RegistroProveedorComponent },
    ],
  },
];
