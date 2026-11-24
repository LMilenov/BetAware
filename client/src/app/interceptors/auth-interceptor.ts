
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof localStorage === 'undefined') {
    return next(req);
  }

  const token = localStorage.getItem('betaware_token');

  if (!token || !req.url.startsWith(environment.apiUrl + '/')) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
