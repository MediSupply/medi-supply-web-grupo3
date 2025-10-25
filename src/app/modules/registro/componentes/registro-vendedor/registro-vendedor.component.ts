import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-registro-vendedor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    LoaderComponent,
  ],
  templateUrl: './registro-vendedor.component.html',
  styleUrl: './registro-vendedor.component.scss',
})
export class RegistroVendedorComponent {
  vendedorForm: FormGroup;
  showForm = true;
  cargando = false;
  paises = [
    { id: 0, value: 'Colombia' },
    { id: 1, value: 'Chile' },
    { id: 2, value: 'Peru' },
  ];
  zonas = [
    { id: 1, value: 'Zona Norte' },
    { id: 2, value: 'Zona Sur' },
    { id: 3, value: 'Zona Centro' },
    { id: 4, value: 'Zona Oriente' },
    { id: 5, value: 'Zona Occidente' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.vendedorForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['Juan Pérez', [Validators.required, this.alphabeticValidator]],
      pais: [0, Validators.required], // Colombia
      zona: [1, Validators.required], // Zona Norte
      rutaVisitas: ['Cliente A, Cliente B, Cliente C', [Validators.required, this.rutaVisitasValidator]],
      correo: ['juan.perez@email.com', [Validators.required, Validators.email]],
      contrasena: ['password123', [Validators.required, this.passwordValidator]],
    });
  }

  private alphabeticValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;
    
    // Solo permite letras y espacios
    const alphabeticPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return alphabeticPattern.test(value) ? null : { alphabetic: true };
  }

  private rutaVisitasValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;
    
    // Debe contener al menos un punto de visita (separado por comas, puntos, o guiones)
    const puntosVisita = value.split(/[,.\-;]/).filter((punto: any) => punto.trim().length > 0);
    return puntosVisita.length >= 1 ? null : { minPuntosVisita: true };
  }

  private passwordValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;
    
    // Misma validación que en signup: al menos 8 caracteres, letras y números
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(value) ? null : { passwordFormat: true };
  }

  getFieldError(fieldName: string): string {
    const field = this.vendedorForm.get(fieldName);

    // Solo mostrar errores si el campo ha sido tocado Y tiene errores
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        if (fieldName === 'zona') return 'Debe seleccionar una zona asignada.';
        if (fieldName === 'rutaVisitas') return 'Debe ingresar la ruta de visitas.';
        if (fieldName === 'pais') return 'Debe seleccionar un país.';
        return 'Este campo es requerido';
      }
      if (field.errors['alphabetic']) return 'Solo se permiten caracteres alfabéticos y espacios';
      if (field.errors['minPuntosVisita']) return 'Debe contener al menos un punto de visita';
      if (field.errors['email']) return 'Formato de correo inválido';
      if (field.errors['passwordFormat']) return 'La contraseña debe tener al menos 8 caracteres e incluir letras y números';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }

    return '';
  }

  onSubmit(): void {
    if (this.vendedorForm.valid) {
      const formData: any = this.vendedorForm.value;
      console.log('Datos del vendedor:', formData);

      // Activar loader
      this.cargando = true;

      // Simular envío al servidor
      setTimeout(() => {
        try {
          // Aquí iría la lógica para enviar los datos al servidor
          // Ejemplo: this.vendedorService.crearVendedor(formData).subscribe(...)
          
          this.snackBar.open('Vendedor registrado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          // Ocultar y mostrar el formulario para forzar su recreación completa
          this.showForm = false;
          setTimeout(() => {
            this.showForm = true;
            this.vendedorForm = this.createForm();
            this.cargando = false; // Desactivar loader
          }, 50);
        } catch (error) {
          this.cargando = false; // Desactivar loader en caso de error
          this.snackBar.open('Ha ocurrido un error, intente nuevamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      }, 1500); // Simular tiempo de procesamiento
    } else {
      this.markFormGroupTouched(this.vendedorForm);
      this.snackBar.open('Todos los campos son obligatorios', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  onCancel(): void {
    // Ocultar y mostrar el formulario para forzar su recreación completa
    this.showForm = false;
    setTimeout(() => {
      this.showForm = true;
      this.vendedorForm = this.createForm();
    }, 50);
    this.router.navigate(['/dashboard/registro']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get nombre() {
    return this.vendedorForm.get('nombre');
  }
  get pais() {
    return this.vendedorForm.get('pais');
  }
  get zona() {
    return this.vendedorForm.get('zona');
  }
  get rutaVisitas() {
    return this.vendedorForm.get('rutaVisitas');
  }
  get correo() {
    return this.vendedorForm.get('correo');
  }
  get contrasena() {
    return this.vendedorForm.get('contrasena');
  }
}
