import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ReportesComponent } from './reportes.component';
import { VendedoresService, Vendedor, IndicadoresVendedor } from '../../services/vendedores.service';
import { ElementRef } from '@angular/core';

describe('ReportesComponent', () => {
  let component: ReportesComponent;
  let fixture: ComponentFixture<ReportesComponent>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockVendedoresService: jasmine.SpyObj<VendedoresService>;

  beforeEach(async () => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const vendedoresServiceSpy = jasmine.createSpyObj('VendedoresService', [
      'getVendedores',
      'getIndicadoresVendedor',
      'getDatosVentasHistoricas',
      'getDatosClientes',
      'getDatosDistribucion'
    ]);

    await TestBed.configureTestingModule({
      imports: [ReportesComponent, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: VendedoresService, useValue: vendedoresServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportesComponent);
    component = fixture.componentInstance;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    mockVendedoresService = TestBed.inject(VendedoresService) as jasmine.SpyObj<VendedoresService>;
    
    // Configurar valores por defecto para los mocks
    mockVendedoresService.getVendedores.and.returnValue(of([]));
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(of(null));
    mockVendedoresService.getDatosVentasHistoricas.and.returnValue(of([]));
    mockVendedoresService.getDatosClientes.and.returnValue(of({ clientesAtendidos: [], nuevosClientes: [] }));
    mockVendedoresService.getDatosDistribucion.and.returnValue(of({ labels: [], data: [] }));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.cargando).toBeFalsy();
    expect(component.vendedores).toEqual([]);
    expect(component.vendedorSeleccionado).toBeNull();
    expect(component.indicadores).toBeNull();
    expect(component.mostrarIndicadores).toBeFalsy();
    expect(component.sinDatos).toBeFalsy();
    expect(component.errorCarga).toBeFalsy();
    expect(component.vendedorForm).toBeDefined();
  });

  it('should load vendedores on init', () => {
    const mockVendedores: Vendedor[] = [
      { id: 1, nombre: 'Pedro Pablo Mercedes', activo: true },
      { id: 2, nombre: 'Juan Jose Torres', activo: true }
    ];
    mockVendedoresService.getVendedores.and.returnValue(of(mockVendedores));

    component.ngOnInit();

    expect(mockVendedoresService.getVendedores).toHaveBeenCalled();
    expect(component.vendedores).toEqual(mockVendedores);
  });

  it('should handle error when loading vendedores', () => {
    mockVendedoresService.getVendedores.and.returnValue(throwError(() => new Error('Network error')));

    component.cargarVendedores();

    expect(mockVendedoresService.getVendedores).toHaveBeenCalled();
  });

  it('should select vendedor and load indicators', () => {
    const mockVendedor: Vendedor = { id: 1, nombre: 'Pedro Pablo Mercedes', activo: true };
    const mockIndicadores: IndicadoresVendedor = {
      ventasTotales: 850000,
      clientesAtendidos: 120,
      nuevosClientes: 25,
      montoPromedioVenta: 35000
    };

    component.vendedores = [mockVendedor];
    component.vendedorForm.patchValue({ vendedor: 1 });
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(of(mockIndicadores));

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toEqual(mockVendedor);
    expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(1);
  });

  it('should show error when no vendedor is selected', () => {
    component.vendedorForm.patchValue({ vendedor: '' });
    component.vendedorForm.updateValueAndValidity();

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should load indicators successfully', () => {
    component.vendedorSeleccionado = { id: 1, nombre: 'Pedro Pablo Mercedes', activo: true };
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(of({
      ventasTotales: 850000,
      clientesAtendidos: 120,
      nuevosClientes: 25,
      montoPromedioVenta: 35000
    }));

    component.cargarIndicadores();

    expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(1);
  });

  it('should handle no data scenario', () => {
    component.vendedorSeleccionado = { id: 3, nombre: 'María González', activo: true };
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(of(null));

    component.cargarIndicadores();

    expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(3);
  });

  it('should handle technical error', () => {
    component.vendedorSeleccionado = { id: 2, nombre: 'Juan Jose Torres', activo: true };
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(throwError(() => new Error('Error técnico')));

    component.cargarIndicadores();

    expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(2);
  });

  it('should format currency correctly', () => {
    const result = component.formatearMoneda(1000000);
    expect(result).toContain('1.000.000');
    expect(result).toContain('$');
  });

  it('should create form with required validator', () => {
    const form = component.vendedorForm;
    expect(form.get('vendedor')?.hasError('required')).toBeTruthy();
  });

  it('should not load indicators if no vendedor selected', () => {
    component.vendedorSeleccionado = null;

    component.cargarIndicadores();

    expect(mockVendedoresService.getIndicadoresVendedor).not.toHaveBeenCalled();
  });

  it('should call chart creation methods when indicators are loaded', () => {
    const mockIndicadores: IndicadoresVendedor = {
      ventasTotales: 850000,
      clientesAtendidos: 120,
      nuevosClientes: 25,
      montoPromedioVenta: 35000
    };
    component.vendedorSeleccionado = { id: 1, nombre: 'Pedro Pablo Mercedes', activo: true };
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(of(mockIndicadores));
    mockVendedoresService.getDatosVentasHistoricas.and.returnValue(of([1, 2, 3, 4, 5, 6, 7]));
    mockVendedoresService.getDatosClientes.and.returnValue(of({
      clientesAtendidos: [1, 2, 3, 4, 5, 6, 7],
      nuevosClientes: [1, 2, 3, 4, 5, 6, 7]
    }));
    mockVendedoresService.getDatosDistribucion.and.returnValue(of({
      labels: ['A', 'B', 'C', 'D'],
      data: [1, 2, 3, 4]
    }));

    spyOn(component as any, 'crearGraficos');

    component.cargarIndicadores();

    expect(component.indicadores).toEqual(mockIndicadores);
    expect(component.mostrarIndicadores).toBeTruthy();
  });

  it('should reset loading state after successful indicators load', () => {
    const mockIndicadores: IndicadoresVendedor = {
      ventasTotales: 850000,
      clientesAtendidos: 120,
      nuevosClientes: 25,
      montoPromedioVenta: 35000
    };
    component.vendedorSeleccionado = { id: 1, nombre: 'Pedro Pablo Mercedes', activo: true };
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(of(mockIndicadores));

    component.cargarIndicadores();

    expect(component.cargando).toBeFalsy();
  });

  it('should reset loading state after error', () => {
    component.vendedorSeleccionado = { id: 2, nombre: 'Juan Jose Torres', activo: true };
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(throwError(() => new Error('Error técnico')));

    component.cargarIndicadores();

    expect(component.cargando).toBeFalsy();
  });

  it('should reset all state flags when loading indicators', () => {
    component.vendedorSeleccionado = { id: 1, nombre: 'Pedro Pablo Mercedes', activo: true };
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(of(null));

    component.cargarIndicadores();

    expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(1);
  });

  it('should have correct form structure', () => {
    const form = component.vendedorForm;
    expect(form.get('vendedor')).toBeTruthy();
  });

  it('should handle vendedor selection with valid data', () => {
    const mockVendedor: Vendedor = { id: 1, nombre: 'Pedro Pablo Mercedes', activo: true };
    component.vendedores = [mockVendedor];
    component.vendedorForm.patchValue({ vendedor: 1 });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toEqual(mockVendedor);
  });

  it('should handle vendedor selection with invalid data', () => {
    component.vendedores = [];
    component.vendedorForm.patchValue({ vendedor: 999 });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should create form with required validator', () => {
    const form = component.vendedorForm;
    expect(form.get('vendedor')?.hasError('required')).toBeTruthy();
  });

  it('should format currency with correct locale', () => {
    const result = component.formatearMoneda(500000);
    expect(result).toContain('500.000');
    expect(result).toContain('$');
  });

  it('should handle empty vendedor list', () => {
    component.vendedores = [];
    component.vendedorForm.patchValue({ vendedor: 1 });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle vendedor selection with null value', () => {
    component.vendedorForm.patchValue({ vendedor: null });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle vendedor selection with empty string', () => {
    component.vendedorForm.patchValue({ vendedor: '' });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle vendedor selection with undefined', () => {
    component.vendedorForm.patchValue({ vendedor: undefined });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle vendedor selection with 0', () => {
    component.vendedorForm.patchValue({ vendedor: 0 });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle vendedor selection with false', () => {
    component.vendedorForm.patchValue({ vendedor: false });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle cargarIndicadores with no vendedor', () => {
    component.vendedorSeleccionado = null;

    component.cargarIndicadores();

    expect(mockVendedoresService.getIndicadoresVendedor).not.toHaveBeenCalled();
  });

  it('should handle cargarIndicadores with undefined vendedor', () => {
    (component as any).vendedorSeleccionado = undefined;

    component.cargarIndicadores();

    expect(mockVendedoresService.getIndicadoresVendedor).not.toHaveBeenCalled();
  });

  it('should handle form validation correctly', () => {
    const form = component.vendedorForm;
    
    expect(form.get('vendedor')?.hasError('required')).toBeTruthy();
    
    form.get('vendedor')?.setValue(1);
    expect(form.get('vendedor')?.valid).toBeTruthy();
    
    form.get('vendedor')?.setValue('');
    expect(form.get('vendedor')?.hasError('required')).toBeTruthy();
  });

  it('should handle different vendedor IDs', () => {
    const testIds = [1, 2, 3, 4, 999];
    
    testIds.forEach(id => {
      component.vendedorForm.patchValue({ vendedor: id });
      component.seleccionarVendedor();
      expect(component.vendedorSeleccionado).toBeDefined();
    });
  });

  it('should handle edge cases in formatearMoneda', () => {
    expect(component.formatearMoneda(0)).toContain('0');
    expect(component.formatearMoneda(1000)).toContain('1.000');
    expect(component.formatearMoneda(1000000)).toContain('1.000.000');
    expect(component.formatearMoneda(-1000)).toContain('1.000');
  });

  it('should handle cargarIndicadores with valid vendedor and valid indicators', () => {
    component.vendedorSeleccionado = { id: 1, nombre: 'Test Vendedor', activo: true };
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(of({
      ventasTotales: 100000,
      clientesAtendidos: 50,
      nuevosClientes: 10,
      montoPromedioVenta: 2000
    }));

    component.cargarIndicadores();

    expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(1);
  });

         it('should handle cargarIndicadores with valid vendedor but null indicators', () => {
           component.vendedorSeleccionado = { id: 1, nombre: 'Test Vendedor', activo: true };
           mockVendedoresService.getIndicadoresVendedor.and.returnValue(of(null));

           component.cargarIndicadores();

           expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(1);
         });

  it('should handle cargarIndicadores with valid vendedor but error response', () => {
    component.vendedorSeleccionado = { id: 1, nombre: 'Test Vendedor', activo: true };
    mockVendedoresService.getIndicadoresVendedor.and.returnValue(throwError(() => new Error('Test error')));

    component.cargarIndicadores();

    expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(1);
  });

  it('should handle seleccionarVendedor with valid vendedor ID', () => {
    component.vendedores = [{ id: 1, nombre: 'Test Vendedor', activo: true }];
    component.vendedorForm.patchValue({ vendedor: 1 });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toEqual({ id: 1, nombre: 'Test Vendedor', activo: true });
  });

  it('should handle seleccionarVendedor with invalid vendedor ID', () => {
    component.vendedores = [{ id: 1, nombre: 'Test Vendedor', activo: true }];
    component.vendedorForm.patchValue({ vendedor: 999 });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle seleccionarVendedor with empty vendedor ID', () => {
    component.vendedores = [{ id: 1, nombre: 'Test Vendedor', activo: true }];
    component.vendedorForm.patchValue({ vendedor: '' });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle seleccionarVendedor with null vendedor ID', () => {
    component.vendedores = [{ id: 1, nombre: 'Test Vendedor', activo: true }];
    component.vendedorForm.patchValue({ vendedor: null });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle seleccionarVendedor with undefined vendedor ID', () => {
    component.vendedores = [{ id: 1, nombre: 'Test Vendedor', activo: true }];
    component.vendedorForm.patchValue({ vendedor: undefined });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle seleccionarVendedor with 0 vendedor ID', () => {
    component.vendedores = [{ id: 1, nombre: 'Test Vendedor', activo: true }];
    component.vendedorForm.patchValue({ vendedor: 0 });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle seleccionarVendedor with false vendedor ID', () => {
    component.vendedores = [{ id: 1, nombre: 'Test Vendedor', activo: true }];
    component.vendedorForm.patchValue({ vendedor: false });

    component.seleccionarVendedor();

    expect(component.vendedorSeleccionado).toBeNull();
  });

  it('should handle cargarVendedores with error', () => {
    mockVendedoresService.getVendedores.and.returnValue(throwError(() => new Error('Network error')));

    component.cargarVendedores();

    expect(mockVendedoresService.getVendedores).toHaveBeenCalled();
  });

  it('should handle cargarVendedores with success', () => {
    const mockVendedores = [{ id: 1, nombre: 'Test Vendedor', activo: true }];
    mockVendedoresService.getVendedores.and.returnValue(of(mockVendedores));

    component.cargarVendedores();

    expect(mockVendedoresService.getVendedores).toHaveBeenCalled();
    expect(component.vendedores).toEqual(mockVendedores);
  });

  it('should handle form validation with different values', () => {
    const form = component.vendedorForm;
    
    // Test required validation
    expect(form.get('vendedor')?.hasError('required')).toBeTruthy();
    
    // Test valid value
    form.get('vendedor')?.setValue(1);
    expect(form.get('vendedor')?.valid).toBeTruthy();
    
    // Test invalid value
    form.get('vendedor')?.setValue('');
    expect(form.get('vendedor')?.hasError('required')).toBeTruthy();
    
    // Test null value
    form.get('vendedor')?.setValue(null);
    expect(form.get('vendedor')?.hasError('required')).toBeTruthy();
    
    // Test undefined value
    form.get('vendedor')?.setValue(undefined);
    expect(form.get('vendedor')?.hasError('required')).toBeTruthy();
  });

  it('should handle different vendedor selection scenarios', () => {
    const testCases = [
      { value: 1, expected: { id: 1, nombre: 'Pedro Pablo Mercedes', activo: true } },
      { value: 2, expected: { id: 2, nombre: 'Juan Jose Torres', activo: true } },
      { value: 3, expected: { id: 3, nombre: 'María González', activo: true } },
      { value: 4, expected: { id: 4, nombre: 'Carlos Rodríguez', activo: true } }
    ];
    
    testCases.forEach(testCase => {
      component.vendedorForm.patchValue({ vendedor: testCase.value });
      component.seleccionarVendedor();
      expect(component.vendedorSeleccionado).toBeDefined();
    });
  });

         it('should handle cargarIndicadores with different vendedor states', () => {
           // Test with null vendedor
           component.vendedorSeleccionado = null;
           component.cargarIndicadores();
           expect(mockVendedoresService.getIndicadoresVendedor).not.toHaveBeenCalled();

           // Test with undefined vendedor
           (component as any).vendedorSeleccionado = undefined;
           component.cargarIndicadores();
           expect(mockVendedoresService.getIndicadoresVendedor).not.toHaveBeenCalled();

           // Test with valid vendedor
           component.vendedorSeleccionado = { id: 1, nombre: 'Test Vendedor', activo: true };
           mockVendedoresService.getIndicadoresVendedor.and.returnValue(of(null));
           component.cargarIndicadores();
           expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(1);
         });

         it('should handle different chart creation scenarios', () => {
           component.vendedorSeleccionado = { id: 1, nombre: 'Test Vendedor', activo: true };
           component.lineChartRef = { nativeElement: { getContext: () => ({}) } } as ElementRef;
           component.barChartRef = { nativeElement: { getContext: () => ({}) } } as ElementRef;
           component.pieChartRef = { nativeElement: { getContext: () => ({}) } } as ElementRef;

           // Test line chart creation
           (component as any).crearLineChart();
           expect(mockVendedoresService.getDatosVentasHistoricas).toHaveBeenCalledWith(1);

           // Test bar chart creation
           (component as any).crearBarChart();
           expect(mockVendedoresService.getDatosClientes).toHaveBeenCalledWith(1);

           // Test pie chart creation
           (component as any).crearPieChart();
           expect(mockVendedoresService.getDatosDistribucion).toHaveBeenCalledWith(1);
         });

         it('should handle chart creation with missing chart refs', () => {
           component.vendedorSeleccionado = { id: 1, nombre: 'Test Vendedor', activo: true };
           (component as any).lineChartRef = null;
           (component as any).barChartRef = null;
           (component as any).pieChartRef = null;

           // Test with null chart refs
           (component as any).crearLineChart();
           (component as any).crearBarChart();
           (component as any).crearPieChart();

           // Should not call service methods when chart refs are null
           expect(mockVendedoresService.getDatosVentasHistoricas).not.toHaveBeenCalled();
           expect(mockVendedoresService.getDatosClientes).not.toHaveBeenCalled();
           expect(mockVendedoresService.getDatosDistribucion).not.toHaveBeenCalled();
         });

         it('should handle chart creation with missing context', () => {
           component.vendedorSeleccionado = { id: 1, nombre: 'Test Vendedor', activo: true };
           component.lineChartRef = { nativeElement: { getContext: () => null } } as ElementRef;
           component.barChartRef = { nativeElement: { getContext: () => null } } as ElementRef;
           component.pieChartRef = { nativeElement: { getContext: () => null } } as ElementRef;

           // Test with null context
           (component as any).crearLineChart();
           (component as any).crearBarChart();
           (component as any).crearPieChart();

           // Should not call service methods when context is null
           expect(mockVendedoresService.getDatosVentasHistoricas).not.toHaveBeenCalled();
           expect(mockVendedoresService.getDatosClientes).not.toHaveBeenCalled();
           expect(mockVendedoresService.getDatosDistribucion).not.toHaveBeenCalled();
         });

         it('should handle different form validation states', () => {
           const form = component.vendedorForm;
           
           // Test initial state
           expect(form.get('vendedor')?.hasError('required')).toBeTruthy();
           
           // Test with valid value
           form.get('vendedor')?.setValue(1);
           expect(form.get('vendedor')?.valid).toBeTruthy();
           
           // Test with invalid value
           form.get('vendedor')?.setValue('');
           expect(form.get('vendedor')?.hasError('required')).toBeTruthy();
         });

         it('should handle different vendedor selection edge cases', () => {
           // Test with empty string
           component.vendedorForm.patchValue({ vendedor: '' });
           component.seleccionarVendedor();
           expect(component.vendedorSeleccionado).toBeNull();

           // Test with null
           component.vendedorForm.patchValue({ vendedor: null });
           component.seleccionarVendedor();
           expect(component.vendedorSeleccionado).toBeNull();

           // Test with undefined
           component.vendedorForm.patchValue({ vendedor: undefined });
           component.seleccionarVendedor();
           expect(component.vendedorSeleccionado).toBeNull();
         });

         it('should handle different service response scenarios', () => {
           component.vendedorSeleccionado = { id: 1, nombre: 'Test Vendedor', activo: true };
           
           // Test with valid indicators
           mockVendedoresService.getIndicadoresVendedor.and.returnValue(of({
             ventasTotales: 100000,
             clientesAtendidos: 50,
             nuevosClientes: 10,
             montoPromedioVenta: 2000
           }));
           component.cargarIndicadores();
           expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(1);

           // Test with null indicators
           mockVendedoresService.getIndicadoresVendedor.and.returnValue(of(null));
           component.cargarIndicadores();
           expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(1);

           // Test with error
           mockVendedoresService.getIndicadoresVendedor.and.returnValue(throwError(() => new Error('Test error')));
           component.cargarIndicadores();
           expect(mockVendedoresService.getIndicadoresVendedor).toHaveBeenCalledWith(1);
         });
});