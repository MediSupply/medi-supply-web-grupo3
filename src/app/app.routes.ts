import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { ListarProductosComponent } from './modules/producto/components/listar-productos/listar-productos.component';
import { CargarProductoComponent } from './modules/producto/components/cargar-producto/cargar-producto.component';

export const routes: Routes = [
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'productos', component: ListarProductosComponent },
  { path: 'producto', component: CargarProductoComponent },
];
