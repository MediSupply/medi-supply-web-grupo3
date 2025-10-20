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
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    spyOnProperty(router, 'events', 'get').and.returnValue(routerEvents$.asObservable());

    urlSpy = spyOnProperty(router, 'url', 'get').and.returnValue('/dashboard/productos');

    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents$.complete();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('setActiveItem debería actualizar activeItemId y colapsar hijos no activos', () => {
    const parent = {
      id: 'parent',
      label: 'Parent',
      icon: 'folder',
      path: '/parent',
      isExpanded: true,
      children: [{ id: 'child', label: 'Child', icon: 'file', path: '/parent/child' }]
    };
    component.menuItems.set([parent]);
    component.setActiveItem(parent);
    expect(component.activeItemId()).toBe('parent');
    expect(component.menuItems()[0].isExpanded).toBe(true);
  });

  it('toggleSubmenu debería alternar isExpanded', () => {
    const item = component.menuItems()[0];
    const initialState = item.isExpanded;
    component.toggleSubmenu(item);
    const updatedItem = component.menuItems().find(i => i.id === item.id);
    expect(updatedItem?.isExpanded).toBe(!initialState);
  });

  it('isItemActive devuelve true solo si activeItemId coincide', () => {
    const item = component.menuItems()[0];
    component.activeItemId.set(item.id);
    expect(component.isItemActive(item)).toBeTrue();
    expect(component.isItemActive(component.menuItems()[1])).toBeFalse();
  });

  it('isActive devuelve true si la URL actual coincide con path o children', () => {
    const item = component.menuItems()[0];
    expect(component.isActive(item)).toBeTrue();

    urlSpy.and.returnValue('/otra-ruta');
    expect(component.isActive(item)).toBeFalse();
  });

  it('onLogoError debería setear logoError a true', () => {
    component.logoError.set(false);
    component.onLogoError(new Event('error'));
    expect(component.logoError()).toBeTrue();
  });

  it('logOut debería llamar a authService.logout', () => {
    component.logOut();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  // ----------------------
  // MÉTODOS PRIVADOS DIRECTOS
  // ----------------------
  it('updateActiveItem setea activeItemId si la URL coincide', () => {
    const testItem = component.menuItems()[0];
    component['updateActiveItem'](testItem.path);
    expect(component.activeItemId()).toBe(testItem.id);
  });

  it('updateActiveItem setea activeItemId a null si la URL no coincide', () => {
    component['updateActiveItem']('/no-existe');
    expect(component.activeItemId()).toBeNull();
  });

  it('getAllMenuItems devuelve todos los items incluyendo children', () => {
    const parentItem = {
      id: 'parent',
      label: 'Parent',
      icon: 'folder',
      path: '/parent',
      isExpanded: false,
      children: [{ id: 'child', label: 'Child', icon: 'file', path: '/parent/child' }]
    };
    component.menuItems.set([parentItem]);

    const result = component['getAllMenuItems']();
    expect(result.length).toBe(2);
    expect(result).toContain(parentItem);
    expect(result).toContain(parentItem.children[0]);
  });

  it('autoExpandMenus expande menús con children que coinciden con la URL', () => {
    const parentItem = {
      id: 'parent',
      label: 'Parent',
      icon: 'folder',
      path: '/parent',
      isExpanded: false,
      children: [{ id: 'child', label: 'Child', icon: 'file', path: '/parent/child' }]
    };
    component.menuItems.set([parentItem]);
    urlSpy.and.returnValue('/parent/child');

    component['autoExpandMenus']();

    expect(component.menuItems()[0].isExpanded).toBeTrue();
  });

  it('autoExpandMenus no expande si la URL no coincide', () => {
    const parentItem = {
      id: 'parent',
      label: 'Parent',
      icon: 'folder',
      path: '/parent',
      isExpanded: false,
      children: [{ id: 'child', label: 'Child', icon: 'file', path: '/parent/child' }]
    };
    component.menuItems.set([parentItem]);
    urlSpy.and.returnValue('/otra-ruta');

    component['autoExpandMenus']();

    expect(component.menuItems()[0].isExpanded).toBeFalse();
  });

  it('setupRouterListener llama a autoExpandMenus en NavigationEnd', () => {
    spyOn(component as any, 'autoExpandMenus');
    routerEvents$.next(new NavigationEnd(1, '/dummy', '/dummy'));
    expect((component as any).autoExpandMenus).toHaveBeenCalled();
  });

  it('ngOnDestroy desuscribe routerSubscription', () => {
    const unsubscribeSpy = spyOn((component as any).routerSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  // ----------------------
  // INTERACCIÓN CON HTML
  // ----------------------
  it('click en menú llama a setActiveItem', () => {
    spyOn(component, 'setActiveItem');
    fixture.detectChanges();
    const menuItems = fixture.debugElement.queryAll(By.css('.menu-item'));
    if (menuItems.length > 0) {
      menuItems[0].nativeElement.click();
      fixture.detectChanges();
      expect(component.setActiveItem).toHaveBeenCalled();
    }
  });

  it('evento error en logo dispara onLogoError', () => {
    spyOn(component, 'onLogoError');
    const img = fixture.debugElement.query(By.css('img'));
    if (img) {
      img.triggerEventHandler('error', new Event('error'));
      expect(component.onLogoError).toHaveBeenCalled();
    }
  });
});
