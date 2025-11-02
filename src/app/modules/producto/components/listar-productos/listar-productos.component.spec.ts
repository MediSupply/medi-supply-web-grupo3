import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

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
import { of, Subject, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductoService } from '../../../../services/producto.service';

describe('ListarProductosComponent', () => {
  let component: ListarProductosComponent;
  let fixture: ComponentFixture<ListarProductosComponent>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let productService: jasmine.SpyObj<ProductoService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let debugElement: DebugElement;

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
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const productServiceSpy = jasmine.createSpyObj('ProductoService', ['getAllProducts']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], { // Agrega este spy
      snapshot: {
        paramMap: new Map(),
        queryParamMap: new Map()
      }
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
        MatIconModule
        ],
        providers: [
          { provide: ProductoService, useValue: productServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy }
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarProductosComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductoService) as jasmine.SpyObj<ProductoService>;
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
        target: { value: 'acetaminofén' }
      } as unknown as Event;

      spyOn(component.dataSource.paginator!, 'firstPage');

      component.applyFilter(mockEvent);

      expect(component.dataSource.filter).toBe('acetaminofén');
      expect(component.dataSource.paginator?.firstPage).toHaveBeenCalled();
    });
  })
  
  it('should show alert when no products are found', () => {
    // Configurar datos iniciales
    component.dataSource.data = mockProducts;
    component.ngAfterViewInit();

    const mockEvent = {
      target: { value: 'producto que no existe' }
    } as unknown as Event;

    // Espiar el alert
    spyOn(window, 'alert');

    component.applyFilter(mockEvent);

    expect(component.dataSource.filter).toBe('producto que no existe');
    expect(window.alert).toHaveBeenCalledWith('Producto no encontrado');
  });

  describe('addProduct', () => {
    it('should navigate to producto route with new action and source query params', () => {
      component.addProduct();

      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['../producto'],
        {
          relativeTo: activatedRouteSpy,
          queryParams: {
            action: 'new',
            source: 'productos',
          }
        }
      );
    });
  })

  describe('editProduct', () => {
    it('should navigate to producto route with product state and edit action', () => {
      const mockProduct: Product = mockProducts[0];

      component.editProduct(mockProduct);

      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['../producto'],
        {
          relativeTo: activatedRouteSpy,
          state: {
            product: mockProduct,
            action: 'edit',
          }
        }
      );
    });
  })
 
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
  })
})


