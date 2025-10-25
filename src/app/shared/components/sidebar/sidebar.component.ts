import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../services/auth.service';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: MenuItem[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private routerSubscription!: Subscription;
  logoError = signal(false);
  menuItems = signal<MenuItem[]>([
    {
      id: 'producto',
      label: 'Productos',
      icon: 'home',
      path: '/dashboard/productos',
      /*children: [
        { id: 'registro-ventas', label: 'Listar Productos', icon: '💰', path: '/registro/ventas' },
        { id: 'registro-compras', label: 'Cargar Producto', icon: '🛒', path: '/registro/compras' },
      ],*/
      isExpanded: false,
    },
    {
      id: 'registro',
      label: 'Registro',
      icon: 'person_add',
      path: '/dashboard/registro',
      isExpanded: false,
    },
    {
      id: 'plan-venta',
      label: 'Plan de Ventas',
      icon: 'folder',
      path: '/plan',
      isExpanded: false,
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: 'insert_drive_file',
      path: '/dashboard/reportes',
      isExpanded: false,
    },
    {
      id: 'rutas',
      label: 'Rutas',
      icon: 'add_circle_outline',
      path: '/rutas',
      isExpanded: false,
    },
  ]);

  ngOnInit() {
    this.setupRouterListener();
    this.autoExpandMenus();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private setupRouterListener(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.autoExpandMenus();
      });
  }

  toggleSubmenu(item: MenuItem): void {
    this.menuItems.update(items =>
      items.map(menuItem =>
        menuItem.id === item.id
          ? { ...menuItem, isExpanded: !menuItem.isExpanded }
          : menuItem
      )
    );
  }

  isActive(item: MenuItem): boolean {
    const currentUrl = this.router.url;

    if (item.children) {
      return item.children.some(child => currentUrl.startsWith(child.path));
    }

    return currentUrl.startsWith(item.path);
  }

  private autoExpandMenus(): void {
    const currentUrl = this.router.url;

    this.menuItems.update(items =>
      items.map(item => {
        if (item.children) {
          const shouldExpand = item.children.some(child =>
            currentUrl.startsWith(child.path)
          );
          return { ...item, isExpanded: shouldExpand };
        }
        return item;
      })
    );
  }

  onLogoError(event: Event): void {
    console.warn('Avatar no encontrado, usando placeholder');
    this.logoError.set(true);
  }

  logOut() {
    this.authService.logout();
  }
}
