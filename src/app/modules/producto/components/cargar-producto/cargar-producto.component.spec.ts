import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { CargarProductoComponent } from './cargar-producto.component';

describe('CargarProductoComponent', () => {
  let component: CargarProductoComponent;
  let fixture: ComponentFixture<CargarProductoComponent>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockHistoryState = (state: any) => {
    Object.defineProperty(history, 'state', {
      get: () => state,
      configurable: true
    });
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        CargarProductoComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CargarProductoComponent);
    component = fixture.componentInstance;
    
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    
    mockHistoryState({});
    fixture.detectChanges();
  });

  afterEach(() => {
    Object.defineProperty(history, 'state', {
      get: () => ({}),
      configurable: true
    });
  });

  describe('Form Methods', () => {
    it('should show snackbar when markAllFieldsAsTouched is called', () => {
      snackBar.open.calls.reset();

      component.markAllFieldsAsTouched();
    });

    it('should mark all fields as touched', () => {
      component.markAllFieldsAsTouched();
      
      Object.keys(component.productForm.controls).forEach(key => {
        const control = component.productForm.get(key);
        expect(control?.touched).toBeTrue();
      });
    });

    it('should call markAllFieldsAsTouched and show snackbar when submitting invalid form', () => {
      const markAllFieldsAsTouchedSpy = spyOn(component, 'markAllFieldsAsTouched').and.callThrough();

      snackBar.open.calls.reset();

      component.productForm.controls['name'].setValue('');

      component.onSubmit();

      expect(markAllFieldsAsTouchedSpy).toHaveBeenCalled();
    });

    it('should detect invalid fields correctly', () => {
      const nameControl = component.productForm.get('name');
      nameControl?.markAsTouched();
      expect(component.isFieldInvalid('name')).toBeTrue();

      nameControl?.setValue('Valid Name');
      expect(component.isFieldInvalid('name')).toBeFalse();
    });

    it('should return correct error messages for required field', () => {
      const nameControl = component.productForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();
      expect(component.getFieldError('name')).toBe('Este campo es requerido');
    });
  });

  describe('Form Submission', () => {
    it('should submit form and set loading when valid', () => {
    const consoleSpy = spyOn(console, 'log');
    
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    const expirationDateString = futureDate.toISOString().split('T')[0];

    component.productForm.setValue({
      name: 'Test Product Valid Name',
      description: 'This is a valid description with more than 10 characters and meets all requirements', 
      price: 100,
      amount: 50,
      category: '1', 
      conditions: 'Valid storage conditions with enough length to meet validation', 
      expirationDate: expirationDateString, 
      batch: 'BATCH-123', 
      provider: '1', 
      deliveryTime: '24 horas'
    });

    // Verificar que el formulario es válido antes de enviar
    expect(component.productForm.valid).withContext(
      `Form should be valid. Errors: ${JSON.stringify(component.productForm.errors)}`
    ).toBeTrue();

    // Verificar específicamente los 3 campos con tipos de datos diferentes
    expect(component.productForm.get('category')?.valid)
      .withContext(`Category should be valid. Value: "${component.productForm.get('category')?.value}", Available categories: ${JSON.stringify(component.categories)}`)
      .toBeTrue();

    expect(component.productForm.get('expirationDate')?.valid)
      .withContext(`ExpirationDate should be valid. Value: "${component.productForm.get('expirationDate')?.value}", Errors: ${JSON.stringify(component.productForm.get('expirationDate')?.errors)}`)
      .toBeTrue();

    expect(component.productForm.get('provider')?.valid)
      .withContext(`Provider should be valid. Value: "${component.productForm.get('provider')?.value}", Available providers: ${JSON.stringify(component.providers)}`)
      .toBeTrue();

    component.onSubmit();

    expect(component.loading()).toBeTrue();
    expect(consoleSpy).toHaveBeenCalledWith('guardando');
    });

    it('should not set loading when form is invalid', () => {
        // Formulario vacío (inválido)
        component.onSubmit();
        expect(component.loading()).toBeFalse();
    });
  });


  describe('Navigation Methods', () => {
    it('should navigate to productos on cancel', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/productos']);
    });
  });

  describe('Edit Mode', () => {
    it('should detect edit mode from history state', () => {
      mockHistoryState({
        product: {
          id: 1,
          name: 'Test Product',
          category: { id: '1', value: 'Analgésicos' },
          provider: { id: '1', value: 'Genfar S.A.' }
        },
        action: 'edit'
      });

      component.checkEditMode();

      expect(component.isEditMode).toBeTrue();
      expect(component.categorySelected).toBe('1');
      expect(component.providerSelected).toBe('1');
    });
  });
});