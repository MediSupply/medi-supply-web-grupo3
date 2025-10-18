import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, NEVER } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { RegistrarUsuarioComponent } from './registrar-usuario.component';
import { AuthService } from '../../services/auth.service';

describe('RegistrarUsuarioComponent', () => {
  let component: RegistrarUsuarioComponent;
  let fixture: ComponentFixture<RegistrarUsuarioComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);

    await TestBed.configureTestingModule({
      imports: [RegistrarUsuarioComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarUsuarioComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización del componente', () => {
    it('debería inicializar con valores por defecto', () => {
      component.user = {
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        password: 'password123',
        role: 'USER'
      }
      expect(component.mensaje).toBe('');
      expect(component.cargando).toBeFalse();
    });
  });

  describe('Validación de email', () => {
    it('debería mostrar error para email inválido', () => {
      component.user.email = 'email-invalido';
      const form = { invalid: false } as any;
      
      component.registrarUsuario(form);
      
      expect(component.mensaje).toBe('El correo electrónico no tiene un formato válido ⚠️');
    });

    it('debería aceptar email válido', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      authService.signup.and.returnValue(of({}));
      
      component.registrarUsuario(form);
      
      expect(authService.signup).toHaveBeenCalledWith(component.user);
    });
  });

  describe('Validación de contraseña', () => {
    it('debería mostrar error para contraseña sin números', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'sololetras';
      const form = { invalid: false } as any;
      
      component.registrarUsuario(form);
      
      expect(component.mensaje).toBe('La contraseña debe tener al menos 8 caracteres e incluir letras y números ⚠️');
    });

    it('debería mostrar error para contraseña muy corta', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'abc123';
      const form = { invalid: false } as any;
      
      component.registrarUsuario(form);
      
      expect(component.mensaje).toBe('La contraseña debe tener al menos 8 caracteres e incluir letras y números ⚠️');
    });

    it('debería aceptar contraseña válida', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      authService.signup.and.returnValue(of({}));
      
      component.registrarUsuario(form);
      
      expect(authService.signup).toHaveBeenCalledWith(component.user);
    });
  });

  describe('Registro exitoso de usuario', () => {
    it('debería registrar usuario exitosamente', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      const mockResponse = { id: 1, message: 'Usuario creado' };
      authService.signup.and.returnValue(of(mockResponse));
      
      component.registrarUsuario(form);
      
      expect(authService.signup).toHaveBeenCalledWith(component.user);
      expect(component.cargando).toBeFalse();
      expect(component.mensaje).toBe('Usuario registrado correctamente ✅');
    });

    it('debería establecer cargando en true durante el registro', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      // Usar un observable que no se resuelva inmediatamente
      authService.signup.and.returnValue(NEVER);
      
      component.registrarUsuario(form);
      
      expect(component.cargando).toBeTrue();
    });
  });

  describe('Manejo de errores en registro', () => {
    it('debería manejar error 409 (email ya registrado)', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      const error = { status: 409 };
      authService.signup.and.returnValue(throwError(() => error));
      
      component.registrarUsuario(form);
      
      expect(component.cargando).toBeFalse();
      expect(component.mensaje).toBe('El correo electrónico ya está registrado ❌');
    });

    it('debería manejar otros errores de registro', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      const error = { status: 500 };
      authService.signup.and.returnValue(throwError(() => error));
      
      component.registrarUsuario(form);
      
      expect(component.cargando).toBeFalse();
      expect(component.mensaje).toBe('Error al registrar el usuario ❌');
    });
  });

  describe('Validación de formulario', () => {
    it('debería mostrar error para formulario inválido', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: true } as any;
      
      component.registrarUsuario(form);
      
      expect(component.mensaje).toBe('Por favor completa/valida todos los campos obligatorios ⚠️');
    });
  });

  describe('Renderizado del template', () => {
    it('debería renderizar el formulario con todos los campos', () => {
      const nombreInput = debugElement.query(By.css('input[name="nombre"]'));
      const correoInput = debugElement.query(By.css('input[name="correo"]'));
      const passwordInput = debugElement.query(By.css('input[name="password"]'));
      const rolSelect = debugElement.query(By.css('select[name="rol"]'));
      const submitButton = debugElement.query(By.css('button[type="submit"]'));
      
      expect(nombreInput).toBeTruthy();
      expect(correoInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(rolSelect).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    it('debería mostrar el mensaje cuando existe', () => {
      component.mensaje = 'Mensaje de prueba';
      fixture.detectChanges();
      
      const mensajeElement = debugElement.query(By.css('.message'));
      expect(mensajeElement.nativeElement.textContent).toBe('Mensaje de prueba');
    });

    it('debería mostrar el logo', () => {
      const logoImg = debugElement.query(By.css('img[alt="Logo MediSUPPLY"]'));
      expect(logoImg).toBeTruthy();
      expect(logoImg.nativeElement.src).toContain('/images/logo-meddy-supply.png');
    });
  });
});
