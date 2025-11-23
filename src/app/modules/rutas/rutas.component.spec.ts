import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { RutasComponent, Pedido, RutaGenerada } from './rutas.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PageEvent } from '@angular/material/paginator';

describe('RutasComponent', () => {
  let component: RutasComponent;
  let fixture: ComponentFixture<RutasComponent>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [RutasComponent, NoopAnimationsModule],
      providers: [{ provide: MatSnackBar, useValue: snackBarSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RutasComponent);
    component = fixture.componentInstance;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Inicialización', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar con valores por defecto', () => {
      expect(component.displayedColumns).toEqual([
        'seleccionIdPedido',
        'cliente',
        'direccionEntrega',
        'observaciones',
        'estado',
      ]);
      expect(component.pageSize).toBe(8);
      expect(component.pageIndex).toBe(0);
      expect(component.length).toBeGreaterThan(0);
      expect(component.mostrandoRuta).toBeFalse();
      expect(component.generandoRuta).toBeFalse();
      expect(component.rutaGenerada).toBeNull();
    });

    it('debería cargar pedidos paginados en ngOnInit', () => {
      component.ngOnInit();
      expect(component.pedidosPaginados.length).toBeLessThanOrEqual(
        component.pageSize
      );
      expect(component.pedidosPaginados.length).toBeGreaterThan(0);
    });

    it('debería tener 20 pedidos iniciales', () => {
      expect(component.pedidos.length).toBe(20);
    });
  });

  describe('Paginación', () => {
    it('debería actualizar pedidos paginados correctamente', () => {
      component.pageIndex = 0;
      component.pageSize = 8;
      component.actualizarPedidosPaginados();

      expect(component.pedidosPaginados.length).toBe(8);
      expect(component.pedidosPaginados[0].id).toBe('001');
    });

    it('debería cambiar de página correctamente', () => {
      const event: PageEvent = {
        pageIndex: 1,
        pageSize: 8,
        length: component.length,
      };

      component.onPageChange(event);

      expect(component.pageIndex).toBe(1);
      expect(component.pageSize).toBe(8);
      expect(component.pedidosPaginados.length).toBe(8);
    });

    it('debería calcular el total de páginas correctamente', () => {
      component.length = 20;
      component.pageSize = 8;
      const total = component.totalPaginas();
      expect(total).toBe(3); // Math.ceil(20/8) = 3
    });

    it('debería ir a la primera página', () => {
      component.pageIndex = 2;
      component.irAPrimeraPagina();
      expect(component.pageIndex).toBe(0);
    });

    it('debería no cambiar si ya está en la primera página', () => {
      component.pageIndex = 0;
      const initialPedidos = [...component.pedidosPaginados];
      component.irAPrimeraPagina();
      expect(component.pageIndex).toBe(0);
      expect(component.pedidosPaginados).toEqual(initialPedidos);
    });

    it('debería ir a la última página', () => {
      component.pageIndex = 0;
      component.length = 20;
      component.pageSize = 8;
      component.irAUltimaPagina();
      expect(component.pageIndex).toBe(component.totalPaginas() - 1);
    });

    it('debería no cambiar si ya está en la última página', () => {
      component.length = 20;
      component.pageSize = 8;
      component.pageIndex = component.totalPaginas() - 1;
      const initialPedidos = [...component.pedidosPaginados];
      component.irAUltimaPagina();
      expect(component.pageIndex).toBe(component.totalPaginas() - 1);
    });

    it('debería ir a la página anterior', () => {
      component.pageIndex = 2;
      component.paginaAnterior();
      expect(component.pageIndex).toBe(1);
    });

    it('debería no cambiar si está en la primera página al ir atrás', () => {
      component.pageIndex = 0;
      const initialPedidos = [...component.pedidosPaginados];
      component.paginaAnterior();
      expect(component.pageIndex).toBe(0);
    });

    it('debería ir a la página siguiente', () => {
      component.pageIndex = 0;
      component.length = 20;
      component.pageSize = 8;
      component.paginaSiguiente();
      expect(component.pageIndex).toBe(1);
    });

    it('debería no cambiar si está en la última página al avanzar', () => {
      component.length = 20;
      component.pageSize = 8;
      component.pageIndex = component.totalPaginas() - 1;
      const initialPedidos = [...component.pedidosPaginados];
      component.paginaSiguiente();
      expect(component.pageIndex).toBe(component.totalPaginas() - 1);
    });
  });

  describe('Selección de pedidos', () => {
    it('debería togglear la selección de un pedido', () => {
      const pedido = component.pedidos[0];
      const estadoInicial = pedido.seleccionado;

      component.toggleSeleccion(pedido);

      expect(pedido.seleccionado).toBe(!estadoInicial);
    });

    it('debería seleccionar todos los pedidos cuando ninguno está seleccionado', () => {
      component.pedidosPaginados.forEach(p => (p.seleccionado = false));

      component.toggleSeleccionTodos();

      expect(component.todosSeleccionados()).toBeTrue();
      component.pedidosPaginados.forEach(p => {
        expect(p.seleccionado).toBeTrue();
      });
    });

    it('debería deseleccionar todos los pedidos cuando todos están seleccionados', () => {
      component.pedidosPaginados.forEach(p => (p.seleccionado = true));

      component.toggleSeleccionTodos();

      expect(component.todosSeleccionados()).toBeFalse();
      component.pedidosPaginados.forEach(p => {
        expect(p.seleccionado).toBeFalse();
      });
    });

    it('debería actualizar el array principal al toggleear todos', () => {
      const pedidoPaginado = component.pedidosPaginados[0];
      const pedidoPrincipal = component.pedidos.find(
        p => p.id === pedidoPaginado.id
      );

      if (pedidoPrincipal) {
        pedidoPaginado.seleccionado = false;
        component.toggleSeleccionTodos();

        expect(pedidoPrincipal.seleccionado).toBeTrue();
      }
    });

    it('debería retornar true cuando todos están seleccionados', () => {
      component.pedidosPaginados.forEach(p => (p.seleccionado = true));
      expect(component.todosSeleccionados()).toBeTrue();
    });

    it('debería retornar false cuando ninguno está seleccionado', () => {
      component.pedidosPaginados.forEach(p => (p.seleccionado = false));
      expect(component.todosSeleccionados()).toBeFalse();
    });

    it('debería retornar false cuando la lista está vacía', () => {
      component.pedidosPaginados = [];
      expect(component.todosSeleccionados()).toBeFalse();
    });

    it('debería retornar true cuando algunos están seleccionados', () => {
      component.pedidosPaginados[0].seleccionado = true;
      component.pedidosPaginados[1].seleccionado = false;
      expect(component.algunosSeleccionados()).toBeTrue();
    });

    it('debería retornar false cuando todos están seleccionados', () => {
      component.pedidosPaginados.forEach(p => (p.seleccionado = true));
      expect(component.algunosSeleccionados()).toBeFalse();
    });

    it('debería retornar false cuando ninguno está seleccionado', () => {
      component.pedidosPaginados.forEach(p => (p.seleccionado = false));
      expect(component.algunosSeleccionados()).toBeFalse();
    });

    it('debería llamar toggleSeleccionTodos desde toggleSeleccionTodosEnHeader', () => {
      spyOn(component, 'toggleSeleccionTodos');
      component.toggleSeleccionTodosEnHeader();
      expect(component.toggleSeleccionTodos).toHaveBeenCalled();
    });
  });

  describe('Generación de ruta', () => {
    beforeEach(() => {
      snackBar.open.calls.reset();
    });

    afterEach(() => {
      snackBar.open.calls.reset();
    });

    it('debería mostrar mensaje cuando no hay pedidos pendientes', () => {
      // Asegurar que todos los pedidos tengan estado diferente a 'Pendiente'
      // Necesitamos modificar el array directamente
      for (let i = 0; i < component.pedidos.length; i++) {
        component.pedidos[i].estado = 'Completado';
        component.pedidos[i].seleccionado = false;
      }

      // Verificar que efectivamente no hay pedidos pendientes
      const pedidosPendientes = component.pedidos.filter(
        p => p.estado === 'Pendiente'
      );
      expect(pedidosPendientes.length).toBe(0);

      // Espiar directamente el snackBar del componente
      const snackBarSpy = spyOn(
        (component as any).snackBar,
        'open'
      ).and.callThrough();

      component.generarRuta();

      expect(snackBarSpy).toHaveBeenCalled();
      expect(snackBarSpy).toHaveBeenCalledWith(
        'No existen pedidos pendientes para generar ruta.',
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['warning-snackbar'],
        }
      );
    });

    it('debería mostrar mensaje cuando no hay pedidos seleccionados', () => {
      // Asegurar que todos los pedidos estén pendientes pero no seleccionados
      for (let i = 0; i < component.pedidos.length; i++) {
        component.pedidos[i].estado = 'Pendiente';
        component.pedidos[i].seleccionado = false;
      }

      // Verificar que hay pedidos pendientes pero ninguno seleccionado
      const pedidosPendientes = component.pedidos.filter(
        p => p.estado === 'Pendiente'
      );
      const pedidosSeleccionados = component.pedidos.filter(
        p => p.seleccionado
      );
      expect(pedidosPendientes.length).toBeGreaterThan(0);
      expect(pedidosSeleccionados.length).toBe(0);

      // Espiar directamente el snackBar del componente
      const snackBarSpy = spyOn(
        (component as any).snackBar,
        'open'
      ).and.callThrough();

      component.generarRuta();

      expect(snackBarSpy).toHaveBeenCalled();
      expect(snackBarSpy).toHaveBeenCalledWith(
        'Por favor seleccione al menos un pedido para generar la ruta.',
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['warning-snackbar'],
        }
      );
    });

    it('debería generar ruta exitosamente con pedidos seleccionados', fakeAsync(() => {
      // Configurar pedidos seleccionados
      component.pedidos.forEach(p => {
        p.estado = 'Pendiente';
        p.seleccionado = true;
      });

      // Espiar directamente el snackBar del componente
      const snackBarSpy = spyOn(
        (component as any).snackBar,
        'open'
      ).and.callThrough();

      // Mockear Date.now() para controlar el tiempo
      // Primera llamada: inicioTiempo, Segunda llamada: después del cálculo
      let callCount = 0;
      spyOn(Date, 'now').and.callFake(() => {
        callCount++;
        // Primera llamada retorna 1000, segunda retorna 1010 (10ms de cálculo)
        return callCount === 1 ? 1000 : 1010;
      });

      component.generarRuta();

      expect(component.generandoRuta).toBeTrue();
      expect(component.mostrandoRuta).toBeFalse();
      expect(component.rutaGenerada).toBeNull();

      // Avanzar el tiempo para que se ejecute el setTimeout
      // El delay es 3000 - (1010 - 1000) = 2990ms
      tick(2990);
      flush(); // Asegurar que todos los timers pendientes se completen

      expect(component.generandoRuta).toBeFalse();
      expect(component.mostrandoRuta).toBeTrue();
      expect(component.rutaGenerada).not.toBeNull();
      expect(component.rutaGenerada?.pedidos.length).toBeGreaterThan(0);
      expect(component.rutaGenerada?.distanciaTotal).toBeDefined();
      expect(component.rutaGenerada?.tiempoEstimado).toBeDefined();
      expect(snackBarSpy).toHaveBeenCalledWith(
        'Ruta de entrega generada exitosamente.',
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['success-snackbar'],
        }
      );
    }));

    it('debería actualizar el estado de los pedidos después de generar ruta', fakeAsync(() => {
      const pedidosSeleccionados = component.pedidos.slice(0, 3);
      pedidosSeleccionados.forEach(p => {
        p.estado = 'Pendiente';
        p.seleccionado = true;
      });

      // Mockear Date.now()
      let callCount = 0;
      spyOn(Date, 'now').and.callFake(() => {
        callCount++;
        return callCount === 1 ? 1000 : 1010;
      });

      component.generarRuta();
      tick(2990);
      flush(); // Asegurar que todos los timers pendientes se completen

      pedidosSeleccionados.forEach(p => {
        const pedidoOriginal = component.pedidos.find(po => po.id === p.id);
        if (pedidoOriginal && component.rutaGenerada) {
          const enRuta = component.rutaGenerada.pedidos.some(
            pr => pr.id === pedidoOriginal.id
          );
          if (enRuta) {
            expect(pedidoOriginal.estado).toBe('En ruta');
            expect(pedidoOriginal.seleccionado).toBeFalse();
          }
        }
      });
    }));

    it('debería manejar error al generar ruta', () => {
      // Configurar pedidos
      component.pedidos.forEach(p => {
        p.estado = 'Pendiente';
        p.seleccionado = true;
      });

      // Espiar directamente el snackBar del componente
      const snackBarSpy = spyOn(
        (component as any).snackBar,
        'open'
      ).and.callThrough();

      // Mockear Date.now() para evitar problemas
      spyOn(Date, 'now').and.returnValue(1000);

      // Hacer que calcularRutaOptimizada lance un error
      spyOn(component, 'calcularRutaOptimizada').and.throwError(
        'Error de cálculo'
      );

      component.generarRuta();

      expect(component.generandoRuta).toBeFalse();
      expect(snackBarSpy).toHaveBeenCalled();
      expect(snackBarSpy).toHaveBeenCalledWith(
        'Ha ocurrido un error al generar la ruta, intente nuevamente.',
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['error-snackbar'],
        }
      );
    });
  });

  describe('Cálculo de coordenadas y distancias', () => {
    it('debería agregar coordenadas a los pedidos', () => {
      const pedidos: Pedido[] = [
        {
          id: '001',
          cliente: 'Cliente 1',
          direccionEntrega: 'Cra 34 # 14-44',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
        },
      ];

      const pedidosConCoordenadas = component.agregarCoordenadas(pedidos);

      expect(pedidosConCoordenadas[0].latitud).toBeDefined();
      expect(pedidosConCoordenadas[0].longitud).toBeDefined();
      expect(pedidosConCoordenadas[0].latitud).toBeGreaterThan(0);
      expect(pedidosConCoordenadas[0].longitud).toBeLessThan(0);
    });

    it('debería calcular distancia entre dos pedidos con coordenadas', () => {
      const pedido1: Pedido = {
        id: '001',
        cliente: 'Cliente 1',
        direccionEntrega: 'Test',
        observaciones: 'Test',
        estado: 'Pendiente',
        seleccionado: false,
        latitud: 4.6097,
        longitud: -74.0817,
      };

      const pedido2: Pedido = {
        id: '002',
        cliente: 'Cliente 2',
        direccionEntrega: 'Test',
        observaciones: 'Test',
        estado: 'Pendiente',
        seleccionado: false,
        latitud: 4.6107,
        longitud: -74.0827,
      };

      const distancia = component.calcularDistancia(pedido1, pedido2);

      expect(distancia).toBeGreaterThan(0);
      expect(typeof distancia).toBe('number');
    });

    it('debería calcular distancia aleatoria cuando no hay coordenadas', () => {
      const pedido1: Pedido = {
        id: '001',
        cliente: 'Cliente 1',
        direccionEntrega: 'Test',
        observaciones: 'Test',
        estado: 'Pendiente',
        seleccionado: false,
      };

      const pedido2: Pedido = {
        id: '002',
        cliente: 'Cliente 2',
        direccionEntrega: 'Test',
        observaciones: 'Test',
        estado: 'Pendiente',
        seleccionado: false,
      };

      const distancia = component.calcularDistancia(pedido1, pedido2);

      expect(distancia).toBeGreaterThanOrEqual(0);
      expect(distancia).toBeLessThan(10);
    });

    it('debería convertir grados a radianes correctamente', () => {
      const grados = 180;
      const radianes = component.toRad(grados);
      expect(radianes).toBeCloseTo(Math.PI, 5);
    });

    it('debería calcular distancia total de una ruta', () => {
      const pedidos: Pedido[] = [
        {
          id: '001',
          cliente: 'Cliente 1',
          direccionEntrega: 'Test',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
          latitud: 4.6097,
          longitud: -74.0817,
        },
        {
          id: '002',
          cliente: 'Cliente 2',
          direccionEntrega: 'Test',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
          latitud: 4.6107,
          longitud: -74.0827,
        },
        {
          id: '003',
          cliente: 'Cliente 3',
          direccionEntrega: 'Test',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
          latitud: 4.6117,
          longitud: -74.0837,
        },
      ];

      const distanciaTotal = component.calcularDistanciaTotal(pedidos);

      expect(distanciaTotal).toBeGreaterThan(0);
      expect(typeof distanciaTotal).toBe('number');
    });

    it('debería retornar 0 para distancia total con un solo pedido', () => {
      const pedidos: Pedido[] = [
        {
          id: '001',
          cliente: 'Cliente 1',
          direccionEntrega: 'Test',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
        },
      ];

      const distanciaTotal = component.calcularDistanciaTotal(pedidos);

      expect(distanciaTotal).toBe(0);
    });
  });

  describe('Optimización de ruta', () => {
    it('debería retornar el mismo pedido si solo hay uno', () => {
      const pedidos: Pedido[] = [
        {
          id: '001',
          cliente: 'Cliente 1',
          direccionEntrega: 'Test',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
          latitud: 4.6097,
          longitud: -74.0817,
        },
      ];

      const ruta = component.calcularRutaOptimizada(pedidos);

      expect(ruta.length).toBe(1);
      expect(ruta[0].id).toBe('001');
    });

    it('debería optimizar ruta con múltiples pedidos', () => {
      const pedidos: Pedido[] = [
        {
          id: '001',
          cliente: 'Cliente 1',
          direccionEntrega: 'Test',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
          latitud: 4.6097,
          longitud: -74.0817,
        },
        {
          id: '002',
          cliente: 'Cliente 2',
          direccionEntrega: 'Test',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
          latitud: 4.6107,
          longitud: -74.0827,
        },
        {
          id: '003',
          cliente: 'Cliente 3',
          direccionEntrega: 'Test',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
          latitud: 4.6117,
          longitud: -74.0837,
        },
      ];

      const ruta = component.calcularRutaOptimizada(pedidos);

      expect(ruta.length).toBe(3);
      expect(ruta[0].id).toBe('001'); // El primero siempre es el punto de partida
    });

    it('debería incluir todos los pedidos en la ruta optimizada', () => {
      const pedidos: Pedido[] = [
        {
          id: '001',
          cliente: 'Cliente 1',
          direccionEntrega: 'Test',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
          latitud: 4.6097,
          longitud: -74.0817,
        },
        {
          id: '002',
          cliente: 'Cliente 2',
          direccionEntrega: 'Test',
          observaciones: 'Test',
          estado: 'Pendiente',
          seleccionado: false,
          latitud: 4.6107,
          longitud: -74.0827,
        },
      ];

      const ruta = component.calcularRutaOptimizada(pedidos);
      const idsEnRuta = ruta.map(p => p.id);

      expect(idsEnRuta).toContain('001');
      expect(idsEnRuta).toContain('002');
    });
  });

  describe('Cerrar ruta', () => {
    it('debería cerrar la ruta y limpiar el estado', () => {
      component.mostrandoRuta = true;
      component.rutaGenerada = {
        pedidos: [],
        distanciaTotal: 10,
        tiempoEstimado: 20,
      };

      component.cerrarRuta();

      expect(component.mostrandoRuta).toBeFalse();
      expect(component.rutaGenerada).toBeNull();
    });
  });
});
