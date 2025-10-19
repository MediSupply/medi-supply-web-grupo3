import { Component, signal, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SidebarComponent } from './shared/components/sidebar/sidebar/sidebar.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Pais } from './modules/producto/models/pais';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  logoError = signal(false);
  title = 'meddi-supply'
  private router = inject(Router);
  private routerSubscription!: Subscription;
  toppings = new FormControl('');

  paises: Pais[] = [
    {id:0, value:'Colombia'},
    {id:1, value:'Chile'}, 
    {id:2, value:'Peru'}
  ];
  paisSeleccionado = this.paises[0].id;
  
  // Señales de estado
  sidebarOpen = signal(true);
  isMobileView = signal(false);
  
  // Computed values
  showSidebar = computed(() => this.sidebarOpen() && !this.isAuthPage());
  showHeader = computed(() => !this.isAuthPage());
  
  // Títulos y breadcrumbs dinámicos
  currentPageTitle = signal('Producto');
  breadcrumbs = signal<{ label: string; path: string }[]>([]);


  ngOnInit() {
    this.setupRouterListener();
    this.checkViewport();
    this.updatePageInfo(this.router.url);
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private setupRouterListener(): void {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        this.updatePageInfo(event.url);
      });
  }

  private updatePageInfo(url: string): void {
    // Actualizar título
    const title = 'meddi-supply';
    this.currentPageTitle.set(title);
  
  }

  private isAuthPage(): boolean {
    return this.router.url.includes('/auth');
  }

  private checkViewport(): void {
    const checkMobile = () => {
      this.isMobileView.set(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        this.sidebarOpen.set(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
  }

  isMobile(): boolean {
    return this.isMobileView();
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  onLogoError(event: Event): void {
    console.warn('Logo no encontrado, usando placeholder');
    this.logoError.set(true);
  }
}
