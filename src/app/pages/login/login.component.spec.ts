import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NEVER, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'isAuthenticated',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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
        email: 'juan@ejemplo.com',
        password: 'password123',
      };
      expect(component.mensaje).toBe('');
      expect(component.cargando).toBeFalse();
      expect(component.showPassword).toBeFalse();
    });

    it('redirige si el usuario ya está autenticado', () => {
      authService.isAuthenticated.and.returnValue(true);
      component.ngOnInit();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('no redirige si el usuario no está autenticado', () => {
      authService.isAuthenticated.and.returnValue(false);
      component.ngOnInit();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('togglePassword', () => {
    it('debería alternar showPassword', () => {
      component.showPassword = false;
      component.togglePassword();
      expect(component.showPassword).toBeTrue();

      component.togglePassword();
      expect(component.showPassword).toBeFalse();
    });
  });

  describe('Validación de email', () => {
    it('debería mostrar error para email inválido', () => {
      component.user.email = 'email-invalido';
      const form = { invalid: false } as any;

      component.login(form);

      expect(component.mensaje).toBe(
        'El correo electrónico no tiene un formato válido ⚠️'
      );
    });

    it('debería aceptar email válido', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      authService.login.and.returnValue(of({}));

      component.login(form);

      expect(authService.login).toHaveBeenCalledWith(
        component.user.email,
        component.user.password
      );
    });

    it('debería mostrar mensaje si el form es inválido', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: true } as any;

      component.login(form);

      expect(component.mensaje).toBe('Todos los campos son obligatorios');
    });
  });

  describe('Login exitoso de usuario', () => {
    it('debería login usuario exitosamente', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      const mockResponse = { id: 1, message: 'Usuario creado' };
      authService.login.and.returnValue(of(mockResponse));

      component.login(form);

      expect(authService.login).toHaveBeenCalledWith(
        component.user.email,
        component.user.password
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('debería establecer cargando en true durante el login', () => {
      component.user.email = 'juan@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      authService.login.and.returnValue(NEVER);

      component.login(form);

      expect(component.cargando).toBeTrue();
    });
  });

  describe('Manejo de errores en login', () => {
    it('Usuario no existe', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      const error = { status: 404 };
      authService.login.and.returnValue(throwError(() => error));

      component.login(form);

      expect(component.mensaje).toBe('El usuario no existe');
    });

    it('Contraseña incorrecta', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      const error = { status: 401 };
      authService.login.and.returnValue(throwError(() => error));

      component.login(form);

      expect(component.mensaje).toBe('Contraseña incorrecta');
    });

    it('debería manejar otros errores de login', () => {
      component.user.email = 'test@ejemplo.com';
      component.user.password = 'password123';
      const form = { invalid: false } as any;
      const error = { status: 500 };
      authService.login.and.returnValue(throwError(() => error));

      component.login(form);

      expect(component.mensaje).toBe('Error al iniciar sesion');
    });
  });

  describe('toRegister', () => {
    it('debería navegar a /signup', () => {
      component.toRegister();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/signup']);
    });
  });
});
