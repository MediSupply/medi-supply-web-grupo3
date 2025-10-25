import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { RegistroVendedorComponent } from './registro-vendedor.component';

describe('RegistroVendedorComponent', () => {
  let component: RegistroVendedorComponent;
  let fixture: ComponentFixture<RegistroVendedorComponent>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegistroVendedorComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroVendedorComponent);
    component = fixture.componentInstance;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.vendedorForm).toBeDefined();
    expect(component.vendedorForm.get('nombre')?.value).toBe('Juan Pérez');
    expect(component.vendedorForm.get('pais')?.value).toBe(0);
    expect(component.vendedorForm.get('zona')?.value).toBe(1);
    expect(component.vendedorForm.get('rutaVisitas')?.value).toBe(
      'Cliente A, Cliente B, Cliente C'
    );
    expect(component.vendedorForm.get('correo')?.value).toBe(
      'juan.perez@email.com'
    );
    expect(component.vendedorForm.get('contrasena')?.value).toBe('password123');
  });

  it('should have correct paises array', () => {
    expect(component.paises).toEqual([
      { id: 0, value: 'Colombia' },
      { id: 1, value: 'Chile' },
      { id: 2, value: 'Peru' },
    ]);
  });

  it('should have correct zonas array', () => {
    expect(component.zonas).toEqual([
      { id: 1, value: 'Zona Norte' },
      { id: 2, value: 'Zona Sur' },
      { id: 3, value: 'Zona Centro' },
      { id: 4, value: 'Zona Oriente' },
      { id: 5, value: 'Zona Occidente' },
    ]);
  });

  it('should validate alphabetic names correctly', () => {
    const nombreControl = component.vendedorForm.get('nombre');

    // Valid names
    nombreControl?.setValue('Juan Pérez');
    expect(nombreControl?.valid).toBeTruthy();

    nombreControl?.setValue('María José');
    expect(nombreControl?.valid).toBeTruthy();

    // Invalid names
    nombreControl?.setValue('Juan123');
    expect(nombreControl?.valid).toBeFalsy();

    nombreControl?.setValue('Juan@Pérez');
    expect(nombreControl?.valid).toBeFalsy();
  });

  it('should validate email format correctly', () => {
    const correoControl = component.vendedorForm.get('correo');

    // Valid emails
    correoControl?.setValue('test@email.com');
    expect(correoControl?.valid).toBeTruthy();

    correoControl?.setValue('user.name@domain.co');
    expect(correoControl?.valid).toBeTruthy();

    // Invalid emails
    correoControl?.setValue('invalid-email');
    expect(correoControl?.valid).toBeFalsy();

    correoControl?.setValue('test@');
    expect(correoControl?.valid).toBeFalsy();
  });

  it('should validate password format correctly', () => {
    const contrasenaControl = component.vendedorForm.get('contrasena');

    // Valid passwords
    contrasenaControl?.setValue('password123');
    expect(contrasenaControl?.valid).toBeTruthy();

    contrasenaControl?.setValue('user12345');
    expect(contrasenaControl?.valid).toBeTruthy();

    // Invalid passwords
    contrasenaControl?.setValue('password'); // No numbers
    expect(contrasenaControl?.valid).toBeFalsy();

    contrasenaControl?.setValue('12345678'); // No letters
    expect(contrasenaControl?.valid).toBeFalsy();

    contrasenaControl?.setValue('pass123'); // Too short
    expect(contrasenaControl?.valid).toBeFalsy();
  });

  it('should validate ruta de visitas correctly', () => {
    const rutaControl = component.vendedorForm.get('rutaVisitas');

    // Valid routes
    rutaControl?.setValue('Cliente A, Cliente B');
    expect(rutaControl?.valid).toBeTruthy();

    rutaControl?.setValue('Cliente A');
    expect(rutaControl?.valid).toBeTruthy();

    rutaControl?.setValue('Cliente A; Cliente B');
    expect(rutaControl?.valid).toBeTruthy();

    // Invalid routes
    rutaControl?.setValue('');
    expect(rutaControl?.valid).toBeFalsy();

    rutaControl?.setValue('   '); // Only spaces
    expect(rutaControl?.valid).toBeFalsy();
  });

  it('should show correct error messages for required fields', () => {
    const nombreControl = component.vendedorForm.get('nombre');
    const paisControl = component.vendedorForm.get('pais');
    const zonaControl = component.vendedorForm.get('zona');
    const rutaControl = component.vendedorForm.get('rutaVisitas');

    // Test nombre error
    nombreControl?.setValue('');
    nombreControl?.markAsTouched();
    expect(component.getFieldError('nombre')).toBe('Este campo es requerido');

    // Test pais error
    paisControl?.setValue('');
    paisControl?.markAsTouched();
    expect(component.getFieldError('pais')).toBe('Debe seleccionar un país.');

    // Test zona error
    zonaControl?.setValue('');
    zonaControl?.markAsTouched();
    expect(component.getFieldError('zona')).toBe(
      'Debe seleccionar una zona asignada.'
    );

    // Test ruta error
    rutaControl?.setValue('');
    rutaControl?.markAsTouched();
    expect(component.getFieldError('rutaVisitas')).toBe(
      'Debe ingresar la ruta de visitas.'
    );
  });

  it('should show correct error messages for invalid formats', () => {
    const nombreControl = component.vendedorForm.get('nombre');
    const correoControl = component.vendedorForm.get('correo');
    const contrasenaControl = component.vendedorForm.get('contrasena');

    // Test alphabetic error
    nombreControl?.setValue('Juan123');
    nombreControl?.markAsTouched();
    expect(component.getFieldError('nombre')).toBe(
      'Solo se permiten caracteres alfabéticos y espacios'
    );

    // Test email error
    correoControl?.setValue('invalid-email');
    correoControl?.markAsTouched();
    expect(component.getFieldError('correo')).toBe(
      'Formato de correo inválido'
    );

    // Test password error
    contrasenaControl?.setValue('password');
    contrasenaControl?.markAsTouched();
    expect(component.getFieldError('contrasena')).toBe(
      'La contraseña debe tener al menos 8 caracteres e incluir letras y números'
    );
  });

  it('should handle cancel action', () => {
    spyOn(component as any, 'createForm').and.returnValue(
      component.vendedorForm
    );

    component.onCancel();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/registro']);
  });

  it('should have correct getters for form controls', () => {
    expect(component.nombre).toBe(component.vendedorForm.get('nombre'));
    expect(component.pais).toBe(component.vendedorForm.get('pais'));
    expect(component.zona).toBe(component.vendedorForm.get('zona'));
    expect(component.rutaVisitas).toBe(
      component.vendedorForm.get('rutaVisitas')
    );
    expect(component.correo).toBe(component.vendedorForm.get('correo'));
    expect(component.contrasena).toBe(component.vendedorForm.get('contrasena'));
  });

  it('should mark all form controls as touched when form is invalid', () => {
    const markAsTouchedSpy = spyOn(
      component.vendedorForm.get('nombre')!,
      'markAsTouched'
    );

    component.vendedorForm.get('nombre')?.setValue('');
    component.onSubmit();

    expect(markAsTouchedSpy).toHaveBeenCalled();
  });

  it('should initialize with showForm as true', () => {
    expect(component.showForm).toBeTruthy();
  });

  it('should initialize with cargando as false', () => {
    expect(component.cargando).toBeFalsy();
  });

  it('should handle form submission with loader', done => {
    component.onSubmit();

    expect(component.cargando).toBeTruthy();

    setTimeout(() => {
      expect(component.cargando).toBeFalsy();
      done();
    }, 1600);
  });
});
