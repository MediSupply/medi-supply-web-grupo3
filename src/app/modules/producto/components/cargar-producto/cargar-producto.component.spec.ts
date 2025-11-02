import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  let routerSpy: jasmine.SpyObj<Router>;

  const initializeComponent = (stateData: any = {}) => {
    history.replaceState(stateData, '');
    fixture.detectChanges();
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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
        MatIconModule,
      ],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CargarProductoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    history.replaceState({}, '');
  });

  it('should submit valid form and reset it', () => {
    spyOn(window, 'alert');

    // Inicializar el componente con estado vacío
    initializeComponent();

    // Verificar que el formulario existe
    expect(component.productForm).toBeDefined();

    const testDate = new Date('2026-02-12');
    component.productForm.setValue({
      name: 'Prueba',
      description: 'Descripcion prueba',
      price: 10,
      amount: 1000,
      category: '1',
      expirationDate: testDate,
      batch: 'ejemplo',
      provider: '2',
      deliveryTime: '24 horas',
      conditions: 'Wertyui',
    });

    expect(component.productForm.valid).toBeTrue();

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith(
      'Producto registrado exitosamente'
    );
    expect(component.productForm.pristine).toBeTrue();
    expect(component.productForm.value).toEqual({
      name: null,
      description: null,
      price: null,
      amount: null,
      category: null,
      expirationDate: null,
      batch: null,
      provider: null,
      deliveryTime: null,
      conditions: null,
    });
  });

  it('should mark form as touched when submitting invalid form', () => {
    // Inicializar el componente con estado vacío
    initializeComponent();

    // Verificar que el formulario existe
    expect(component.productForm).toBeDefined();

    component.productForm.setValue({
      name: '',
      description: '',
      price: '',
      amount: '',
      category: '',
      expirationDate: '',
      batch: '',
      provider: '',
      deliveryTime: '',
      conditions: '',
    });

    component.onSubmit();
    expect(component.productForm.touched).toBeTrue();
  });

  it('should reset form and navigate on cancel', () => {
    // Inicializar el componente con estado vacío
    initializeComponent();

    // Verificar que el formulario existe
    expect(component.productForm).toBeDefined();
    component.onCancel();
    expect(component.productForm.pristine).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard/productos']);
  });

  describe('getFieldError', () => {
    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.name;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('name')).toBe('Este campo es requerido');
    });
    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.name;
      control?.setValue('ab');
      control?.markAsTouched();
      expect(component.getFieldError('name')).toBe('Mínimo 3 caracteres');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.name;
      control?.setValue('123456789012');
      control?.markAsTouched();
      expect(component.getFieldError('name')).toBe('Máximo 10 caracteres');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.description;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('description')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.description;
      control?.setValue('ab');
      control?.markAsTouched();
      expect(component.getFieldError('description')).toBe(
        'Mínimo 3 caracteres'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.description;
      control?.setValue('a'.repeat(51));
      control?.markAsTouched();
      expect(component.getFieldError('description')).toBe(
        'Máximo 50 caracteres'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.price;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('price')).toBe('Este campo es requerido');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.price;
      control?.setValue(-9);
      control?.markAsTouched();
      expect(component.getFieldError('price')).toBe('El valor mínimo es 0');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.price;
      control?.setValue('ab');
      control?.markAsTouched();
      expect(component.getFieldError('price')).toBe(
        'Debe ser un número positivo'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.amount;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('amount')).toBe('Este campo es requerido');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.amount;
      control?.setValue(-9);
      control?.markAsTouched();
      expect(component.getFieldError('amount')).toBe('El valor mínimo es 0');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.amount;
      control?.setValue('ab4');
      control?.markAsTouched();
      expect(component.getFieldError('amount')).toBe('Formato inválido');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.category;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('category')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.conditions;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('conditions')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.conditions;
      control?.setValue('ab');
      control?.markAsTouched();
      expect(component.getFieldError('conditions')).toBe('Mínimo 5 caracteres');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.conditions;
      control?.setValue('a'.repeat(21));
      control?.markAsTouched();
      expect(component.getFieldError('conditions')).toBe(
        'Máximo 20 caracteres'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.expirationDate;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('expirationDate')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.expirationDate;
      control?.setValue(new Date('2024-02-12'));
      control?.markAsTouched();
      expect(component.getFieldError('expirationDate')).toBe(
        'La fecha debe ser futura'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.batch;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('batch')).toBe('Este campo es requerido');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.batch;
      control?.setValue('ab');
      control?.markAsTouched();
      expect(component.getFieldError('batch')).toBe('Mínimo 3 caracteres');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.batch;
      control?.setValue('a'.repeat(51));
      control?.markAsTouched();
      expect(component.getFieldError('batch')).toBe('Máximo 50 caracteres');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.provider;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('provider')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      initializeComponent();
      expect(component.productForm).toBeDefined();
      const control = component.deliveryTime;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('deliveryTime')).toBe(
        'Este campo es requerido'
      );
    });
  });
});
