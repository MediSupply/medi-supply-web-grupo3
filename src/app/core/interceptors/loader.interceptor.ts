import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

let activeRequests = 0;

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const excludedUrls = ['ignore-loader', 'assets/'];
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));
  
  if (shouldExclude) {
    return next(req);
  }

  activeRequests++;
  loaderService.show();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log(router.url)
        snackBar.open("Usuario no autorizado", 'Cerrar', {
          duration: 3000,
        });
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url }
        });
      }
      
      return throwError(() => error);
    }),
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0) {
        loaderService.hide();
      }
    })
  );
};