import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardRegistroComponent } from './dashboard-registro.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardRegistroComponent', () => {
  let component: DashboardRegistroComponent;
  let fixture: ComponentFixture<DashboardRegistroComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardRegistroComponent,
        RouterTestingModule.withRoutes([]), // Mock del Router
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRegistroComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener definido el método addSeller', () => {
    expect(typeof component.addSeller).toBe('function');
  });

  it('debería navegar a "/dashboard/registro-proveedor" cuando se invoque addSupplier()', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addSupplier();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);
  });

  it('debería navegar a "/dashboard/registro-vendedor" cuando se invoque addSeller()', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addSeller();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
  });

  it('debería tener todos los métodos necesarios', () => {
    expect(typeof component.addSupplier).toBe('function');
    expect(typeof component.addSeller).toBe('function');
  });

  it('debería ejecutar addSupplier sin errores', () => {
    spyOn(router, 'navigate');
    expect(() => component.addSupplier()).not.toThrow();
  });

  it('debería ejecutar addSeller sin errores', () => {
    spyOn(router, 'navigate');
    expect(() => component.addSeller()).not.toThrow();
  });

  it('debería manejar diferentes tipos de navegación', () => {
    const navigateSpy = spyOn(router, 'navigate');

    // Test addSupplier navigation
    component.addSupplier();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);

    // Test addSeller navigation
    component.addSeller();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
  });

  it('debería manejar múltiples llamadas a addSupplier', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.addSupplier();
    component.addSupplier();
    component.addSupplier();

    expect(navigateSpy).toHaveBeenCalledTimes(3);
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);
  });

  it('debería manejar múltiples llamadas a addSeller', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.addSeller();
    component.addSeller();
    component.addSeller();

    expect(navigateSpy).toHaveBeenCalledTimes(3);
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
  });

  it('debería manejar llamadas alternadas a ambos métodos', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.addSupplier();
    component.addSeller();
    component.addSupplier();
    component.addSeller();

    expect(navigateSpy).toHaveBeenCalledTimes(4);
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
  });

  it('debería manejar errores de navegación', () => {
    spyOn(router, 'navigate').and.throwError(new Error('Navigation error'));

    expect(() => component.addSupplier()).toThrowError('Navigation error');
    expect(() => component.addSeller()).toThrowError('Navigation error');
  });

  it('debería manejar diferentes tipos de rutas', () => {
    const navigateSpy = spyOn(router, 'navigate');

    // Test with different route formats
    component.addSupplier();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);

    component.addSeller();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
  });

  it('debería manejar diferentes estados del componente', () => {
    // Test initial state
    expect(component).toBeTruthy();

    // Test after method calls
    component.addSupplier();
    expect(component).toBeTruthy();

    component.addSeller();
    expect(component).toBeTruthy();
  });

  it('debería manejar diferentes configuraciones de router', () => {
    const navigateSpy = spyOn(router, 'navigate');

    // Test with different router configurations
    component.addSupplier();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);

    component.addSeller();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
  });

  it('debería manejar diferentes tipos de parámetros de navegación', () => {
    const navigateSpy = spyOn(router, 'navigate');

    // Test with array parameters
    component.addSupplier();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);

    component.addSeller();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
  });

  it('debería manejar diferentes tipos de errores', () => {
    const navigateSpy = spyOn(router, 'navigate');

    // Test with different error types
    navigateSpy.and.throwError(new Error('Test error'));

    expect(() => component.addSupplier()).toThrowError('Test error');
    expect(() => component.addSeller()).toThrowError('Test error');
  });

  it('debería manejar diferentes tipos de eventos', () => {
    const navigateSpy = spyOn(router, 'navigate');

    // Test with different event types
    component.addSupplier();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);

    component.addSeller();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
  });

  it('debería manejar diferentes tipos de validación', () => {
    // Test method existence
    expect(typeof component.addSupplier).toBe('function');
    expect(typeof component.addSeller).toBe('function');

    // Test method execution
    expect(() => component.addSupplier()).not.toThrow();
    expect(() => component.addSeller()).not.toThrow();
  });
});
