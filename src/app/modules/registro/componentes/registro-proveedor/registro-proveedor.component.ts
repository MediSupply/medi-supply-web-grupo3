import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Pais } from '../../../producto/models/pais';
import { Router } from '@angular/router';


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
    MatIconModule
  ],
  templateUrl: './registro-proveedor.component.html',
  styleUrl: './registro-proveedor.component.scss'
})
export class RegistroProveedorComponent {
  proveedorForm: FormGroup;
  hidePassword = true
  paises: Pais[] = [
    { id: 0, value: 'Colombia' },
    { id: 1, value: 'Chile' },
    { id: 2, value: 'Peru' },
  ];
  constructor(private fb: FormBuilder, private router: Router) {
    this.proveedorForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      nit: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(10000000000),
        this.positiveNumberValidator]],
      pais: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      telefono: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
        Validators.min(0),
        this.positiveNumberValidator]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private positiveNumberValidator(control: AbstractControl) {
    const value = control.value;
    if (value === null || value === '') return null;

    const numValue = Number(value);
    return numValue >= 0 ? null : { positiveNumber: true };
  }


  getFieldError(fieldName: string): string {
    const field = this.proveedorForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength'])
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min'])
        return `El valor mínimo es ${field.errors['min'].min}`;
      if (field.errors['max'])
        return `El valor máximo es ${field.errors['max'].max}`;
      if (field.errors['pattern']) return 'Formato inválido';
      if (field.errors['positiveNumber']) return 'Debe ser un número positivo';
      if (field.errors['pastDate']) return 'La fecha debe ser futura';
    }

    return '';
  }

  onSubmit(): void {
    if (this.proveedorForm.valid) {
      const formData: any = this.proveedorForm.value;
      console.log('Datos del proveedor:', formData);
      
      // Aquí puedes agregar la lógica para enviar los datos al servidor
      // Ejemplo: this.proveedorService.crearProveedor(formData).subscribe(...)
      
      alert('Proveedor registrado exitosamente');
      this.proveedorForm.reset();
    } else {
      this.markFormGroupTouched(this.proveedorForm);
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
  get nombre() { return this.proveedorForm.get('nombre'); }
  get nit() { return this.proveedorForm.get('nit'); }
  get pais() { return this.proveedorForm.get('pais'); }
  get direccion() { return this.proveedorForm.get('direccion'); }
  get telefono() { return this.proveedorForm.get('telefono'); }
  get correo() { return this.proveedorForm.get('correo'); }
  get contrasena() { return this.proveedorForm.get('contrasena'); }
}
