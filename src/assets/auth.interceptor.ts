import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  let token = localStorage.getItem('access_token'); // Obtén el token almacenado
  if (token) {
    token = token.replace(/['"]+/g, ''); // Elimina cualquier comilla simple o doble
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Agrega el token al encabezado
      },
    });
  }
  return next(req); // Continua con la solicitud
};
