import { Routes } from '@angular/router';
import { SignUpComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: 'registro', pathMatch: 'full' },
  { path: 'signup', component: SignUpComponent },
];
