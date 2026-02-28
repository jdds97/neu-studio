import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith('/keystatic')) {
    return next();
  }

  const user = import.meta.env.KEYSTATIC_USER || 'admin';
  const pass = import.meta.env.KEYSTATIC_PASSWORD;

  if (!pass) {
    return next();
  }

  const auth = context.request.headers.get('Authorization');

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic') {
      const decoded = atob(encoded);
      const [u, p] = decoded.split(':');
      if (u === user && p === pass) {
        return next();
      }
    }
  }

  return new Response('Acceso restringido', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Keystatic CMS"' },
  });
});
