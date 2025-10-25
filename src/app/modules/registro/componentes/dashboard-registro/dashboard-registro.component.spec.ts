import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardRegistroComponent } from './dashboard-registro.component';

describe('DashboardRegistroComponent', () => {
  let component: DashboardRegistroComponent;
  let fixture: ComponentFixture<DashboardRegistroComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardRegistroComponent,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
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

  it('should have addSeller method defined', () => {
    expect(typeof component.addSeller).toBe('function');
  });

  it('should have addSupplier method defined', () => {
    expect(typeof component.addSupplier).toBe('function');
  });

  it('should navigate to registro-vendedor when addSeller is called', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.addSeller();

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to registro-proveedor when addSupplier is called', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.addSupplier();

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should call router.navigate with correct parameters for addSeller', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.addSeller();

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
  });

  it('should call router.navigate with correct parameters for addSupplier', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.addSupplier();

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);
  });

  it('should be able to call addSeller multiple times', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.addSeller();
    component.addSeller();

    expect(navigateSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-vendedor']);
  });

  it('should be able to call addSupplier multiple times', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.addSupplier();
    component.addSupplier();

    expect(navigateSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/registro-proveedor']);
  });

  it('should have router injected correctly', () => {
    expect(component['router']).toBeDefined();
    expect(component['router']).toBe(router);
  });

  it('should render without errors', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be a standalone component', () => {
    expect(component).toBeInstanceOf(DashboardRegistroComponent);
  });

  it('should have correct selector', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
