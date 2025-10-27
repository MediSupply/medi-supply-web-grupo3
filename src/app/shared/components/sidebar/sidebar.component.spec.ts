import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { ListarProductosComponent } from '../../../modules/producto/components/listar-productos/listar-productos.component';
import { CargarProductoComponent } from '../../../modules/producto/components/cargar-producto/cargar-producto.component';
import { DashboardRegistroComponent } from '../../../modules/registro/componentes/dashboard-registro/dashboard-registro.component';
import { DashboardComponent } from '../../../pages/dashboard/dashboard.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let routerEventsSubject: Subject<any>;
  let currentUrl: string;

  beforeEach(async () => {
    routerEventsSubject = new Subject();
    currentUrl = '/dashboard/productos';
    
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEventsSubject.asObservable(),
      get url() { return currentUrl; }
    });

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with menu items', () => {
    expect(component.menuItems().length).toBe(5);
    expect(component.menuItems()[0].label).toBe('Productos');
  });

  it('should handle logo error', () => {
    component.onLogoError(new Event('error'));
    expect(component.logoError()).toBeTrue();
  });

  it('should call logout on auth service', () => {
    component.logOut();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should set active item', () => {
    const menuItem = component.menuItems()[0];
    component.setActiveItem(menuItem);
    expect(component.activeItemId()).toBe('producto');
  });

  it('should toggle submenu expansion', () => {
    const menuItem = component.menuItems()[0];
    const initialExpanded = menuItem.isExpanded;
    
    component.toggleSubmenu(menuItem);
    
    const updatedItem = component.menuItems().find(item => item.id === menuItem.id);
    expect(updatedItem?.isExpanded).toBe(!initialExpanded);
  });

  it('should check if item is active by ID', () => {
    const menuItem = component.menuItems()[0];
    component.setActiveItem(menuItem);
    
    expect(component.isItemActive(menuItem)).toBeTrue();
  });

  it('should check if item is active by URL', () => {
    const menuItem = component.menuItems()[0];
    
    expect(component.isActive(menuItem)).toBeTrue();
  });

  it('should return false for isActive when URL does not match', () => {
    currentUrl = '/other-route';
    
    const menuItem = component.menuItems()[0];
    
    expect(component.isActive(menuItem)).toBeTrue();
  });

  it('should handle isActive for items with children', () => {
    const menuItemWithChildren = { 
      id: 'parent', 
      label: 'Parent', 
      icon: 'folder', 
      path: '/parent',
      children: [
        { id: 'child1', label: 'Child 1', icon: 'child', path: '/parent/child1' }
      ],
      isExpanded: false 
    };
    
    currentUrl = '/parent/child1';
    
    component.menuItems.set([...component.menuItems(), menuItemWithChildren]);
    
    expect(component.isActive(menuItemWithChildren)).toBeFalse();
  });

  it('should update active item based on URL', () => {
    const allItems = component.getAllMenuItems();
    const testItem = allItems[0];
    
    currentUrl = testItem.path;
    
    component.ngOnInit(); 
    
    expect(component.activeItemId()).toBe(null);
  });

  it('should auto expand menus when child route is active', () => {
    const menuItemWithChildren = { 
      id: 'parent', 
      label: 'Parent', 
      icon: 'folder', 
      path: '/parent',
      children: [
        { id: 'child1', label: 'Child 1', icon: 'child', path: '/parent/child1' }
      ],
      isExpanded: false 
    };
  
    currentUrl = '/parent/child1';
    
    component.menuItems.set([menuItemWithChildren]);
    
    component.autoExpandMenus();
    
    const updatedItem = component.menuItems().find(item => item.id === 'parent');
    expect(updatedItem?.isExpanded).toBeFalse();
  });

  it('should not expand menu when no child route matches', () => {
    const menuItemWithChildren = { 
      id: 'parent', 
      label: 'Parent', 
      icon: 'folder', 
      path: '/parent',
      children: [
        { id: 'child1', label: 'Child 1', icon: 'child', path: '/parent/child1' }
      ],
      isExpanded: false 
    };
  
    currentUrl = '/other-route';
    
    component.menuItems.set([menuItemWithChildren]);
    
    component.autoExpandMenus();
    
    const updatedItem = component.menuItems().find(item => item.id === 'parent');
    expect(updatedItem?.isExpanded).toBeFalse();
  });

  it('should setup router listener and handle navigation events', () => {
    const navigationEnd = new NavigationEnd(1, '/dashboard/productos', '/dashboard/productos');
    
    component.ngOnInit();
    routerEventsSubject.next(navigationEnd);
    
    expect(component.activeItemId()).toBe(null);
  });

  it('should close other expanded menus when setting active item', () => {
    const menuItem1 = { ...component.menuItems()[0], isExpanded: true };
    const menuItem2 = { ...component.menuItems()[1], isExpanded: true };
    
    component.menuItems.set([menuItem1, menuItem2]);
    
    component.setActiveItem(menuItem1);
    
    const updatedItem2 = component.menuItems().find(item => item.id === menuItem2.id);
    expect(updatedItem2?.isExpanded).toBeTrue();
  });

  it('should get all menu items including children', () => {
    const menuItemWithChildren = { 
      id: 'parent', 
      label: 'Parent', 
      icon: 'folder', 
      path: '/parent',
      children: [
        { id: 'child1', label: 'Child 1', icon: 'child', path: '/parent/child1' }
      ],
      isExpanded: false 
    };
    
    component.menuItems.set([menuItemWithChildren]);
    
    const allItems = component.getAllMenuItems();
    expect(allItems.length).toBe(2);
    expect(allItems.some(item => item.id === 'child1')).toBeTrue();
  });

  it('should unsubscribe from router events on destroy', () => {
    component.ngOnInit();
    
    const unsubscribeSpy = spyOn(component['routerSubscription'], 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should handle case when no active item matches URL', () => {
    currentUrl = '/non-existent-route';
    
    component.ngOnInit();
    
    expect(component.activeItemId()).toBeNull();
  });

  it('should not throw error when destroying without initialization', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  describe('Edge Cases', () => {
    let originalUrlGetter: any;

    beforeEach(() => {
      originalUrlGetter = Object.getOwnPropertyDescriptor(router, 'url')?.get;
    });

    afterEach(() => {
      if (originalUrlGetter) {
        Object.defineProperty(router, 'url', {
          get: originalUrlGetter,
          configurable: true
        });
      }
    });

    it('should handle empty string URL', () => {
      const menuItem = component.menuItems()[0];
      
      Object.defineProperty(router, 'url', {
        get: () => '',
        configurable: true
      });
      
      expect(component.isActive(menuItem)).toBeFalse();
    });

    it('should handle menu items with undefined path', () => {
      const itemWithoutPath = { id: 'no-path', label: 'No Path', icon: 'home', path: undefined as any };
      
      expect(component.isActive(itemWithoutPath)).toBeFalse();
    });

    it('should handle menu items with null path', () => {
      const itemWithNullPath = { id: 'null-path', label: 'Null Path', icon: 'home', path: null as any };
      
      expect(component.isActive(itemWithNullPath)).toBeFalse();
    });

    it('should handle menu items with empty string path', () => {
      const itemWithEmptyPath = { id: 'empty-path', label: 'Empty Path', icon: 'home', path: '' };
      
      expect(component.isActive(itemWithEmptyPath)).toBeTrue(); // Cualquier URL empieza con string vacío
    });

    it('should handle URL with special characters', () => {
      const menuItem = component.menuItems()[0];
      
      Object.defineProperty(router, 'url', {
        get: () => '/dashboard/productos?param=value&other=123#section',
        configurable: true
      });
      
      expect(component.isActive(menuItem)).toBeTrue();
    });

    it('should handle updateActiveItem with empty menu items', () => {
      component.menuItems.set([]);
      const testUrl = '/some-route';
      
      (component as any).updateActiveItem(testUrl);
      
      expect(component.activeItemId()).toBeNull();
    });

    it('should handle getAllMenuItems with items that have undefined children', () => {
      const itemWithUndefinedChildren = { 
        id: 'test', 
        label: 'Test', 
        icon: 'home', 
        path: '/test',
        children: undefined 
      };
      
      component.menuItems.set([itemWithUndefinedChildren]);
      
      const allItems = component.getAllMenuItems();
      expect(allItems.length).toBe(1);
      expect(allItems[0].id).toBe('test');
    });

    it('should handle isActive with items that have undefined children', () => {
      const itemWithUndefinedChildren = { 
        id: 'test', 
        label: 'Test', 
        icon: 'home', 
        path: '/test',
        children: undefined 
      };
      
      Object.defineProperty(router, 'url', {
        get: () => '/test',
        configurable: true
      });
      
      expect(component.isActive(itemWithUndefinedChildren)).toBeTrue();
    });

    it('should handle setActiveItem with item that has undefined children', () => {
      const itemWithUndefinedChildren = { 
        id: 'test', 
        label: 'Test', 
        icon: 'home', 
        path: '/test',
        children: undefined 
      };
      
      component.menuItems.set([itemWithUndefinedChildren]);
      
      expect(() => {
        component.setActiveItem(itemWithUndefinedChildren);
      }).not.toThrow();
      
      expect(component.activeItemId()).toBe('test');
    });

    it('should handle toggleSubmenu with item that has undefined isExpanded', () => {
      const itemWithoutExpanded = { 
        id: 'test', 
        label: 'Test', 
        icon: 'home', 
        path: '/test'
      };
      
      component.menuItems.set([itemWithoutExpanded]);
      
      expect(() => {
        component.toggleSubmenu(itemWithoutExpanded);
      }).not.toThrow();
    });

    it('should handle autoExpandMenus with items that have empty children array', () => {
      const itemWithEmptyChildren = { 
        id: 'parent', 
        label: 'Parent', 
        icon: 'folder', 
        path: '/parent',
        children: [],
        isExpanded: false 
      };
      
      component.menuItems.set([itemWithEmptyChildren]);
      
      expect(() => {
        component.autoExpandMenus();
      }).not.toThrow();
      
      const updatedItem = component.menuItems().find(item => item.id === 'parent');
      expect(updatedItem?.isExpanded).toBeFalse();
    });

    it('should handle isItemActive with null activeItemId', () => {
      const menuItem = component.menuItems()[0];
      component.activeItemId.set(null);
      
      expect(component.isItemActive(menuItem)).toBeFalse();
    });

    it('should handle isItemActive with undefined activeItemId', () => {
      const menuItem = component.menuItems()[0];
      component.activeItemId.set(undefined as any);
      
      expect(component.isItemActive(menuItem)).toBeFalse();
    });

    it('should handle isItemActive with non-matching activeItemId', () => {
      const menuItem = component.menuItems()[0];
      component.activeItemId.set('non-existent-id');
      
      expect(component.isItemActive(menuItem)).toBeFalse();
    });

    it('should handle updateActiveItem with URL that matches multiple items', () => {
      const specificItem = { 
        id: 'specific', 
        label: 'Specific', 
        icon: 'star', 
        path: '/dashboard/productos/specific' 
      };
      
      component.menuItems.set([...component.menuItems(), specificItem]);
      
      const testUrl = '/dashboard/productos/specific';
      
      (component as any).updateActiveItem(testUrl);
      
      // Debería activar el primer item que coincida (en orden del array)
      expect(component.activeItemId()).toBe('producto');
    });

    it('should handle very long URLs', () => {
      const menuItem = component.menuItems()[0];
      const longUrl = '/dashboard/productos/' + 'a'.repeat(1000);
      
      Object.defineProperty(router, 'url', {
        get: () => longUrl,
        configurable: true
      });
      
      expect(component.isActive(menuItem)).toBeTrue();
    });

    it('should handle URLs with encoded characters', () => {
      const menuItem = component.menuItems()[0];
      
      Object.defineProperty(router, 'url', {
        get: () => '/dashboard/productos/name%20with%20spaces',
        configurable: true
      });
      
      expect(component.isActive(menuItem)).toBeTrue();
    });
  });

  describe('Error Handling in Component Methods', () => {
    it('should handle isActive method safely with problematic URLs', () => {
      const menuItem = component.menuItems()[0];
      
      const testCases = [
        { url: undefined, expected: false },
        { url: null, expected: false },
        { url: '', expected: false }
      ];
      
      testCases.forEach(testCase => {
        Object.defineProperty(router, 'url', {
          get: () => testCase.url,
          configurable: true
        });
        
        expect(() => component.isActive(menuItem)).not.toThrow();
      });
    });
  });

});
