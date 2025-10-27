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

describe('RegistroProveedorComponent', () => {
  let component: RegistroProveedorComponent;
  let fixture: ComponentFixture<RegistroProveedorComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form = component.proveedorForm;
    expect(form.value).toEqual({
      nombre: '',
      nit: '',
      pais: '',
      direccion: '',
      telefono: '',
      correo: '',
      contrasena: '',
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
  });

  it('should submit valid form and reset it', () => {
    spyOn(window, 'alert');
    component.proveedorForm.setValue({
      nombre: 'Proveedor Test',
      nit: 123456,
      pais: 'Colombia',
      direccion: 'Calle 12345',
      telefono: '1234567',
      correo: 'test@test.com',
      contrasena: 'abcdef',
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith(
      'Proveedor registrado exitosamente'
    );
    expect(component.proveedorForm.pristine).toBeTrue();
    expect(component.proveedorForm.value).toEqual({
      nombre: null,
      nit: null,
      pais: null,
      direccion: null,
      telefono: null,
      correo: null,
      contrasena: null,
    });
  });

  it('should mark form as touched when submitting invalid form', () => {
    component.proveedorForm.setValue({
      nombre: '',
      nit: '',
      pais: '',
      direccion: '',
      telefono: '',
      correo: '',
      contrasena: '',
    });

    component.onSubmit();
    expect(component.proveedorForm.touched).toBeTrue();
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

    it('should return minlength error', () => {
      const control = component.nombre;
      control?.setValue('abc');
      control?.markAsTouched();
      expect(component.getFieldError('nombre')).toBe('Mínimo 5 caracteres');
    });

    it('should return maxlength error', () => {
      const control = component.telefono;
      control?.setValue('12345678901'); // 11 caracteres
      control?.markAsTouched();
      expect(component.getFieldError('telefono')).toBe('Máximo 10 caracteres');
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

    it('should return pattern error', () => {
      const testControl = { errors: { pattern: true }, touched: true } as any;
      (component.proveedorForm as any).controls['testPattern'] = testControl;
      expect(component.getFieldError('testPattern')).toBe('Formato inválido');
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

    it('should return pastDate error', () => {
      // Simulamos un control con el error pastDate
      const controlName = 'fecha';
      (component.proveedorForm as any).controls[controlName] = {
        errors: { pastDate: true },
        touched: true,
      };
      expect(component.getFieldError(controlName)).toBe(
        'La fecha debe ser futura'
      );
    });

    it('should return empty string if no errors', () => {
      const control = component.nombre;
      control?.setValue('Proveedor Correcto');
      control?.markAsTouched();
      expect(component.getFieldError('nombre')).toBe('');
    });
  });
});
