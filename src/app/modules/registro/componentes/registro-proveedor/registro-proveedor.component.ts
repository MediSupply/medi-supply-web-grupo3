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
import { ProveedoresService } from '../../../../services/proveedores.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-registro-proveedor',
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
  templateUrl: './registro-proveedor.component.html',
  styleUrl: './registro-proveedor.component.scss',
})
export class RegistroProveedorComponent {
  proveedorForm: FormGroup;
  hidePassword = true;
  cargando = false;
  paises = [
    { id: 0, value: 'Colombia' },
    { id: 1, value: 'Chile' },
    { id: 2, value: 'Peru' },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private proveedoresService: ProveedoresService,
    private snackBar: MatSnackBar
  ) {
    this.proveedorForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['Proveedor Ejemplo S.A.', Validators.required],
      nit: [
        '123456789',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(10000000000),
          this.positiveNumberValidator,
        ],
      ],
      pais: [0, Validators.required], // Colombia
      direccion: ['Calle 123 #45-67', Validators.required],
      telefono: [
        '6012345678',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(10),
          this.numericOnlyValidator,
        ],
      ],
      correo: [
        'contacto@proveedor.com',
        [Validators.required, Validators.email],
      ],
      contrasena: ['123', Validators.required],
    });
  }

  private positiveNumberValidator(control: AbstractControl) {
    const value = control.value;
    if (value === null || value === '') return null;

    const numValue = Number(value);
    return numValue >= 0 ? null : { positiveNumber: true };
  }

  private numericOnlyValidator(control: AbstractControl) {
    const value = control.value;
    if (value === null || value === '') return null;

    // Solo permite números
    const numericPattern = /^\d+$/;
    return numericPattern.test(value) ? null : { numericOnly: true };
  }

  getFieldError(fieldName: string): string {
    const field = this.proveedorForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['email'])
        return 'Formato de correo electrónico inválido';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} dígitos`;
      if (field.errors['maxlength'])
        return `Máximo ${field.errors['maxlength'].requiredLength} dígitos`;
      if (field.errors['min'])
        return `El valor mínimo es ${field.errors['min'].min}`;
      if (field.errors['max'])
        return `El valor máximo es ${field.errors['max'].max}`;
      if (field.errors['numericOnly'])
        return 'El teléfono solo debe contener números';
      if (field.errors['positiveNumber']) return 'Debe ser un número positivo';
    }

    return '';
  }

  onSubmit(): void {
    if (this.proveedorForm.valid) {
      const formData = this.proveedorForm.value;

      // Mapear el ID del país al nombre en minúsculas
      const paisSeleccionado = this.paises.find(p => p.id === formData.pais);
      const nombrePais = paisSeleccionado
        ? paisSeleccionado.value.toLowerCase()
        : '';

      // Preparar los datos según el formato esperado por el endpoint
      const proveedorData = {
        nit: Number(formData.nit),
        nombre: formData.nombre,
        pais: nombrePais,
        direccion: formData.direccion,
        telefono: Number(formData.telefono),
        email: formData.correo,
      };

      console.log('Enviando datos del proveedor:', proveedorData);

      // Activar loader
      this.cargando = true;

      // Enviar los datos al servidor
      this.proveedoresService.registrarProveedor(proveedorData).subscribe({
        next: (response: any) => {
          console.log('Proveedor registrado exitosamente:', response);
          this.cargando = false;

          this.snackBar.open('Proveedor registrado exitosamente.', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.proveedorForm.reset();
          this.router.navigate(['/dashboard/registro']);
        },
        error: (error: any) => {
          console.error('Error al registrar proveedor:', error);
          this.cargando = false;

          // Manejar el formato de error del backend: { error: "...", success: false }
          let mensajeError =
            error.error?.error || error.error?.message || error.message || '';

          // Verificar si el error es relacionado con NIT duplicado
          if (
            mensajeError.toLowerCase().includes('nit') ||
            mensajeError.toLowerCase().includes('ya existe')
          ) {
            mensajeError = 'El NIT ya está registrado para otro proveedor';
          } else if (!mensajeError) {
            // Si no hay mensaje específico, es un error técnico
            mensajeError = 'Ha ocurrido un error, intente nuevamente.';
          }

          this.snackBar.open(mensajeError, 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        },
      });
    } else {
      this.markFormGroupTouched(this.proveedorForm);
      this.snackBar.open('Todos los campos son obligatorios.', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }

  onTelefonoKeyPress(event: KeyboardEvent): void {
    // Solo permitir números
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  onCancel(): void {
    this.proveedorForm.reset();
    this.router.navigate(['/dashboard/registro']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para acceder fácilmente a los controles del formulario (usando signals)
  get nombre() {
    return this.proveedorForm.get('nombre');
  }
  get nit() {
    return this.proveedorForm.get('nit');
  }
  get pais() {
    return this.proveedorForm.get('pais');
  }
  get direccion() {
    return this.proveedorForm.get('direccion');
  }
  get telefono() {
    return this.proveedorForm.get('telefono');
  }
  get correo() {
    return this.proveedorForm.get('correo');
  }
  get contrasena() {
    return this.proveedorForm.get('contrasena');
  }
}
