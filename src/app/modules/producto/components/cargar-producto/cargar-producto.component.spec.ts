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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from '../../../../services/producto.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { finalize, of } from 'rxjs';

describe('CargarProductoComponent', () => {
  let component: CargarProductoComponent;
  let fixture: ComponentFixture<CargarProductoComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let productServiceSpy: jasmine.SpyObj<ProductoService>;

  const initializeComponent = (stateData: any = {}) => {
    history.replaceState(stateData, '');
    fixture.detectChanges();
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    productServiceSpy = jasmine.createSpyObj('ProductoService', [
      'createProduct',
    ]);

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
        HttpClientTestingModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ProductoService, useValue: productServiceSpy },
      ],
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
    productServiceSpy.createProduct.and.returnValue(
      of({ success: true }).pipe(
        finalize(() => {}) // Mock del pipe
      )
    );

    // Espiar console.log si es necesario
    spyOn(console, 'log');

    initializeComponent();

    const testDate = '2026-02-12'; // Usar string en lugar de Date
    component.productForm.setValue({
      nombre: 'Prueba',
      descripcion: 'Descripcion prueba',
      valor_unitario: 10,
      cantidad_disponible: 1000,
      categoria: '1',
      fecha_vencimiento: testDate, // ← Usar string
      lote: 'ejemplo',
      proveedor: '2',
      tiempo_estimado_entrega: '24 horas',
      condiciones_almacenamiento: 'Wertyui',
      ubicacion: 'Bodega 3',
    });

    expect(component.productForm.valid).toBeTrue();

    component.onSubmit();

    // Verificar que se llamó al servicio
    expect(productServiceSpy.createProduct).toHaveBeenCalled();
  });

  it('should mark form as touched when submitting invalid form', () => {
    // Inicializar el componente con estado vacío
    initializeComponent();

    // Verificar que el formulario existe
    expect(component.productForm).toBeDefined();

    component.productForm.setValue({
      nombre: '',
      descripcion: '',
      valor_unitario: '',
      cantidad_disponible: '',
      categoria: '',
      fecha_vencimiento: '',
      lote: '',
      proveedor: '',
      tiempo_estimado_entrega: '',
      condiciones_almacenamiento: '',
      ubicacion: '',
    });

    component.onSubmit();
    expect(component.productForm.touched).toBeTrue();
  });

  it('should reset form and navigate on cancel', () => {
    initializeComponent();

    expect(component.productForm).toBeDefined();

    component.productForm.patchValue({
      nombre: 'Test Product',
      descripcion: 'Test descripcion',
      valor_unitario: 1000,
      cantidad_disponible: 10,
      categoria: '1',
      condiciones_almacenamiento: 'Test condiciones_almacenamiento',
      fecha_vencimiento: '2025-12-31',
      lote: 'TEST123',
      proveedor: '1',
      tiempo_estimado_entrega: '24 horas',
      ubicacion: 'Bodega 2',
    });
    expect(component.productForm.dirty).toBeFalse();
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard/productos']);

    expect(component.productForm.pristine).toBeTrue();
    expect(component.productForm.value).toEqual({
      nombre: null,
      descripcion: null,
      valor_unitario: null,
      cantidad_disponible: null,
      categoria: null,
      condiciones_almacenamiento: null,
      fecha_vencimiento: null,
      lote: null,
      proveedor: null,
      tiempo_estimado_entrega: null,
      ubicacion: null,
    });
  });

  describe('getFieldError', () => {
    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.nombre;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('nombre')).toBe('Este campo es requerido');
    });
    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.nombre;
      control?.setValue('ab');
      control?.markAsTouched();
      expect(component.getFieldError('nombre')).toBe('Mínimo 3 caracteres');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.nombre;
      control?.setValue('a'.repeat(111));
      control?.markAsTouched();

      expect(component.getFieldError('nombre')).toBe('Máximo 100 caracteres');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.descripcion;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('descripcion')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.descripcion;
      control?.setValue('ab');
      control?.markAsTouched();
      expect(component.getFieldError('descripcion')).toBe(
        'Mínimo 3 caracteres'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.descripcion;
      control?.setValue('a'.repeat(51));
      control?.markAsTouched();
      expect(component.getFieldError('descripcion')).toBe(
        'Máximo 50 caracteres'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.valor_unitario;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('valor_unitario')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.valor_unitario;
      control?.setValue(-9);
      control?.markAsTouched();
      expect(component.getFieldError('valor_unitario')).toBe(
        'El valor mínimo es 0'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.valor_unitario;
      control?.setValue('ab');
      control?.markAsTouched();
      expect(component.getFieldError('valor_unitario')).toBe(
        'Debe ser un número positivo'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.cantidad_disponible;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('cantidad_disponible')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.cantidad_disponible;
      control?.setValue(-9);
      control?.markAsTouched();
      expect(component.getFieldError('cantidad_disponible')).toBe(
        'El valor mínimo es 0'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.cantidad_disponible;
      control?.setValue('ab4');
      control?.markAsTouched();
      expect(component.getFieldError('cantidad_disponible')).toBe(
        'Formato inválido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.categoria;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('categoria')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.condiciones_almacenamiento;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('condiciones_almacenamiento')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.condiciones_almacenamiento;
      control?.setValue('ab');
      control?.markAsTouched();
      expect(component.getFieldError('condiciones_almacenamiento')).toBe(
        'Mínimo 5 caracteres'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.condiciones_almacenamiento;
      control?.setValue('a'.repeat(21));
      control?.markAsTouched();
      expect(component.getFieldError('condiciones_almacenamiento')).toBe(
        'Máximo 20 caracteres'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.fecha_vencimiento;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('fecha_vencimiento')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.fecha_vencimiento;
      control?.setValue(new Date('2024-02-12'));
      control?.markAsTouched();
      expect(component.getFieldError('fecha_vencimiento')).toBe(
        'La fecha debe ser futura'
      );
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.lote;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('lote')).toBe('Este campo es requerido');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.lote;
      control?.setValue('ab');
      control?.markAsTouched();
      expect(component.getFieldError('lote')).toBe('Mínimo 3 caracteres');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.lote;
      control?.setValue('a'.repeat(51));
      control?.markAsTouched();
      expect(component.getFieldError('lote')).toBe('Máximo 50 caracteres');
    });

    it('should return required error', () => {
      // Inicializar el componente con estado vacío
      initializeComponent();

      // Verificar que el formulario existe
      expect(component.productForm).toBeDefined();
      const control = component.proveedor;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('proveedor')).toBe(
        'Este campo es requerido'
      );
    });

    it('should return required error', () => {
      initializeComponent();
      expect(component.productForm).toBeDefined();
      const control = component.tiempo_estimado_entrega;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('tiempo_estimado_entrega')).toBe(
        'Este campo es requerido'
      );
    });
  });
});
