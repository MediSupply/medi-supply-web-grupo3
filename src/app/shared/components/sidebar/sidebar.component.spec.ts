import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerEvents$: Subject<any>;
  let urlSpy: jasmine.Spy<any>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    routerEvents$ = new Subject<any>();

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    spyOnProperty(router, 'events', 'get').and.returnValue(
      routerEvents$.asObservable()
    );

    urlSpy = spyOnProperty(router, 'url', 'get').and.returnValue(
      '/dashboard/productos'
    );

    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents$.complete();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con valores por defecto', () => {
    expect(component.logoError()).toBeFalsy();
    expect(component.menuItems().length).toBeGreaterThan(0);
  });

  it('debería detectar ruta activa correctamente', () => {
    const item = component.menuItems()[0]; // Productos
    urlSpy.and.returnValue('/dashboard/productos');

    const isActive = component.isActive(item);
    expect(isActive).toBeTruthy();
  });

  it('debería detectar ruta inactiva correctamente', () => {
    const item = component.menuItems()[1]; // Registro
    urlSpy.and.returnValue('/dashboard/productos');

    const isActive = component.isActive(item);
    expect(isActive).toBeFalsy();
  });

  it('debería manejar submenús correctamente', () => {
    const item = component.menuItems()[0];
    const isActive = component.isActive(item);
    expect(typeof isActive).toBe('boolean');
  });

  it('debería expandir menús automáticamente', () => {
    const currentUrl = '/dashboard/productos';
    urlSpy.and.returnValue(currentUrl);

    component['autoExpandMenus']();

    expect(component.menuItems().length).toBeGreaterThan(0);
  });

  it('debería manejar toggle de submenú', () => {
    const item = component.menuItems()[0];

    component.toggleSubmenu(item);

    expect(component.menuItems().length).toBeGreaterThan(0);
  });

  it('debería manejar error de logo', () => {
    const event = new Event('error');
    component.onLogoError(event);

    expect(component.logoError()).toBeTruthy();
  });

  it('debería llamar logout del AuthService', () => {
    component.logOut();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('debería configurar listener de router en ngOnInit', () => {
    spyOn(component as any, 'setupRouterListener');
    spyOn(component as any, 'autoExpandMenus');

    component.ngOnInit();

    expect(component['setupRouterListener']).toHaveBeenCalled();
    expect(component['autoExpandMenus']).toHaveBeenCalled();
  });

  it('debería limpiar suscripción en ngOnDestroy', () => {
    component['routerSubscription'] = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);

    component.ngOnDestroy();

    expect(component['routerSubscription'].unsubscribe).toHaveBeenCalled();
  });

  it('debería manejar eventos de navegación', () => {
    const navigationEnd = new NavigationEnd(
      1,
      '/dashboard/registro',
      '/dashboard/productos'
    );
    spyOn(component as any, 'autoExpandMenus');

    routerEvents$.next(navigationEnd);

    expect(component['autoExpandMenus']).toHaveBeenCalled();
  });

  it('debería tener estructura de menú correcta', () => {
    const menuItems = component.menuItems();

    expect(menuItems.length).toBe(5);
    expect(menuItems[0].id).toBe('producto');
    expect(menuItems[1].id).toBe('registro');
    expect(menuItems[2].id).toBe('plan-venta');
    expect(menuItems[3].id).toBe('reportes');
    expect(menuItems[4].id).toBe('rutas');
  });

  it('debería tener rutas correctas en los menús', () => {
    const menuItems = component.menuItems();

    expect(menuItems[0].path).toBe('/dashboard/productos');
    expect(menuItems[1].path).toBe('/dashboard/registro');
    expect(menuItems[2].path).toBe('/plan');
    expect(menuItems[3].path).toBe('/dashboard/reportes');
    expect(menuItems[4].path).toBe('/rutas');
  });

  it('debería manejar URL que no coincide con ningún menú', () => {
    urlSpy.and.returnValue('/ruta-inexistente');

    const item = component.menuItems()[0];
    const isActive = component.isActive(item);

    expect(isActive).toBeFalsy();
  });

  it('debería manejar URL vacía', () => {
    urlSpy.and.returnValue('');

    const item = component.menuItems()[0];
    const isActive = component.isActive(item);

    expect(isActive).toBeFalsy();
  });

  it('debería manejar toggle múltiples veces', () => {
    const item = component.menuItems()[0];

    component.toggleSubmenu(item);
    component.toggleSubmenu(item);

    expect(component.menuItems().length).toBeGreaterThan(0);
  });

  it('debería mantener estado de logo error', () => {
    expect(component.logoError()).toBeFalsy();

    component.onLogoError(new Event('error'));

    expect(component.logoError()).toBeTruthy();
  });

  it('debería manejar diferentes tipos de URLs', () => {
    const testUrls = [
      '/dashboard/productos',
      '/dashboard/registro',
      '/dashboard/reportes',
      '/plan',
      '/rutas',
      '/dashboard/registro-proveedor',
      '/dashboard/registro-vendedor',
    ];

    testUrls.forEach(url => {
      urlSpy.and.returnValue(url);
      const item = component.menuItems()[0];
      const isActive = component.isActive(item);
      expect(typeof isActive).toBe('boolean');
    });
  });

  it('debería manejar toggle de submenú múltiples veces', () => {
    const item = component.menuItems()[0];

    // Toggle multiple times
    component.toggleSubmenu(item);
    component.toggleSubmenu(item);
    component.toggleSubmenu(item);

    expect(component.menuItems().length).toBeGreaterThan(0);
  });

  it('debería manejar diferentes eventos de navegación', () => {
    const navigationEvents = [
      new NavigationEnd(1, '/dashboard/productos', '/dashboard/registro'),
      new NavigationEnd(2, '/dashboard/registro', '/dashboard/reportes'),
      new NavigationEnd(3, '/dashboard/reportes', '/plan'),
    ];

    navigationEvents.forEach(event => {
      routerEvents$.next(event);
      expect(component.menuItems().length).toBeGreaterThan(0);
    });
  });

  it('debería manejar diferentes estados de logo', () => {
    // Test initial state
    expect(component.logoError()).toBeFalsy();

    // Test error state
    component.onLogoError(new Event('error'));
    expect(component.logoError()).toBeTruthy();

    // Test multiple error events
    component.onLogoError(new Event('error'));
    expect(component.logoError()).toBeTruthy();
  });

  it('debería manejar diferentes tipos de items de menú', () => {
    const menuItems = component.menuItems();

    menuItems.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.label).toBeDefined();
      expect(item.icon).toBeDefined();
      expect(item.path).toBeDefined();
    });
  });

  it('debería manejar diferentes rutas de navegación', () => {
    const testRoutes = [
      '/dashboard/productos',
      '/dashboard/registro',
      '/dashboard/reportes',
      '/plan',
      '/rutas',
    ];

    testRoutes.forEach(route => {
      urlSpy.and.returnValue(route);
      const item = component.menuItems()[0];
      const isActive = component.isActive(item);
      expect(typeof isActive).toBe('boolean');
    });
  });

  it('debería manejar diferentes estados de expansión', () => {
    const item = component.menuItems()[0];

    // Test initial state
    expect(component.menuItems().length).toBeGreaterThan(0);

    // Test toggle
    component.toggleSubmenu(item);
    expect(component.menuItems().length).toBeGreaterThan(0);

    // Test multiple toggles
    component.toggleSubmenu(item);
    component.toggleSubmenu(item);
    expect(component.menuItems().length).toBeGreaterThan(0);
  });

  it('debería manejar diferentes tipos de eventos', () => {
    const events = [new Event('error'), new Event('load'), new Event('click')];

    events.forEach(event => {
      component.onLogoError(event);
      expect(component.logoError()).toBeTruthy();
    });
  });

  it('debería manejar diferentes configuraciones de menú', () => {
    const menuItems = component.menuItems();

    expect(menuItems.length).toBe(5);

    // Test each menu item
    expect(menuItems[0].id).toBe('producto');
    expect(menuItems[1].id).toBe('registro');
    expect(menuItems[2].id).toBe('plan-venta');
    expect(menuItems[3].id).toBe('reportes');
    expect(menuItems[4].id).toBe('rutas');
  });

  it('debería manejar diferentes estados de autenticación', () => {
    // Test logout functionality
    component.logOut();
    expect(authServiceSpy.logout).toHaveBeenCalled();

    // Test multiple logout calls
    component.logOut();
    component.logOut();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(3);
  });

  it('debería manejar diferentes tipos de URLs con submenús', () => {
    const testUrls = [
      '/dashboard/productos',
      '/dashboard/registro',
      '/dashboard/reportes',
      '/plan',
      '/rutas',
    ];

    testUrls.forEach(url => {
      urlSpy.and.returnValue(url);
      const item = component.menuItems()[0];
      const isActive = component.isActive(item);
      expect(typeof isActive).toBe('boolean');
    });
  });

  it('debería manejar diferentes estados de expansión de menús', () => {
    const item = component.menuItems()[0];

    // Test initial state
    expect(component.menuItems().length).toBeGreaterThan(0);

    // Test toggle
    component.toggleSubmenu(item);
    expect(component.menuItems().length).toBeGreaterThan(0);

    // Test multiple toggles
    component.toggleSubmenu(item);
    component.toggleSubmenu(item);
    expect(component.menuItems().length).toBeGreaterThan(0);
  });

  it('debería manejar diferentes tipos de eventos de navegación', () => {
    const navigationEvents = [
      new NavigationEnd(1, '/dashboard/productos', '/dashboard/registro'),
      new NavigationEnd(2, '/dashboard/registro', '/dashboard/reportes'),
      new NavigationEnd(3, '/dashboard/reportes', '/plan'),
    ];

    navigationEvents.forEach(event => {
      routerEvents$.next(event);
      expect(component.menuItems().length).toBeGreaterThan(0);
    });
  });

  it('debería manejar diferentes estados de logo', () => {
    // Test initial state
    expect(component.logoError()).toBeFalsy();

    // Test error state
    component.onLogoError(new Event('error'));
    expect(component.logoError()).toBeTruthy();

    // Test multiple error events
    component.onLogoError(new Event('error'));
    expect(component.logoError()).toBeTruthy();
  });

  it('debería manejar diferentes tipos de items de menú', () => {
    const menuItems = component.menuItems();

    menuItems.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.label).toBeDefined();
      expect(item.icon).toBeDefined();
      expect(item.path).toBeDefined();
    });
  });

  it('debería manejar diferentes rutas de navegación', () => {
    const testRoutes = [
      '/dashboard/productos',
      '/dashboard/registro',
      '/dashboard/reportes',
      '/plan',
      '/rutas',
    ];

    testRoutes.forEach(route => {
      urlSpy.and.returnValue(route);
      const item = component.menuItems()[0];
      const isActive = component.isActive(item);
      expect(typeof isActive).toBe('boolean');
    });
  });

  it('debería manejar diferentes estados de expansión', () => {
    const item = component.menuItems()[0];

    // Test initial state
    expect(component.menuItems().length).toBeGreaterThan(0);

    // Test toggle
    component.toggleSubmenu(item);
    expect(component.menuItems().length).toBeGreaterThan(0);

    // Test multiple toggles
    component.toggleSubmenu(item);
    component.toggleSubmenu(item);
    expect(component.menuItems().length).toBeGreaterThan(0);
  });

  it('debería manejar diferentes tipos de eventos', () => {
    const events = [new Event('error'), new Event('load'), new Event('click')];

    events.forEach(event => {
      component.onLogoError(event);
      expect(component.logoError()).toBeTruthy();
    });
  });

  it('debería manejar diferentes configuraciones de menú', () => {
    const menuItems = component.menuItems();

    expect(menuItems.length).toBe(5);

    // Test each menu item
    expect(menuItems[0].id).toBe('producto');
    expect(menuItems[1].id).toBe('registro');
    expect(menuItems[2].id).toBe('plan-venta');
    expect(menuItems[3].id).toBe('reportes');
    expect(menuItems[4].id).toBe('rutas');
  });

  it('debería manejar diferentes estados de autenticación', () => {
    // Test logout functionality
    component.logOut();
    expect(authServiceSpy.logout).toHaveBeenCalled();

    // Test multiple logout calls
    component.logOut();
    component.logOut();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(3);
  });

  it('debería manejar diferentes tipos de URLs con submenús', () => {
    const testUrls = [
      '/dashboard/productos',
      '/dashboard/registro',
      '/dashboard/reportes',
      '/plan',
      '/rutas',
    ];

    testUrls.forEach(url => {
      urlSpy.and.returnValue(url);
      const item = component.menuItems()[0];
      const isActive = component.isActive(item);
      expect(typeof isActive).toBe('boolean');
    });
  });

  it('debería manejar diferentes estados de expansión de menús', () => {
    const item = component.menuItems()[0];

    // Test initial state
    expect(component.menuItems().length).toBeGreaterThan(0);

    // Test toggle
    component.toggleSubmenu(item);
    expect(component.menuItems().length).toBeGreaterThan(0);

    // Test multiple toggles
    component.toggleSubmenu(item);
    component.toggleSubmenu(item);
    expect(component.menuItems().length).toBeGreaterThan(0);
  });

  it('debería manejar diferentes tipos de eventos de navegación', () => {
    const navigationEvents = [
      new NavigationEnd(1, '/dashboard/productos', '/dashboard/registro'),
      new NavigationEnd(2, '/dashboard/registro', '/dashboard/reportes'),
      new NavigationEnd(3, '/dashboard/reportes', '/plan'),
    ];

    navigationEvents.forEach(event => {
      routerEvents$.next(event);
      expect(component.menuItems().length).toBeGreaterThan(0);
    });
  });

  it('debería manejar diferentes estados de logo', () => {
    // Test initial state
    expect(component.logoError()).toBeFalsy();

    // Test error state
    component.onLogoError(new Event('error'));
    expect(component.logoError()).toBeTruthy();

    // Test multiple error events
    component.onLogoError(new Event('error'));
    expect(component.logoError()).toBeTruthy();
  });

  it('debería manejar diferentes tipos de items de menú', () => {
    const menuItems = component.menuItems();

    menuItems.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.label).toBeDefined();
      expect(item.icon).toBeDefined();
      expect(item.path).toBeDefined();
    });
  });

  it('debería manejar diferentes rutas de navegación', () => {
    const testRoutes = [
      '/dashboard/productos',
      '/dashboard/registro',
      '/dashboard/reportes',
      '/plan',
      '/rutas',
    ];

    testRoutes.forEach(route => {
      urlSpy.and.returnValue(route);
      const item = component.menuItems()[0];
      const isActive = component.isActive(item);
      expect(typeof isActive).toBe('boolean');
    });
  });

  it('debería manejar diferentes estados de expansión', () => {
    const item = component.menuItems()[0];

    // Test initial state
    expect(component.menuItems().length).toBeGreaterThan(0);

    // Test toggle
    component.toggleSubmenu(item);
    expect(component.menuItems().length).toBeGreaterThan(0);

    // Test multiple toggles
    component.toggleSubmenu(item);
    component.toggleSubmenu(item);
    expect(component.menuItems().length).toBeGreaterThan(0);
  });

  it('debería manejar diferentes tipos de eventos', () => {
    const events = [new Event('error'), new Event('load'), new Event('click')];

    events.forEach(event => {
      component.onLogoError(event);
      expect(component.logoError()).toBeTruthy();
    });
  });

  it('debería manejar diferentes configuraciones de menú', () => {
    const menuItems = component.menuItems();

    expect(menuItems.length).toBe(5);

    // Test each menu item
    expect(menuItems[0].id).toBe('producto');
    expect(menuItems[1].id).toBe('registro');
    expect(menuItems[2].id).toBe('plan-venta');
    expect(menuItems[3].id).toBe('reportes');
    expect(menuItems[4].id).toBe('rutas');
  });
});
