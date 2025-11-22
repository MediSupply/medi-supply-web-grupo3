import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('Cargando...');

  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  public message$: Observable<string> = this.messageSubject.asObservable();

  show(message: string = 'Cargando...'): void {
    setTimeout(() => {
      this.messageSubject.next(message);
      this.loadingSubject.next(true);
    });
  }

  hide(): void {
    setTimeout(() => {
      this.loadingSubject.next(false);
    });
  }

  setMessage(message: string): void {
    setTimeout(() => {
      this.messageSubject.next(message);
    });
  }
}
