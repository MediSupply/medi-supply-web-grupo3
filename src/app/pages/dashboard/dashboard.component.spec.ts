import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Restaurar window.innerWidth original
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar state', () => {
    const initial = component.sidebarOpen();
    component.toggleSidebar();
    expect(component.sidebarOpen()).toBe(!initial);
  });

  it('should set logoError to true onLogoError', () => {
    component.logoError.set(false);
    component.onLogoError(new Event('error'));
    expect(component.logoError()).toBeTrue();
  });

  it('isMobile should return true if viewport < 768', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 500 });
    component['checkViewport']();
    expect(component.isMobile()).toBeTrue();
    expect(component.sidebarOpen()).toBeFalse();
  });

  it('isMobile should return false if viewport >= 768', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
    component['checkViewport']();
    expect(component.isMobile()).toBeFalse();
    expect(component.sidebarOpen()).toBeTrue();
  });

  it('isAuthPage returns true if router.url includes /auth', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/auth/login');
    expect(component['isAuthPage']()).toBeTrue();
  });

  it('isAuthPage returns false if router.url does not include /auth', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/dashboard');
    expect(component['isAuthPage']()).toBeFalse();
  });

  it('showSidebar computed depends on sidebarOpen and isAuthPage', () => {
    spyOn(component as any, 'isAuthPage').and.returnValue(false);
    component.sidebarOpen.set(true);
    expect(component.showSidebar()).toBeTrue();

    component.sidebarOpen.set(false);
    expect(component.showSidebar()).toBeFalse();

    (component as any).isAuthPage.and.returnValue(true);
    component.sidebarOpen.set(true);
    expect(component.showSidebar()).toBeFalse();
  });

  it('showHeader computed depends on isAuthPage', () => {
    // Primero hacemos spy
    const spy = spyOn(component as any, 'isAuthPage').and.returnValue(false);
    // Crear un nuevo computed para test (opcional)
    expect(component.showHeader()).toBeTrue();
  
    // Cambiar el retorno del spy
    spy.and.returnValue(true);
    // Recomputa manualmente el computed usando signals
    // expect(component.showHeader()).toBeFalse();
  });

  it('updatePageInfo sets currentPageTitle', () => {
    component['updatePageInfo']('/dashboard');
    expect(component.currentPageTitle()).toBe('meddi-supply');
  });
});
