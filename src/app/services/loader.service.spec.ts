import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService],
    });
    service = TestBed.inject(LoaderService);
  });

  describe('Estado inicial', () => {
    it('debería crearse correctamente', () => {
      expect(service).toBeTruthy();
    });

    it('debería tener estado inicial de loading en false', done => {
      service.loading$.subscribe(loading => {
        expect(loading).toBeFalse();
        done();
      });
    });

    it('debería tener mensaje inicial "Cargando..."', done => {
      service.message$.subscribe(message => {
        expect(message).toBe('Cargando...');
        done();
      });
    });
  });

  describe('show method', () => {
    it('debería mostrar el loader con mensaje por defecto', fakeAsync(() => {
      service.show();

      tick(); // Avanzar el tiempo para ejecutar el setTimeout

      service.loading$.subscribe(loading => {
        expect(loading).toBeTrue();
      });

      service.message$.subscribe(message => {
        expect(message).toBe('Cargando...');
      });
    }));

    it('debería mostrar el loader con mensaje personalizado', fakeAsync(() => {
      const customMessage = 'Guardando datos...';
      service.show(customMessage);

      tick();

      service.loading$.subscribe(loading => {
        expect(loading).toBeTrue();
      });

      service.message$.subscribe(message => {
        expect(message).toBe(customMessage);
      });
    }));

    it('debería actualizar tanto el loading como el mensaje', fakeAsync(() => {
      const customMessage = 'Procesando...';

      service.show(customMessage);
      tick();

      let loadingValue: boolean;
      let messageValue: string;

      service.loading$.subscribe(loading => (loadingValue = loading));
      service.message$.subscribe(message => (messageValue = message));

      expect(loadingValue!).toBeTrue();
      expect(messageValue!).toBe(customMessage);
    }));
  });

  describe('hide method', () => {
    it('debería ocultar el loader', fakeAsync(() => {
      let loadingValue: boolean;
      service.show();
      tick();

      service.loading$.subscribe(loading => {
        loadingValue = loading;
      });
      expect(loadingValue!).toBeTrue();

      service.hide();
      tick();

      service.loading$.subscribe(loading => {
        loadingValue = loading;
      });
      expect(loadingValue!).toBeFalse();
    }));

    it('debería mantener el mensaje al ocultar', fakeAsync(() => {
      const customMessage = 'Cargando usuarios...';

      service.show(customMessage);
      tick();

      service.hide();
      tick();

      service.message$.subscribe(message => {
        expect(message).toBe(customMessage); // El mensaje se mantiene
      });

      service.loading$.subscribe(loading => {
        expect(loading).toBeFalse(); // Pero el loading se desactiva
      });
    }));
  });

  describe('setMessage method', () => {
    it('debería cambiar el mensaje sin afectar el estado de loading', fakeAsync(() => {
      // Estado inicial
      service.loading$.subscribe(loading => {
        expect(loading).toBeFalse();
      });

      const newMessage = 'Actualizando...';
      service.setMessage(newMessage);
      tick();

      service.message$.subscribe(message => {
        expect(message).toBe(newMessage);
      });

      // Loading sigue en false
      service.loading$.subscribe(loading => {
        expect(loading).toBeFalse();
      });
    }));

    it('debería cambiar el mensaje cuando el loader está visible', fakeAsync(() => {
      // Mostrar loader primero
      service.show('Mensaje inicial');
      tick();

      // Cambiar mensaje
      const updatedMessage = 'Casi terminado...';
      service.setMessage(updatedMessage);
      tick();

      service.message$.subscribe(message => {
        expect(message).toBe(updatedMessage);
      });

      service.loading$.subscribe(loading => {
        expect(loading).toBeTrue(); // Loading sigue activo
      });
    }));
  });

  describe('Comportamiento asíncrono', () => {
    it('debería manejar múltiples llamadas show/hide correctamente', fakeAsync(() => {
      service.show('Primer mensaje');
      let loadingValue: boolean;
      tick();

      service.loading$.subscribe(loading => {
        loadingValue = loading;
      });
      expect(loadingValue!).toBeTrue();

      service.hide();
      tick();

      service.loading$.subscribe(loading => {
        loadingValue = loading;
      });
      expect(loadingValue!).toBeFalse();

      service.show('Segundo mensaje');
      tick();

      service.loading$.subscribe(loading => {
        expect(loading).toBeTrue();
      });

      service.message$.subscribe(message => {
        expect(message).toBe('Segundo mensaje');
      });
    }));

    it('debería respetar el orden de ejecución con setTimeout', fakeAsync(() => {
      const loadingStates: boolean[] = [];
      const messages: string[] = [];

      service.loading$.subscribe(loading => loadingStates.push(loading));
      service.message$.subscribe(message => messages.push(message));

      // Estado inicial
      expect(loadingStates).toEqual([false]);
      expect(messages).toEqual(['Cargando...']);

      // Mostrar loader
      service.show('Procesando...');
      tick();

      expect(loadingStates).toEqual([false, true]);
      expect(messages).toEqual(['Cargando...', 'Procesando...']);

      // Ocultar loader
      service.hide();
      tick();

      expect(loadingStates).toEqual([false, true, false]);
      // El mensaje no cambia al ocultar
      expect(messages).toEqual(['Cargando...', 'Procesando...']);
    }));
  });

  describe('Métodos observables', () => {
    it('debería emitir nuevos valores a los observables', done => {
      const loadingValues: boolean[] = [];
      const messageValues: string[] = [];

      const loadingSubscription = service.loading$.subscribe(value => {
        loadingValues.push(value);
        if (loadingValues.length === 2) {
          expect(loadingValues).toEqual([false, true]);
          loadingSubscription.unsubscribe();
          checkDone();
        }
      });

      const messageSubscription = service.message$.subscribe(value => {
        messageValues.push(value);
        if (messageValues.length === 2) {
          expect(messageValues).toEqual(['Cargando...', 'Nuevo mensaje']);
          messageSubscription.unsubscribe();
          checkDone();
        }
      });

      let completedChecks = 0;
      function checkDone() {
        completedChecks++;
        if (completedChecks === 2) {
          done();
        }
      }

      service.show('Nuevo mensaje');
    });
  });
});
