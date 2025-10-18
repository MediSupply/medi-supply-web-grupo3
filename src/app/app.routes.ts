import { Routes } from '@angular/router';
import { RegistrarUsuarioComponent } from './pages/registrar-usuario/registrar-usuario.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'registro', component: RegistrarUsuarioComponent },
  { path: 'login', component: LoginComponent },
];
