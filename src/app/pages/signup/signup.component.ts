import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignUpComponent {
  user = {
    name: '',
    email: '',
    password: '',
    role: '',
  };

  loginData = {
    correo: '',
    password: '',
  };

  mensaje = '';
  cargando = false;

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

  signup(form: NgForm) {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email);
    if (!emailValido) {
      this.mensaje = 'El correo electrónico no tiene un formato válido ⚠️';
      return;
    }

    const passwordValida = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
      this.user.password
    );
    if (!passwordValida) {
      this.mensaje =
        'La contraseña debe tener al menos 8 caracteres e incluir letras y números ⚠️';
      return;
    }

    if (form.invalid) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    this.authService
      .signup(this.user)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.cargando = false;
          }, 400);
        })
      )
      .subscribe({
        next: (response: any) => {
          this.mensaje = 'Usuario registrado correctamente ✅';

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (err: any) => {
          if (err.status === 409) {
            this.mensaje = 'El correo electrónico ya está registrado ❌';
          } else {
            this.mensaje = 'Error al registrar el usuario ❌';
          }

          console.error('Error:', err);
        },
      });
  }

  toLogin() {
    this.router.navigate(['/login']);
  }
}
