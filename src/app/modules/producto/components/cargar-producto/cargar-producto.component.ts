import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Product } from '../../models/product';
import { Category } from '../../models/category';

@Component({
  selector: 'app-cargar-producto',
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
  templateUrl: './cargar-producto.component.html',
  styleUrls: ['./cargar-producto.component.scss'],
})
export class CargarProductoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  productForm!: FormGroup;
  loading = signal<boolean>(false);
  isEditMode: boolean = false;
  productId = signal<number | null>(null);

  product: any;
  categorySelected: string = '';
  providerSelected: string = '';

  constructor(private router: Router) {}

  providers = [
    { id: '1', value: 'Genfar S.A.' },
    { id: '2', value: 'Bayer S.A.' },
    { id: '3', value: 'Pfizer S.A.S.' },
    { id: '4', value: 'Sanofi Aventis' },
    { id: '5', value: 'AstraZeneca' },
    { id: '6', value: 'Novartis S.A.' },
    { id: '7', value: 'Merck S.A.' },
    { id: '8', value: 'MSD Colombia' },
    { id: '9', value: 'GlaxoSmithKline' },
    { id: '10', value: 'Roche S.A.' },
    { id: '11', value: 'Aspen Pharma' },
  ];
  categories = [
    { id: '1', value: 'Analgésicos' },
    { id: '2', value: 'Antiinflamatorios' },
    { id: '3', value: 'Antibióticos' },
    { id: '4', value: 'Antialérgicos' },
    { id: '5', value: 'Gastrointestinales' },
    { id: '6', value: 'Cardiovasculares' },
    { id: '7', value: 'Antidiabéticos' },
    { id: '8', value: 'Respiratorios' },
    { id: '9', value: 'Psicotrópicos' },
    { id: '10', value: 'Antidepresivos' },
    { id: '11', value: 'Hormonales' },
    { id: '12', value: 'Anticoagulantes' },
  ];

  ngOnInit(product?: Product) {
    this.checkEditMode();
    this.initForm(this.product);
  }

  private initForm(product: Product): void {
    this.productForm = this.fb.group({
      name: [
        product?.name || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: [
        product?.description || '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      price: [
        product?.price || '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(1000000),
          this.positiveNumberValidator,
        ],
      ],
      amount: [
        product?.amount || '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(10000),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      category: [this.categorySelected, Validators.required],
      conditions: [
        product?.conditions || '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      expirationDate: [
        product?.expirationDate || '',
        [Validators.required, this.futureDateValidator],
      ],
      batch: [
        product?.batch || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-z0-9-]*$'),
        ],
      ],
      provider: [this.providerSelected, Validators.required],
      deliveryTime: [product?.deliveryTime || '', Validators.required],
    });
    if (this.isEditMode) {
      this.productForm.disable();
    }
  }

  private positiveNumberValidator(control: AbstractControl) {
    const value = control.value;
    if (value === null || value === '') return null;

    const numValue = Number(value);
    return numValue >= 0 ? null : { positiveNumber: true };
  }

  private futureDateValidator(control: AbstractControl) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { pastDate: true };
  }

  private checkEditMode(): void {
    const state = history.state;

    this.product = state?.product || null;
    this.isEditMode = state?.action === 'edit';

    if (this.isEditMode && this.product) {
      this.categorySelected = this.product.category?.id?.toString() || '';
      this.providerSelected = this.product.provider?.id?.toString() || '';
    } else {
      this.categorySelected = '';
      this.providerSelected = '';
    }

    // this.product = history.state.product || {};
    // const state = history.state;
    // state.action === 'edit' ? this.isEditMode=true: this.isEditMode=false;
    // if(this.isEditMode){
    //   if (this.product?.category) {
    //     this.categorySelected = this.product.category.id.toString();
    //     const categoryExists = this.categories.find(cat => cat.id === this.categorySelected);
    //   }
    //   else{
    //     this.categorySelected = ''
    //   }
    //   if (this.product?.provider) {
    //     this.providerSelected = this.product.provider.id.toString();
    //     const categoryExists = this.categories.find(cat => cat.id === this.providerSelected);
    //   }
    //   else{
    //     this.providerSelected = ''
    //   }
    // }
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);

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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading.set(true);
      console.log('guardando');
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      this.productForm.get(key)?.markAsTouched();
    });

    this.snackBar.open(
      'Por favor completa todos los campos requeridos correctamente',
      'Cerrar',
      { duration: 4000 }
    );
  }

  onCancel(): void {
    /*if (this.productForm.dirty) {
      const confirm = window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.');
      if (!confirm) return;
    }
    */
    this.router.navigate(['../productos'], { relativeTo: this.route });
  }

  onReset(): void {
    if (this.productForm.dirty) {
      const confirm = window.confirm(
        '¿Estás seguro de que quieres limpiar el formulario?'
      );
      if (!confirm) return;
    }

    this.productForm.reset();
  }
}
