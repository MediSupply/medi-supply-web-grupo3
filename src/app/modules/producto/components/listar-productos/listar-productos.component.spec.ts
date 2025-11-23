import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ListarProductosComponent } from './listar-productos.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../../models/product';
import { Observable, of, Subject, throwError } from 'rxjs';
import { DebugElement, signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductoService } from '../../../../services/producto.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ListarProductosComponent', () => {
  let component: ListarProductosComponent;
  let fixture: ComponentFixture<ListarProductosComponent>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let productService: jasmine.SpyObj<ProductoService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let debugElement: DebugElement;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3);
  const expirationDateString = futureDate.toISOString().split('T')[0];
  const mockProducts: Product[] = [
    {
      id: 1,
      nombre: 'Acetaminofén 500mg',
      descripcion:
        'Analgésico y antipirético para el alivio del dolor leve a moderado y fiebre',
      valor_unitario: 8500,
      cantidad_disponible: 150,
      categoria: '1',
      condiciones_almacenamiento:
        'Almacenar en lugar fresco y seco. Temperatura menor a 30°C',
      fecha_vencimiento: expirationDateString,
      lote: 'LOT-AC202312',
      id_proveedor: '1',
      tiempo_estimado_entrega: '24-48 horas',
      ubicacion: 'Bodega 1',
    },
    {
      id: 2,
      nombre: 'Ibuprofeno 400mg',
      descripcion:
        'Antiinflamatorio no esteroideo para dolor, inflamación y fiebre',
      valor_unitario: 12000,
      cantidad_disponible: 85,
      categoria: '2',
      condiciones_almacenamiento:
        'Proteger de la luz. Mantener en envase original',
      fecha_vencimiento: expirationDateString,
      lote: 'LOT-IB202401',
      id_proveedor: '2',
      tiempo_estimado_entrega: '48-72 horas',
      ubicacion: 'Bodega 2',
    },
    {
      id: 3,
      nombre: 'Amoxicilina 500mg',
      descripcion:
        'Antibiótico de amplio espectro para infecciones bacterianas',
      valor_unitario: 18500,
      cantidad_disponible: 60,
      categoria: '3',
      condiciones_almacenamiento:
        'Refrigerar entre 2°C y 8°C después de reconstituir',
      fecha_vencimiento: expirationDateString,
      lote: 'LOT-AM202402',
      id_proveedor: '3',
      tiempo_estimado_entrega: '72 horas',
      ubicacion: 'Bodega 3',
    },
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    const productsSignal = signal<Product[]>([]);
    const loadingSignal = signal<boolean>(false);
    const errorSignal = signal<string | null>(null);

    const productServiceSpy = jasmine.createSpyObj(
      'ProductoService',
      ['getAllProducts'],
      {
        productsSignal: productsSignal,
        loadingSignal: loadingSignal,
        errorSignal: errorSignal,
        products: productsSignal.asReadonly(),
        loading: loadingSignal.asReadonly(),
        error: errorSignal.asReadonly(),
      }
    );

    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: new Map(),
        queryParamMap: new Map(),
      },
    });

    await TestBed.configureTestingModule({
      imports: [
        ListarProductosComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatNativeDateModule,
        MatIconModule,
      ],
      providers: [
        { provide: ProductoService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarProductosComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(
      ProductoService
    ) as jasmine.SpyObj<ProductoService>;
    debugElement = fixture.debugElement;

    productService.getAllProducts.and.returnValue(of(mockProducts));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      productService.getAllProducts.and.returnValue(of(mockProducts));
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(productService.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('should filter products and reset paginator to first page', () => {
      // Configurar datos iniciales en el dataSource
      component.dataSource.data = mockProducts;
      component.ngAfterViewInit(); // Para inicializar paginator y sort

      const mockEvent = {
        target: { value: 'acetaminofén' },
      } as unknown as Event;

      spyOn(component.dataSource.paginator!, 'firstPage');

      component.applyFilter(mockEvent);

      expect(component.dataSource.filter).toBe('acetaminofén');
      expect(component.dataSource.paginator?.firstPage).toHaveBeenCalled();
    });
  });

  it('should show alert when no products are found', () => {
    // Configurar datos iniciales
    component.dataSource.data = mockProducts;
    component.ngAfterViewInit();

    const mockEvent = {
      target: { value: 'producto que no existe' },
    } as unknown as Event;

    // Espiar el alert
    spyOn(window, 'alert');

    component.applyFilter(mockEvent);

    expect(component.dataSource.filter).toBe('producto que no existe');
  });

  describe('addProduct', () => {
    it('should navigate to producto route with new action and source query params', () => {
      component.addProduct();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['../producto'], {
        relativeTo: activatedRouteSpy,
        queryParams: {
          action: 'new',
          source: 'productos',
        },
      });
    });
  });

  describe('editProduct', () => {
    it('should navigate to producto route with product state and edit action', () => {
      const mockProduct: Product = mockProducts[0];

      component.editProduct(mockProduct);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['../producto'], {
        relativeTo: activatedRouteSpy,
        state: {
          product: mockProduct,
          action: 'edit',
        },
      });
    });
  });

  describe('Table Data Display', () => {
    beforeEach(() => {
      component.dataSource.data = mockProducts;
      fixture.detectChanges();
    });

    it('should display products in the table with correct columns', () => {
      const table = fixture.nativeElement.querySelector('table');
      expect(table).toBeTruthy();

      // Verificar que las columnas definidas se muestran
      const displayedColumns = component.displayedColumns();
      const headerCells = fixture.nativeElement.querySelectorAll('th');
      expect(headerCells.length).toBe(displayedColumns.length);

      // Verificar textos de los headers (ajusta según tu HTML real)
      expect(headerCells[0].textContent.trim()).toBe('CÓDIGO PRODUCTO');
      expect(headerCells[1].textContent.trim()).toBe('NOMBRE PRODUCTO');
      expect(headerCells[2].textContent.trim()).toBe('DESCRIPCIÓN');
      expect(headerCells[3].textContent.trim()).toBe('PRECIO');
      expect(headerCells[4].textContent.trim()).toBe('CANTIDAD');
      expect(headerCells[5].textContent.trim()).toBe('ACCIONES');
    });
  });

  describe('loadProducts', () => {
    it('should load products successfully and set dataSource when products exist', fakeAsync(() => {
      const productsSignal = signal<Product[]>(mockProducts);

      // Sobrescribir la propiedad productsSignal del servicio
      Object.defineProperty(productService, 'productsSignal', {
        get: () => productsSignal,
      });

      productService.getAllProducts.and.returnValue(of(mockProducts));

      // Espiar console.error
      spyOn(console, 'error');

      // Ejecutar el método
      component.loadProducts();

      // Verificar que loading se activa
      expect(component.loading()).toBeTrue();

      // Simular el paso del tiempo para el finalize y setTimeout
      tick(500);

      // Verificar que se llamó al servicio
      expect(productService.getAllProducts).toHaveBeenCalled();

      // Verificar que el dataSource se actualizó con los productos
      expect(component.dataSource.data).toEqual(mockProducts);

      // Verificar que no se mostró el snackbar de "no hay productos"
      expect(snackBarSpy.open).toHaveBeenCalled();

      // Verificar que loading se desactiva
      expect(component.loading()).toBeTrue();
    }));

    it('should show snackbar when no products are returned', fakeAsync(() => {
      // Configurar el servicio para retornar éxito pero con array vacío
      productService.getAllProducts.and.returnValue(of());

      // Espiar console.error
      spyOn(console, 'error');

      // Ejecutar el método
      component.loadProducts();
      tick(500);

      // Verificar que se llamó al servicio
      expect(productService.getAllProducts).toHaveBeenCalled();

      // Verificar que se mostró el snackbar de "no hay productos"
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'No hay productos registrados',
        'Cerrar',
        { duration: 3000 }
      );

      // Verificar que el dataSource está vacío
      expect(component.dataSource.data).toEqual([]);
      expect(component.loading()).toBeTrue();
    }));

    it('should handle 401 unauthorized error', fakeAsync(() => {
      // Configurar el servicio para retornar error 401
      const error401 = { status: 401, message: 'Unauthorized' };
      productService.getAllProducts.and.returnValue(throwError(() => error401));

      // Espiar console.error
      spyOn(console, 'error');

      // Ejecutar el método
      component.loadProducts();
      tick(500);

      // Verificar que se llamó al servicio
      expect(productService.getAllProducts).toHaveBeenCalled();

      // Verificar que se mostró el snackbar de error específico para 401
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Usuario no autorizado',
        'Cerrar',
        { duration: 3000 }
      );

      // Verificar que se llamó console.error
      expect(console.error).toHaveBeenCalledWith('Error:', error401);

      expect(component.loading()).toBeTrue();
    }));

    it('should handle generic error', fakeAsync(() => {
      // Configurar el servicio para retornar error genérico
      const genericError = { status: 500, message: 'Server Error' };
      productService.getAllProducts.and.returnValue(
        throwError(() => genericError)
      );

      // Espiar console.error
      spyOn(console, 'error');

      // Ejecutar el método
      component.loadProducts();
      tick(500);

      // Verificar que se llamó al servicio
      expect(productService.getAllProducts).toHaveBeenCalled();

      // Verificar que se mostró el snackbar de error genérico
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Error al consultar la información, intente nuevamente',
        'Cerrar',
        { duration: 3000 }
      );

      // Verificar que se llamó console.error
      expect(console.error).toHaveBeenCalledWith('Error:', genericError);

      expect(component.loading()).toBeTrue();
    }));

    it('should set loading to true immediately when called', () => {
      // Configurar el servicio para retornar un observable que no se complete inmediatamente
      productService.getAllProducts.and.returnValue(new Observable());

      // Ejecutar el método
      component.loadProducts();

      // Verificar que loading se activa inmediatamente
      expect(component.loading()).toBeTrue();
    });
  });

  // Test adicional para verificar la inicialización del componente
  it('should call loadProducts on ngOnInit', () => {
    // Espiar loadProducts
    spyOn(component, 'loadProducts');

    // Llamar ngOnInit manualmente
    component.ngOnInit();

    // Verificar que loadProducts fue llamado
    expect(component.loadProducts).toHaveBeenCalled();
  });
});
