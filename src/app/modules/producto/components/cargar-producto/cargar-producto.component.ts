import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
    MatTooltipModule  ],
  templateUrl: './cargar-producto.component.html',
  styleUrls: ['./cargar-producto.component.scss']
})
export class CargarProductoComponent implements OnInit{
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  productForm!: FormGroup;
  loading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  productId = signal<number | null>(null);

  providers = [
    'Genfar S.A.',
    'Bayer S.A.',
    'Pfizer S.A.S.',
    'Sanofi Aventis',
    'AstraZeneca',
    'Novartis S.A.',
    'Merck S.A.',
    'MSD Colombia',
    'GlaxoSmithKline',
    'Roche S.A.',
    'Aspen Pharma'
  ];
  categories = [
    'Analgésicos',
    'Antiinflamatorios',
    'Antibióticos',
    'Antialérgicos',
    'Gastrointestinales',
    'Cardiovasculares',
    'Antidiabéticos',
    'Respiratorios',
    'Psicotrópicos',
    'Antidepresivos',
    'Hormonales',
    'Anticoagulantes'
  ];


  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

    private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      price: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(1000000),
        this.positiveNumberValidator
      ]],
      amount: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(10000),
        Validators.pattern('^[0-9]*$')
      ]],
      category: ['', Validators.required],
      conditions: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      expirationDate: ['', [
        Validators.required,
        this.futureDateValidator
      ]],
      batch: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z0-9-]*$')
      ]],
      provider: ['', Validators.required],
      deliveryTime: ['', Validators.required]
    });
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
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.productId.set(+params['id']);
        this.loadProductData(this.productId()!);
      }
    });
  }

  private loadProductData(id: number): void {}

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
      if (field.errors['max']) return `El valor máximo es ${field.errors['max'].max}`;
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
      console.log("guardando")
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
    this.router.navigate(['/productos']);
  }

  onReset(): void {
    if (this.productForm.dirty) {
      const confirm = window.confirm('¿Estás seguro de que quieres limpiar el formulario?');
      if (!confirm) return;
    }
    
    this.productForm.reset();
  }
}
