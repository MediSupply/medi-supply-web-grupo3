import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  user = {
    email: 'juan@ejemplo.com',
    password: 'password123',
  };

  mensaje = '';
  cargando = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const authenticated = this.authService.isAuthenticated();
    if (authenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login(form: NgForm) {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email);
    if (!emailValido) {
      this.mensaje = 'El correo electrónico no tiene un formato válido ⚠️';
      return;
    }

    if (form.invalid) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    const { email, password } = this.user;

    this.authService
      .login(email, password)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.cargando = false;
          }, 400);
        })
      )
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          if (err.status === 404) {
            this.mensaje = 'El usuario no existe';
          } else if (err.status === 401) {
            this.mensaje = 'Contraseña incorrecta';
          } else {
            this.mensaje = 'Error al iniciar sesion';
          }

          console.error('Error:', err);
        },
      });
  }

  toRegister() {
    this.router.navigate(['/signup']);
  }
}
