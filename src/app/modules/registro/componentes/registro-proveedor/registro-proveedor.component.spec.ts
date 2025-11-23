import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroProveedorComponent } from './registro-proveedor.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProveedoresService } from '../../../../services/proveedores.service';
import { of } from 'rxjs';

describe('RegistroProveedorComponent', () => {
  let component: RegistroProveedorComponent;
  let fixture: ComponentFixture<RegistroProveedorComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let proveedoresServiceSpy: jasmine.SpyObj<ProveedoresService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    proveedoresServiceSpy = jasmine.createSpyObj('ProveedoresService', [
      'registrarProveedor',
    ]);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        RegistroProveedorComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ProveedoresService, useValue: proveedoresServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.proveedorForm;
    expect(form.value).toEqual({
      nombre: 'Proveedor Ejemplo S.A.',
      nit: '123456789',
      pais: 0,
      direccion: 'Calle 123 #45-67',
      telefono: '6012345678',
      correo: 'contacto@proveedor.com',
      contrasena: '123',
    });
  });

  it('should validate positiveNumberValidator', () => {
    const control: any = { value: -5 };
    expect(component['positiveNumberValidator'](control)).toEqual({
      positiveNumber: true,
    });

    control.value = 0;
    expect(component['positiveNumberValidator'](control)).toBeNull();

    control.value = 10;
    expect(component['positiveNumberValidator'](control)).toBeNull();

    control.value = null;
    expect(component['positiveNumberValidator'](control)).toBeNull();

    control.value = '';
    expect(component['positiveNumberValidator'](control)).toBeNull();
  });

  it('should validate numericOnlyValidator', () => {
    const control: any = { value: '123abc' };
    expect(component['numericOnlyValidator'](control)).toEqual({
      numericOnly: true,
    });

    control.value = '123';
    expect(component['numericOnlyValidator'](control)).toBeNull();

    control.value = '6012345678';
    expect(component['numericOnlyValidator'](control)).toBeNull();

    control.value = null;
    expect(component['numericOnlyValidator'](control)).toBeNull();

    control.value = '';
    expect(component['numericOnlyValidator'](control)).toBeNull();
  });

  it('should submit valid form and call service', () => {
    const mockResponse = { success: true };
    proveedoresServiceSpy.registrarProveedor.and.returnValue(of(mockResponse));

    component.proveedorForm.setValue({
      nombre: 'Proveedor Test',
      nit: '123456789',
      pais: 0,
      direccion: 'Calle 12345',
      telefono: '6012345678',
      correo: 'test@test.com',
      contrasena: 'password123',
    });

    component.onSubmit();

    expect(proveedoresServiceSpy.registrarProveedor).toHaveBeenCalledWith({
      nit: 123456789,
      nombre: 'Proveedor Test',
      pais: 'colombia',
      direccion: 'Calle 12345',
      telefono: 6012345678,
      email: 'test@test.com',
    });
  });

  it('should reset form and navigate on cancel', () => {
    component.onCancel();
    expect(component.proveedorForm.pristine).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard/registro']);
  });

  describe('getFieldError', () => {
    it('should return required error', () => {
      const control = component.nombre;
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('nombre')).toBe('Este campo es requerido');
    });

    it('should return email format error', () => {
      const control = component.correo;
      control?.setValue('invalid-email');
      control?.markAsTouched();
      expect(component.getFieldError('correo')).toBe(
        'Formato de correo electrónico inválido'
      );
    });

    it('should return minlength error', () => {
      const control = component.telefono;
      control?.setValue('123');
      control?.markAsTouched();
      expect(component.getFieldError('telefono')).toBe('Mínimo 7 dígitos');
    });

    it('should return maxlength error', () => {
      const control = component.telefono;
      control?.setValue('12345678901'); // 11 caracteres
      control?.markAsTouched();
      expect(component.getFieldError('telefono')).toBe('Máximo 10 dígitos');
    });

    it('should return min error', () => {
      const control = component.nit;
      control?.setValue(-5);
      control?.markAsTouched();
      expect(component.getFieldError('nit')).toBe('El valor mínimo es 0');
    });

    it('should return max error', () => {
      const control = component.nit;
      control?.setValue(10000000001);
      control?.markAsTouched();
      expect(component.getFieldError('nit')).toBe(
        'El valor máximo es 10000000000'
      );
    });

    it('should return numericOnly error', () => {
      // Crear un control de prueba con solo el error numericOnly
      const testControl = {
        errors: { numericOnly: true },
        touched: true,
      } as any;
      (component.proveedorForm as any).controls['testNumeric'] = testControl;
      expect(component.getFieldError('testNumeric')).toBe(
        'El teléfono solo debe contener números'
      );
    });

    it('should return positiveNumber error', () => {
      const testControl = {
        value: -10,
        errors: { positiveNumber: true },
        touched: true,
      } as any;
      (component.proveedorForm as any).controls['test'] = testControl;
      expect(component.getFieldError('test')).toBe(
        'Debe ser un número positivo'
      );
    });

    it('should return empty string if no errors', () => {
      const control = component.nombre;
      control?.setValue('Proveedor Correcto');
      control?.markAsTouched();
      expect(component.getFieldError('nombre')).toBe('');
    });

    it('should return empty string if field is not touched', () => {
      const control = component.nombre;
      control?.setValue('');
      expect(component.getFieldError('nombre')).toBe('');
    });
  });

  describe('onTelefonoKeyPress', () => {
    it('should prevent non-numeric characters', () => {
      const event = {
        key: 'a',
        which: 97,
        keyCode: 97,
        preventDefault: jasmine.createSpy('preventDefault'),
      } as any;
      component.onTelefonoKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should allow numeric characters', () => {
      const event = {
        key: '5',
        which: 53,
        keyCode: 53,
        preventDefault: jasmine.createSpy('preventDefault'),
      } as any;
      component.onTelefonoKeyPress(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should allow control characters', () => {
      const event = {
        key: 'Backspace',
        which: 8,
        keyCode: 8,
        preventDefault: jasmine.createSpy('preventDefault'),
      } as any;
      component.onTelefonoKeyPress(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('Getters', () => {
    it('should return form controls', () => {
      expect(component.nombre).toBeTruthy();
      expect(component.nit).toBeTruthy();
      expect(component.pais).toBeTruthy();
      expect(component.direccion).toBeTruthy();
      expect(component.telefono).toBeTruthy();
      expect(component.correo).toBeTruthy();
      expect(component.contrasena).toBeTruthy();
    });
  });

  describe('Form mapping', () => {
    it('should map pais ID to lowercase country name', () => {
      proveedoresServiceSpy.registrarProveedor.and.returnValue(of({}));

      component.proveedorForm.setValue({
        nombre: 'Test',
        nit: '123456789',
        pais: 1, // Chile
        direccion: 'Test',
        telefono: '6012345678',
        correo: 'test@test.com',
        contrasena: '123',
      });

      component.onSubmit();

      expect(proveedoresServiceSpy.registrarProveedor).toHaveBeenCalledWith(
        jasmine.objectContaining({
          pais: 'chile',
        })
      );
    });
  });
});
