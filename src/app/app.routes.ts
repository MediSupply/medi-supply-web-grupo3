import { Routes } from '@angular/router';
import { SignUpComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignUpComponent },
];
