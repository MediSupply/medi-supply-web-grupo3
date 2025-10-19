import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ListarProductosComponent } from './listar-productos.component';
<<<<<<< HEAD
import { ActivatedRoute, Router } from '@angular/router';
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
import { of, Subject, throwError } from 'rxjs';
=======
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
>>>>>>> 39a93f11baacada9104c82a1f73cc3e21687b6b9

describe('ListarProductosComponent', () => {
    let component: ListarProductosComponent;
  let fixture: ComponentFixture<ListarProductosComponent>;
  let router: jasmine.SpyObj<Router>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let productService: jasmine.SpyObj<ProductoService>;
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3);
  const expirationDateString = futureDate.toISOString().split('T')[0];
  const mockProducts: Product[] = [
    {
      "id": 1,
      "name": "Acetaminofén 500mg",
      "description": "Analgésico y antipirético para el alivio del dolor leve a moderado y fiebre",
      "price": 8500,
      "amount": 150,
      "category": "1",
      "conditions": "Almacenar en lugar fresco y seco. Temperatura menor a 30°C",
      "expirationDate": expirationDateString,
      "batch": "LOT-AC202312",
      "provider":  "1",
      "deliveryTime": "24-48 horas"
    },
    {
      "id": 2,
      "name": "Ibuprofeno 400mg",
      "description": "Antiinflamatorio no esteroideo para dolor, inflamación y fiebre",
      "price": 12000,
      "amount": 85,
      "category": "2",
      "conditions": "Proteger de la luz. Mantener en envase original",
      "expirationDate": expirationDateString,
      "batch": "LOT-IB202401",
      "provider": "2",
      "deliveryTime": "48-72 horas"
    },
    {
      "id": 3,
      "name": "Amoxicilina 500mg",
      "description": "Antibiótico de amplio espectro para infecciones bacterianas",
      "price": 18500,
      "amount": 60,
      "category": "3",
      "conditions": "Refrigerar entre 2°C y 8°C después de reconstituir",
      "expirationDate": expirationDateString,
      "batch": "LOT-AM202402",
      "provider":  "3",
      "deliveryTime": "72 horas"
    }
  ];

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const productServiceSpy = jasmine.createSpyObj('ProductoService', ['getAllProducts']);

    await TestBed.configureTestingModule({
      imports: [
        ListarProductosComponent,
<<<<<<< HEAD
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule
        ],
        providers: [
          { provide: Router, useValue: routerSpy },
          { provide: MatDialog, useValue: dialogSpy },
          { provide: ProductoService, useValue: productServiceSpy }
        ]
    })
    .compileComponents();
=======
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
>>>>>>> 39a93f11baacada9104c82a1f73cc3e21687b6b9

    fixture = TestBed.createComponent(ListarProductosComponent);

    productService = TestBed.inject(ProductoService) as jasmine.SpyObj<ProductoService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    productService.getAllProducts.and.returnValue(of(mockProducts));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    afterEach(() => {
    // Limpiar cualquier spy o mock
    productService.getAllProducts.calls.reset();
    router.navigate.calls.reset();
    if(fixture){
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
      expect(component.displayedColumns()).toEqual(['id', 'name', 'description', 'price', 'amount', 'actions']);
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
      const errorMessage = 'Error loading products';
      productService.getAllProducts.and.returnValue(throwError(() => errorMessage));

      const consoleSpy = spyOn(console, 'error');

      component.loadProducts();

      expect(component.loading()).toBeFalse();
      expect(consoleSpy).toHaveBeenCalledWith('Error loading products:', errorMessage);
      expect(productService.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('Filter Products - Success and Edge Cases', () => {
    beforeEach(() => {
      component.dataSource.data = mockProducts;
      fixture.detectChanges();
    });

    it('should filter products successfully when filter value exists', () => {
      const filterValue = 'Amoxicilina 500mg';
      const mockEvent = { target: { value: filterValue } } as unknown as Event;

      component.applyFilter(mockEvent);

      expect(component.dataSource.filter).toBe(filterValue.trim().toLowerCase());
      expect(component.dataSource.filteredData.length).toBe(1);
      expect(component.dataSource.filteredData[0].name).toBe('Amoxicilina 500mg');
    });
    it('should show all products when filter value is empty', () => {
      // ÉXITO: Filtro vacío
      const filterValue = '';
      const mockEvent = { target: { value: filterValue } } as unknown as Event;

      component.applyFilter(mockEvent);

      expect(component.dataSource.filter).toBe('');
      expect(component.dataSource.filteredData.length).toBe(mockProducts.length);
    });
    it('should handle filter when paginator is not available', () => {
      // FALLO: Paginator no disponible
      const filterValue = 'Ibuprofeno';
      const mockEvent = { target: { value: filterValue } } as unknown as Event;
      component.dataSource.paginator = null;

      expect(() => component.applyFilter(mockEvent)).not.toThrow();
      expect(component.dataSource.filter).toBe('ibuprofeno');
    });
  });

  describe('Load Products - Success and Failure', () => {
    it('should handle error when loading products fails', () => {
      // FALLO: Error al cargar productos
      const errorMessage = 'Error loading products';
      productService.getAllProducts.and.returnValue(throwError(() => errorMessage));

      const consoleSpy = spyOn(console, 'error');

      // Llamar loadProducts directamente para probar el caso de error
      component.loadProducts();

      expect(component.loading()).toBeFalse();
      expect(consoleSpy).toHaveBeenCalledWith('Error loading products:', errorMessage);
      expect(productService.getAllProducts).toHaveBeenCalled();
    });
    it('should set loading to true when starting to load products', fakeAsync(() => {
      // Usar un Subject para controlar el momento de la emisión
      const productsSubject = new Subject<Product[]>();
      productService.getAllProducts.and.returnValue(productsSubject.asObservable());

      component.loadProducts();

      // En este punto, loading debería ser true
      expect(component.loading()).toBeTrue();

      // Completar el observable
      productsSubject.next(mockProducts);
      productsSubject.complete();
      tick();

      // Ahora loading debería ser false
      expect(component.loading()).toBeFalse();
    }));
  })

  describe('Add Product - Success and Failure', () => {
    it('should navigate to product form for adding new product successfully', () => {
      component.addProduct();

      expect(router.navigate).toHaveBeenCalledWith(['/producto'], {
        queryParams: {
          action: 'new',
          source: 'productos'
        }
      });
    });
    it('should not break when router service fails', () => {
      router.navigate.and.returnValue(Promise.reject('Navigation failed'));

      component.addProduct();

      expect(router.navigate).toHaveBeenCalled();
    });
  })

  describe('Edit Product - Success and Failure', () => {
    it('should navigate to product form for editing product successfully', () => {
      const consoleSpy = spyOn(console, 'log');

      component.editProduct(mockProducts[0]);

      expect(consoleSpy).toHaveBeenCalledWith(mockProducts[0]);
      expect(router.navigate).toHaveBeenCalledWith(['/producto'], {
        state: { 
          product: mockProducts[0],
          action: 'edit'
        } 
      });
    });
    it('should handle navigation failure when editing product', () => {
      router.navigate.and.returnValue(Promise.reject('Edit navigation failed'));

      expect(() => component.editProduct( mockProducts[0])).not.toThrow();
      expect(router.navigate).toHaveBeenCalled();
    });
  })
/*
  describe('View Initialization - Success and Edge Cases', () => {
    it('should set paginator and sort after view init successfully', () => {
      const paginatorMock = {} as any;
      const sortMock = {} as any;
      
      component.paginator = paginatorMock;
      component.sort = sortMock;

      component.ngAfterViewInit();

      expect(component.dataSource.paginator).toBe(paginatorMock);
      expect(component.dataSource.sort).toBe(sortMock);
    });

  })
    */
})
