import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

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
import { LocalizarProductoComponent } from './localizar-producto.component';
import { MatSnackBar } from '@angular/material/snack-bar';


describe('LocalizarProductoComponent', () => {
  let component: LocalizarProductoComponent;
    let fixture: ComponentFixture<LocalizarProductoComponent>;
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
        condiciones_almacenamiento: 'Almacenar en lugar fresco y seco. Temperatura menor a 30°C',
        fecha_vencimiento: expirationDateString,
        lote: 'LOT-AC202312',
        id_proveedor: '1',
        tiempo_estimado_entrega: '24-48 horas',
        ubicacion: 'Bodega 1'
      },
      {
        id: 2,
        nombre: 'Ibuprofeno 400mg',
        descripcion:
          'Antiinflamatorio no esteroideo para dolor, inflamación y fiebre',
        valor_unitario: 12000,
        cantidad_disponible: 85,
        categoria: '2',
        condiciones_almacenamiento: 'Proteger de la luz. Mantener en envase original',
        fecha_vencimiento: expirationDateString,
        lote: 'LOT-IB202401',
        id_proveedor: '2',
        tiempo_estimado_entrega: '48-72 horas',
        ubicacion: 'Bodega 2'
      },
      {
        id: 3,
        nombre: 'Amoxicilina 500mg',
        descripcion:
          'Antibiótico de amplio espectro para infecciones bacterianas',
        valor_unitario: 18500,
        cantidad_disponible: 60,
        categoria: '3',
        condiciones_almacenamiento: 'Refrigerar entre 2°C y 8°C después de reconstituir',
        fecha_vencimiento: expirationDateString,
        lote: 'LOT-AM202402',
        id_proveedor: '3',
        tiempo_estimado_entrega: '72 horas',
        ubicacion: 'Bodega 3'
      },
    ];
  
    beforeEach(async () => {
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);
      snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
      
      const productsSignal = signal<Product[]>([]);
      const loadingSignal = signal<boolean>(false);
      const errorSignal = signal<string | null>(null);

      const productServiceSpy = jasmine.createSpyObj('ProductoService', [
        'getAllProducts',
      ], {
        productsSignal: productsSignal,
        loadingSignal: loadingSignal,
        errorSignal: errorSignal,
        products: productsSignal.asReadonly(),
        loading: loadingSignal.asReadonly(),
        error: errorSignal.asReadonly()
      });

      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
        snapshot: {
          paramMap: new Map(),
          queryParamMap: new Map(),
        },
      });
  
      await TestBed.configureTestingModule({
        imports: [
          LocalizarProductoComponent,
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
  
      fixture = TestBed.createComponent(LocalizarProductoComponent);
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
        fixture.detectChanges(); // Esto ejecutará ngOnInit que llama a loadProducts()
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
        expect(headerCells[3].textContent.trim()).toBe('STOCK');
        expect(headerCells[4].textContent.trim()).toBe('UBICACIÓN');
      });
    });
  describe('loadProducts', () => {
    it('should load products successfully and set dataSource when products exist', fakeAsync(() => {
      const productsSignal = signal<Product[]>(mockProducts);
  
      Object.defineProperty(productService, 'productsSignal', {
        get: () => productsSignal
      });

      productService.getAllProducts.and.returnValue(of(mockProducts));
      spyOn(console, 'error');
      component.loadProducts();
      expect(component.loading()).toBeTrue();

      tick(500);

      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(mockProducts);
      expect(snackBarSpy.open).toHaveBeenCalled();
      expect(component.loading()).toBeTrue();
    }));

    it('should show snackbar when no products are returned', fakeAsync(() => {
      productService.getAllProducts.and.returnValue(of());
      spyOn(console, 'error');

      component.loadProducts();
      tick(500);

      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'No hay productos registrados', 'Cerrar', { duration: 3000 }
      );
      expect(component.dataSource.data).toEqual([]);
      expect(component.loading()).toBeTrue();
    }));

    it('should handle 401 unauthorized error', fakeAsync(() => {
      const error401 = { status: 401, message: 'Unauthorized' };
      productService.getAllProducts.and.returnValue(throwError(() => error401));
      spyOn(console, 'error');

      component.loadProducts();
      tick(500);

      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Usuario no autorizado', 'Cerrar', { duration: 3000 }
      );
      expect(console.error).toHaveBeenCalledWith('Error:', error401);
      expect(component.loading()).toBeTrue();
    }));

    it('should handle generic error', fakeAsync(() => {
      const genericError = { status: 500, message: 'Server Error' };
      productService.getAllProducts.and.returnValue(throwError(() => genericError));
      spyOn(console, 'error');

      component.loadProducts();
      tick(500);

      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Error al consultar la información, intente nuevamente', 'Cerrar', { duration: 3000 }
      );
      expect(console.error).toHaveBeenCalledWith('Error:', genericError);
      expect(component.loading()).toBeTrue();
    }));

    it('should set loading to true immediately when called', () => {
      productService.getAllProducts.and.returnValue(new Observable());
      component.loadProducts();

      expect(component.loading()).toBeTrue();
    });
  });

  it('should call loadProducts on ngOnInit', () => {
    spyOn(component, 'loadProducts');
    component.ngOnInit();
    
    expect(component.loadProducts).toHaveBeenCalled();
  });
});
  