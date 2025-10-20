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
});
