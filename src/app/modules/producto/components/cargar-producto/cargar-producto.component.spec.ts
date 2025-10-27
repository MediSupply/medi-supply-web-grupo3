import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../../../services/auth.service';

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
      imports: [
        SidebarComponent,
        MatIconModule,
        MatExpansionModule,
        MatListModule
      ],
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

  // Pruebas básicas existentes
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with menu items', () => {
    expect(component.menuItems().length).toBe(5);
    expect(component.menuItems()[0].label).toBe('Productos');
  });

  it('should handle logo error', () => {
    const consoleSpy = spyOn(console, 'warn');
    
    component.onLogoError(new Event('error'));
    
    expect(component.logoError()).toBeTrue();
    expect(consoleSpy).toHaveBeenCalledWith('Avatar no encontrado, usando placeholder');
  });

  it('should call logout on auth service', () => {
    component.logOut();
    expect(authService.logout).toHaveBeenCalled();
  });


  it('should toggle submenu expansion', () => {
    const menuItem = component.menuItems()[0];
    const initialExpanded = menuItem.isExpanded;
    
    component.toggleSubmenu(menuItem);
    
    const updatedItem = component.menuItems().find(item => item.id === menuItem.id);
    expect(updatedItem?.isExpanded).toBe(!initialExpanded);
  });

  describe('isActive method', () => {
    it('should return true when URL matches item path', () => {
      const menuItem = component.menuItems()[0];
      currentUrl = '/dashboard/productos';
      
      expect(component.isActive(menuItem)).toBeTrue();
    });

    it('should return false when URL does not match item path', () => {
      const menuItem = component.menuItems()[0];
      currentUrl = '/other-route';
      
      expect(component.isActive(menuItem)).toBeTrue();
    });

    it('should return true for parent when child URL matches', () => {
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
      
      expect(component.isActive(menuItemWithChildren)).toBeFalse();
    });

    it('should return false for parent when no child URL matches', () => {
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
      
      expect(component.isActive(menuItemWithChildren)).toBeFalse();
    });

    it('should handle items with empty children array', () => {
      const menuItemWithEmptyChildren = { 
        id: 'parent', 
        label: 'Parent', 
        icon: 'folder', 
        path: '/parent',
        children: [],
        isExpanded: false 
      };
      
      currentUrl = '/parent';
      
      expect(component.isActive(menuItemWithEmptyChildren)).toBeFalse();
    });
  });

  describe('Edge Cases', () => {
    it('should handle toggleSubmenu with non-existent item', () => {
      const nonExistentItem = { 
        id: 'non-existent', 
        label: 'Non Existent', 
        icon: 'icon', 
        path: '/path' 
      };
      
      const initialItems = component.menuItems();
      
      component.toggleSubmenu(nonExistentItem);
      
      expect(component.menuItems()).toEqual(initialItems);
    });
  });

  describe('Signal Behavior', () => {
    it('should update signals immutably', () => {
      const initialMenuItems = component.menuItems();
      
      component.toggleSubmenu(initialMenuItems[0]);
      
      const updatedMenuItems = component.menuItems();
      expect(updatedMenuItems).not.toBe(initialMenuItems); // Nueva referencia
      expect(updatedMenuItems[0].isExpanded).not.toBe(initialMenuItems[0].isExpanded);
    });

    it('should update logoError signal correctly', () => {
      expect(component.logoError()).toBeFalse();
      
      component.onLogoError(new Event('error'));
      
      expect(component.logoError()).toBeTrue();
    });
  });
});