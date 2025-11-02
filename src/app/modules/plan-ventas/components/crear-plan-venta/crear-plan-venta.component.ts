import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
  Vendedor,
  VendedoresService,
} from '../../../../services/vendedores.service';
import { ProductoService } from '../../../../services/producto.service';
import { Product } from '../../../producto/models/product';

@Component({
  selector: 'app-crear-plan-venta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './crear-plan-venta.component.html',
  styleUrl: './crear-plan-venta.component.scss',
})
export class CrearPlanVentaComponent {
  private fb = inject(FormBuilder);
  sellers: Vendedor[] = [];
  products: Product[] = [];

  planVentaForm!: FormGroup;
  loading = signal<boolean>(false);

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private vendedoresService: VendedoresService,
    private productService: ProductoService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadSellers();
    this.loadProducts();
    this.planVentaForm.get('startDate')?.valueChanges.subscribe(() => {
      this.planVentaForm.get('endDate')?.updateValueAndValidity();
    });
  }

  public initForm(): void {
    this.planVentaForm = this.fb.group({
      seller: ['', [Validators.required]],
      product: ['', [Validators.required]],
      meta: [
        '',
        [Validators.required, Validators.min(0), this.positiveNumberValidator],
      ],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });
    this.setupDateValidation();
  }

  getFieldError(fieldName: string): string {
    const field = this.planVentaForm.get(fieldName);

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
      if (field.errors['endDateInvalid'])
        return 'La fecha de fin no puede ser anterior a la fecha de inicio';
    }
    return '';
  }

  private positiveNumberValidator(control: AbstractControl) {
    const value = control.value;
    if (value === null || value === '') return null;

    const numValue = Number(value);
    return numValue >= 0 ? null : { positiveNumber: true };
  }

  private setupDateValidation(): void {
    const startDateControl = this.planVentaForm.get('startDate');
    const endDateControl = this.planVentaForm.get('endDate');

    startDateControl?.valueChanges.subscribe(() => {
      this.validateDates();
    });

    endDateControl?.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }

  public validateDates(): void {
    const startDate = this.planVentaForm.get('startDate')?.value;
    const endDate = this.planVentaForm.get('endDate')?.value;
    const endDateControl = this.planVentaForm.get('endDate');

    if (!startDate || !endDate) {
      endDateControl?.setErrors(null);
      return;
    }

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (end < start) {
        endDateControl?.setErrors({ endDateInvalid: true });
      } else {
        const currentErrors = endDateControl?.errors;
        if (currentErrors && currentErrors['endDateInvalid']) {
          const { endDateInvalid, ...otherErrors } = currentErrors;
          endDateControl?.setErrors(
            Object.keys(otherErrors).length > 0 ? otherErrors : null
          );
        }
      }
    } catch (error) {
      console.error('Error validando fechas:', error);
    }
  }

  loadSellers(): void {
    this.vendedoresService.getVendedores().subscribe({
      next: sellers => {
        this.sellers = sellers;
      },
      error: error => {
        console.error('Error al cargar vendedores:', error);
        this.snackBar.open('Error al cargar la lista de vendedores', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: products => {
        this.products = products;
      },
      error: error => {
        console.error('Error al cargar productos:', error);
        this.snackBar.open('Error al cargar la lista de productos', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  onSubmit() {
    if (this.planVentaForm.valid) {
      const formData: any = this.planVentaForm.value;
      console.log('Datos del plan de venta:', formData);

      this.snackBar.open('Plan de venta registrado exitosamente.', 'Cerrar', {
        duration: 3000,
      });
      this.planVentaForm.reset();
    } else {
      this.markFormGroupTouched(this.planVentaForm);
    }
  }

  public markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para acceder fácilmente a los controles del formulario (usando signals)
  get seller() {
    return this.planVentaForm.get('seller');
  }
  get product() {
    return this.planVentaForm.get('product');
  }
  get meta() {
    return this.planVentaForm.get('meta');
  }
  get startDate() {
    return this.planVentaForm.get('startDate');
  }
  get endDate() {
    return this.planVentaForm.get('endDate');
  }
}
