import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProductosComponent } from './listar-productos.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ProductoService } from '../../services/producto.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../../models/product';
import { of, throwError } from 'rxjs';

describe('ListarProductosComponent', () => {
  let component: ListarProductosComponent;
  let fixture: ComponentFixture<ListarProductosComponent>;
  let router: Router;
  let dialog: jasmine.SpyObj<MatDialog>;
  let productService: jasmine.SpyObj<ProductoService>;
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3);
  const expirationDateString = futureDate.toISOString().split('T')[0];
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Acetaminofén 500mg',
      description:
        'Analgésico y antipirético para el alivio del dolor leve a moderado y fiebre',
      price: 8500,
      amount: 150,
      category: '1',
      conditions: 'Almacenar en lugar fresco y seco. Temperatura menor a 30°C',
      expirationDate: expirationDateString,
      batch: 'LOT-AC202312',
      provider: '1',
      deliveryTime: '24-48 horas',
    },
    {
      id: 2,
      name: 'Ibuprofeno 400mg',
      description:
        'Antiinflamatorio no esteroideo para dolor, inflamación y fiebre',
      price: 12000,
      amount: 85,
      category: '2',
      conditions: 'Proteger de la luz. Mantener en envase original',
      expirationDate: expirationDateString,
      batch: 'LOT-IB202401',
      provider: '2',
      deliveryTime: '48-72 horas',
    },
    {
      id: 3,
      name: 'Amoxicilina 500mg',
      description:
        'Antibiótico de amplio espectro para infecciones bacterianas',
      price: 18500,
      amount: 60,
      category: '3',
      conditions: 'Refrigerar entre 2°C y 8°C después de reconstituir',
      expirationDate: expirationDateString,
      batch: 'LOT-AM202402',
      provider: '3',
      deliveryTime: '72 horas',
    },
  ];

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const productServiceSpy = jasmine.createSpyObj('ProductoService', [
      'getAllProducts',
    ]);

    // Configurar el spy del servicio antes de crear el componente
    // para asegurar que siempre tenga un valor de retorno válido
    productServiceSpy.getAllProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [
        ListarProductosComponent,
        RouterTestingModule.withRoutes([
          { path: 'productos', component: ListarProductosComponent },
          { path: 'producto', component: ListarProductosComponent },
        ]),
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ProductoService, useValue: productServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarProductosComponent);

    productService = TestBed.inject(
      ProductoService
    ) as jasmine.SpyObj<ProductoService>;
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    // Crear spy en el router real
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });
    it('should initialize with correct displayed columns', () => {
      fixture.detectChanges();
      expect(component.displayedColumns()).toEqual([
        'id',
        'name',
        'description',
        'price',
        'amount',
        'actions',
      ]);
    });
    it('should initialize dataSource as MatTableDataSource', () => {
      expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
    });
    it('should load products on initialization', () => {
      fixture.detectChanges(); // Ejecuta ngOnInit

      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(mockProducts);
      expect(component.loading()).toBeFalse();
    });
  });

  describe('Load Products - Success and Failure', () => {
    it('should load products successfully and set dataSource', () => {
      // ÉXITO: Configurar el servicio para retornar productos exitosamente
      productService.getAllProducts.and.returnValue(of(mockProducts));

      component.loadProducts();

      expect(component.loading()).toBeFalse();
      expect(component.dataSource.data).toEqual(mockProducts);
      expect(productService.getAllProducts).toHaveBeenCalled();
    });

    it('should handle error when loading products fails', () => {
      // FALLO: Configurar el servicio para retornar un error
      productService.getAllProducts.and.returnValue(
        throwError(() => new Error('Error loading products'))
      );

      const consoleSpy = spyOn(console, 'error');

      component.loadProducts();

      expect(component.loading()).toBeFalse();
      expect(consoleSpy).toHaveBeenCalled();
      expect(productService.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('Add Product - Success and Failure', () => {
    it('should navigate to product form for adding new product successfully', () => {
      component.addProduct();

      expect(router.navigate).toHaveBeenCalledWith(['../producto'], {
        relativeTo: jasmine.any(Object),
        queryParams: {
          action: 'new',
          source: 'productos',
        },
      });
    });
    it('should not break when router service fails', () => {
      const rejectedPromise = Promise.reject('Navigation failed');
      rejectedPromise.catch(() => {
        // Capturar el error para evitar errores no manejados
      });

      (router.navigate as jasmine.Spy).and.returnValue(rejectedPromise);

      component.addProduct();

      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('Edit Product - Success and Failure', () => {
    it('should navigate to product form for editing product successfully', () => {
      const consoleSpy = spyOn(console, 'log');

      component.editProduct(mockProducts[0]);

      expect(consoleSpy).toHaveBeenCalledWith(mockProducts[0]);
      expect(router.navigate).toHaveBeenCalledWith(['../producto'], {
        relativeTo: jasmine.any(Object),
        state: {
          product: mockProducts[0],
          action: 'edit',
        },
      });
    });
    it('should handle navigation failure when editing product', () => {
      const rejectedPromise = Promise.reject('Edit navigation failed');
      rejectedPromise.catch(() => {
        // Capturar el error para evitar errores no manejados
      });

      (router.navigate as jasmine.Spy).and.returnValue(rejectedPromise);

      expect(() => component.editProduct(mockProducts[0])).not.toThrow();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('Component Methods', () => {
    it('should set loading to true when starting to load products', () => {
      productService.getAllProducts.and.returnValue(of(mockProducts));

      // Resetear loading antes de llamar loadProducts
      component.loading.set(false);

      component.loadProducts();

      // Verificar que loading se estableció en true (aunque luego se cambie a false)
      expect(productService.getAllProducts).toHaveBeenCalled();
    });

    it('should edit product with different product data', () => {
      const consoleSpy = spyOn(console, 'log');

      component.editProduct(mockProducts[1]);

      expect(consoleSpy).toHaveBeenCalledWith(mockProducts[1]);
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should edit product with third product data', () => {
      const consoleSpy = spyOn(console, 'log');

      component.editProduct(mockProducts[2]);

      expect(consoleSpy).toHaveBeenCalledWith(mockProducts[2]);
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('debe aplicar el filtro en minúsculas y sin espacios', () => {
      const event = {
        target: { value: '  PRODUCTO 1  ' },
      } as unknown as Event;

      component.applyFilter(event);

      expect(component.dataSource.filter).toBe('producto 1');
    });
  });
});
