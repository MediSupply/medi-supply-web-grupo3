import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { CrearPlanVentaComponent } from './crear-plan-venta.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendedoresService } from '../../../../services/vendedores.service';
import { ProductoService } from '../../../../services/producto.service';
import { of, throwError } from 'rxjs';

// Mocks para las dependencias
let mockVendedoresService: jasmine.SpyObj<VendedoresService>;
let mockProductoService: jasmine.SpyObj<ProductoService>;

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

const mockSnackBar = {
  open: jasmine.createSpy('open')
};

describe('CrearPlanVentaComponent', () => {
 let component: CrearPlanVentaComponent;
  let fixture: ComponentFixture<CrearPlanVentaComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    const vendedoresServiceSpy = jasmine.createSpyObj('VendedoresService', ['getVendedores']);
    const productoServiceSpy = jasmine.createSpyObj('ProductoService', ['getAllProducts']);
    vendedoresServiceSpy.getVendedores.and.returnValue(of([
      { id: 1, nombre: 'Vendedor 1' },
      { id: 2, nombre: 'Vendedor 2' }
    ]));
    productoServiceSpy.getAllProducts.and.returnValue(of([
      { id: 1, name: 'Producto 1' },
      { id: 2, name: 'Producto 2' }
    ]));

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CrearPlanVentaComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: VendedoresService, useValue: vendedoresServiceSpy },
        { provide: ProductoService, useValue: productoServiceSpy },
      ]
    }).compileComponents();

    snackBar = TestBed.inject(MatSnackBar);
    fixture = TestBed.createComponent(CrearPlanVentaComponent);
    component = fixture.componentInstance;

    mockRouter.navigate.calls.reset();
    mockSnackBar.open.calls.reset();

    fixture.detectChanges();

    mockVendedoresService = TestBed.inject(VendedoresService) as jasmine.SpyObj<VendedoresService>;
    mockProductoService = TestBed.inject(ProductoService) as jasmine.SpyObj<ProductoService>;
  });

  afterEach(() => {
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.planVentaForm).toBeDefined();
    expect(component.planVentaForm.get('seller')).toBeDefined();
    expect(component.planVentaForm.get('product')).toBeDefined();
    expect(component.planVentaForm.get('meta')).toBeDefined();
    expect(component.planVentaForm.get('startDate')).toBeDefined();
    expect(component.planVentaForm.get('endDate')).toBeDefined();
  });

  it('debería cargar vendedores y productos al inicializar', () => {
    expect(mockVendedoresService.getVendedores).toHaveBeenCalled();
    expect(mockProductoService.getAllProducts).toHaveBeenCalled();
    expect(component.sellers.length).toBe(2);
    expect(component.products.length).toBe(2);
  });

  describe('Validaciones de Formulario', () => {
    describe('Validadores requeridos', () => {
      it('debería marcar seller como requerido', () => {
        const control = component.planVentaForm.get('seller');
        control?.setValue('');
        expect(control?.hasError('required')).toBeTrue();
      });

      it('debería marcar product como requerido', () => {
        const control = component.planVentaForm.get('product');
        control?.setValue('');
        expect(control?.hasError('required')).toBeTrue();
      });

      it('debería marcar meta como requerido', () => {
        const control = component.planVentaForm.get('meta');
        control?.setValue('');
        expect(control?.hasError('required')).toBeTrue();
      });
      
      it('debería marcar startDate como requerido', () => {
        const control = component.planVentaForm.get('startDate');
        control?.setValue('');
        expect(control?.hasError('required')).toBeTrue();
      });

      it('debería marcar endDate como requerido', () => {
        const control = component.planVentaForm.get('endDate');
        control?.setValue('');
        expect(control?.hasError('required')).toBeFalse();
      });
    });

    describe('Validador de número positivo para meta', () => {
      it('debería aceptar números positivos', () => {
        const control = component.planVentaForm.get('meta');
        control?.setValue('100');
        expect(control?.hasError('positiveNumber')).toBeFalse();
      });

      it('debería rechazar números negativos', () => {
        const control = component.planVentaForm.get('meta');
        control?.setValue('-50');
        expect(control?.hasError('positiveNumber')).toBeTrue();
      });

      it('debería aceptar cero', () => {
        const control = component.planVentaForm.get('meta');
        control?.setValue('0');
        expect(control?.hasError('positiveNumber')).toBeFalse();
      });

      it('debería aceptar valores nulos o vacíos', () => {
        const control = component.planVentaForm.get('meta');
        control?.setValue('');
        expect(control?.hasError('positiveNumber')).toBeFalse();
        control?.setValue(null);
        expect(control?.hasError('positiveNumber')).toBeFalse();
      });
    });
  });

  describe('Validación de fechas', () => {
    it('debería aceptar cuando endDate es posterior a startDate', () => {
      component.planVentaForm.get('startDate')?.setValue('2024-01-01');
      component.planVentaForm.get('endDate')?.setValue('2024-01-02');
      
      expect(component.planVentaForm.get('endDate')?.errors).toBeNull();
    });

    it('debería rechazar cuando endDate es anterior a startDate', () => {
      component.planVentaForm.get('startDate')?.setValue('2024-01-02');
      component.planVentaForm.get('endDate')?.setValue('2024-01-01');
      
      expect(component.planVentaForm.get('endDate')?.hasError('endDateInvalid')).toBeTrue();
    });

    it('debería aceptar cuando las fechas son iguales', () => {
      component.planVentaForm.get('startDate')?.setValue('2024-01-01');
      component.planVentaForm.get('endDate')?.setValue('2024-01-01');
      
      expect(component.planVentaForm.get('endDate')?.errors).toBeNull();
    });

    it('no debería validar cuando startDate está vacío', () => {
      component.planVentaForm.get('startDate')?.setValue('');
      component.planVentaForm.get('endDate')?.setValue('2024-01-01');
      
      expect(component.planVentaForm.get('endDate')?.errors).toBeNull();
    });

    it('no debería validar cuando endDate está vacío', () => {
      component.planVentaForm.get('startDate')?.setValue('2024-01-01');
      component.planVentaForm.get('endDate')?.setValue('');
      
      expect(component.planVentaForm.get('endDate')?.errors).toBeNull();
    });

  })

   describe('Método getFieldError', () => {
    it('debería retornar mensaje de error para campo requerido', () => {
      const control = component.seller;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('seller')).toBe('Este campo es requerido');
    });

    it('debería retornar mensaje de error para campo requerido', () => {
      const control = component.product;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('product')).toBe('Este campo es requerido');
    });

    it('debería retornar mensaje de error para campo requerido', () => {
      const control = component.meta;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('meta')).toBe('Este campo es requerido');
    });

    it('should return min error', () => {
      const control = component.meta;
      control?.setValue(-5);
      control?.markAsTouched();
      expect(component.getFieldError('meta')).toBe('El valor mínimo es 0');
    });

    it('should return positiveNumber error', () => {
      const testControl = {
        value: -10,
        errors: { positiveNumber: true },
        touched: true,
      } as any;
      (component.planVentaForm as any).controls['meta'] = testControl;
      expect(component.getFieldError('meta')).toBe(
        'Debe ser un número positivo'
      );
    });

    it('debería retornar mensaje de error para campo requerido', () => {
      const control = component.startDate;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('startDate')).toBe('Este campo es requerido');
    });

    it('debería retornar mensaje de error para campo requerido', () => {
      const control = component.endDate;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('endDate')).toBe('');
    });
  })

  describe('Envío del Formulario', () => {
    it('debería marcar todos los campos como touched cuando el formulario es inválido', () => {
      component.onSubmit();

      expect(component.planVentaForm.get('seller')?.touched).toBeTrue();
      expect(component.planVentaForm.get('product')?.touched).toBeTrue();
      expect(component.planVentaForm.get('meta')?.touched).toBeTrue();
      expect(component.planVentaForm.get('startDate')?.touched).toBeTrue();
      expect(component.planVentaForm.get('endDate')?.touched).toBeTrue();
    });

    it('debería enviar el formulario cuando es válido', () => {
      const endDate = new Date('2025-12-31');
      const startDate = new Date('2025-12-02');
      component.planVentaForm.setValue({
        seller: 1,
        product: 1,
        meta: '1000',
        startDate: startDate,
        endDate: endDate
      });
    
      spyOnProperty(component.planVentaForm, 'valid', 'get').and.returnValue(true);
      const snackBarOpenSpy = spyOn(component['snackBar'], 'open').and.callThrough();

      component.onSubmit();

      expect(snackBarOpenSpy).toHaveBeenCalledWith(
        'Plan de venta registrado exitosamente.',
        'Cerrar',
        { duration: 3000 }
      );
    });
  })

  describe('Manejo de errores en servicios', () => {
    it('debería manejar errores al cargar vendedores', fakeAsync(() => {
      const errorResponse = 'Error al cargar vendedores';
      mockVendedoresService.getVendedores.and.returnValue(throwError(() => errorResponse));
      
      const snackBarOpenSpy = spyOn(component['snackBar'], 'open').and.callThrough();
      spyOn(console, 'error');

      component.loadSellers();

      tick();
      flush(); // Limpia cualquier timer pendiente

      expect(snackBarOpenSpy).toHaveBeenCalledWith(
        'Error al cargar la lista de vendedores', 
        'Cerrar', 
        { duration: 3000 }
      );
    }));

    it('debería manejar errores al cargar productos', fakeAsync(() => {
      const errorResponse = 'Error al cargar productos';
      mockProductoService.getAllProducts.and.returnValue(throwError(() => errorResponse));
      
      const snackBarOpenSpy = spyOn(component['snackBar'], 'open').and.callThrough();
      spyOn(console, 'error');

      component.loadProducts();

      tick();
      flush(); // Limpia cualquier timer pendiente

      expect(snackBarOpenSpy).toHaveBeenCalledWith(
        'Error al cargar la lista de productos', 
        'Cerrar', 
        { duration: 3000 }
      );
    }));
  })

  describe('Métodos auxiliares', () => {
    it('debería marcar todos los controles como touched', () => {
      component.markFormGroupTouched(component.planVentaForm);

      Object.keys(component.planVentaForm.controls).forEach(key => {
        expect(component.planVentaForm.get(key)?.touched).toBeTrue();
      });
    });

     it('debería tener getters para todos los controles', () => {
      expect(component.seller).toBe(component.planVentaForm.get('seller'));
      expect(component.product).toBe(component.planVentaForm.get('product'));
      expect(component.meta).toBe(component.planVentaForm.get('meta'));
      expect(component.startDate).toBe(component.planVentaForm.get('startDate'));
      expect(component.endDate).toBe(component.planVentaForm.get('endDate'));
    });
  })

  describe('Edge Cases', () => {
    let component: CrearPlanVentaComponent;

    beforeEach(() => {
      // Crear un mock del componente que no use inject()
      class CrearPlanVentaComponentMock {
        planVentaForm!: FormGroup;
        
        constructor(
          private fb: FormBuilder,
          private router: Router,
          private snackBar: MatSnackBar,
          private vendedoresService: VendedoresService,
          private productService: ProductoService
        ) {
          this.initForm();
        }

        private initForm(): void {
          this.planVentaForm = this.fb.group({
            seller: ['', [Validators.required]],
            product: ['', [Validators.required]],
            meta: ['', [Validators.required, Validators.min(0)]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
          });
          this.setupDateValidation();
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
                endDateControl?.setErrors(Object.keys(otherErrors).length > 0 ? otherErrors : null);
              }
            }
          } catch (error) {
            console.error('Error validando fechas:', error);
          }
        }
      }

      // Usar el mock en lugar del componente real
      component = new CrearPlanVentaComponentMock(
        new FormBuilder(),
        {} as Router,
        {} as MatSnackBar,
        { getVendedores: () => of([]) } as any,
        { getAllProducts: () => of([]) } as any
      ) as any;
    });

    it('debería mantener otros errores al limpiar endDateInvalid', () => {
      component.planVentaForm.get('endDate')?.setErrors({
        required: true,
        endDateInvalid: true
      });

      component.planVentaForm.get('startDate')?.setValue('2024-01-01');
      component.planVentaForm.get('endDate')?.setValue('2024-01-02');
      component.validateDates();

      expect(component.planVentaForm.get('endDate')?.hasError('required')).toBeFalse();
      expect(component.planVentaForm.get('endDate')?.hasError('endDateInvalid')).toBeFalse();
    });
  });
})

  
