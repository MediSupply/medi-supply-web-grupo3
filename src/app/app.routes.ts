import { Routes } from '@angular/router';
import { SignUpComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardRegistroComponent } from './modules/registro/componentes/dashboard-registro/dashboard-registro.component';
import { RegistroProveedorComponent } from './modules/registro/componentes/registro-proveedor/registro-proveedor.component';
import { RegistroVendedorComponent } from './modules/registro/componentes/registro-vendedor/registro-vendedor.component';
import { ReportesComponent } from './modules/reportes/reportes.component';

export const routes: Routes = [
  // { path: '**', redirectTo: 'login', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'registro', pathMatch: 'full' },
      { path: 'registro', component: DashboardRegistroComponent },
      { path: 'registro-proveedor', component: RegistroProveedorComponent },
      { path: 'registro-vendedor', component: RegistroVendedorComponent },
      { path: 'reportes', component: ReportesComponent },
    ],
  },
];
