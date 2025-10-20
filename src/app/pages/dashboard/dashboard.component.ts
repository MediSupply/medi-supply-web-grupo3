import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  logoError = signal(false);
  title = 'meddi-supply';
  private router = inject(Router);
  private routerSubscription!: Subscription;
  toppings = new FormControl('');

  paises = [
    { id: 0, value: 'Colombia' },
    { id: 1, value: 'Chile' },
    { id: 2, value: 'Peru' },
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
      .pipe(filter(event => event instanceof NavigationEnd))
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
