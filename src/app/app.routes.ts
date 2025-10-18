import { Routes } from '@angular/router';
import { RegistrarUsuarioComponent } from './pages/registrar-usuario/registrar-usuario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'registro', pathMatch: 'full' },
  { path: 'registro', component: RegistrarUsuarioComponent },
];
