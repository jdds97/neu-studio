# Neu Studio — Documento de Diseno

## Resumen

Web para Neu Studio, estudio de tatuaje en Dos Hermanas (Sevilla).
Estetica blanca, urbana, minimalista. Inspirada en nobleart.com pero con identidad propia.

---

## Stack Tecnico

| Componente | Tecnologia |
|------------|------------|
| Framework | Astro 5 + TypeScript |
| CSS | TailwindCSS 4 |
| CMS | Keystatic (Git-based, open source) |
| Reservas | Cal.com (embed, plan gratuito) |
| Smooth scroll | Lenis (astro-lenis) |
| Animaciones | GSAP ScrollTrigger |
| Lightbox | PhotoSwipe |
| Deploy | Cloudflare Pages |
| Formulario | Cloudflare Functions + Resend |
| Dominio | Cloudflare Registrar (.es) |

---

## Paleta de Color

| Rol | Hex | Descripcion |
|-----|-----|-------------|
| Fondo principal | `#FFFFFF` | Blanco puro |
| Fondo alterno | `#F5F5F0` | Off-white calido para separar secciones |
| Texto principal | `#1A1A1A` | Casi negro |
| Texto secundario | `#B6B6B6` | Gris marca |
| Lineas/bordes | `#E5E5E5` | Estructura sutil |
| Acento principal | `#2A2AEE` | Azul electrico marca |
| Acento hover | `#1E1ECC` | Azul oscuro para hover states |

### Estrategia de color
- Base monocromatica (blanco + negro + grises)
- Azul `#2A2AEE` como unico acento: CTAs, links, hover, elementos interactivos
- Las fotos de tatuajes aportan todo el color visual
- Efecto glow azul del logo como recurso grafico decorativo (CSS blur/gradient)

---

## Tipografia

| Uso | Fuente | Pesos | Letter-spacing |
|-----|--------|-------|----------------|
| Display/Hero | **Michroma** (Google Fonts) | 400 | -1px a -2px (tight) |
| Body/UI | **Outfit** (Google Fonts) | 300, 400, 500, 600 | 0 a 0.02em |
| Accent/Labels | **Space Grotesk** (Google Fonts) | 400, 500, 700 | 3px a 6px (wide, uppercase) |

### Escala tipografica

| Elemento | Font | Size (desktop) | Size (mobile) | Weight |
|----------|------|----------------|---------------|--------|
| Hero titulo | Michroma | clamp(3rem, 8vw, 6rem) | auto | 400 |
| H1 seccion | Michroma | clamp(2rem, 4vw, 3.5rem) | auto | 400 |
| H2 subtitulo | Outfit | 1.5rem | 1.25rem | 600 |
| Body | Outfit | 1rem (16px) | 1rem | 400 |
| Nav links | Outfit | 0.85rem | 0.85rem | 500 |
| Labels/tags | Space Grotesk | 0.75rem (12px) | 0.75rem | 500 |
| Boton CTA | Outfit | 0.875rem (14px) | 0.875rem | 500 |
| Caption galeria | Space Grotesk | 0.8125rem (13px) | 0.8125rem | 400 |

### Contraste tipografico (inspirado en nobleart)
- Titulares: letter-spacing tight (-2px), tamanio grande
- Labels/etiquetas: letter-spacing wide (3-6px), uppercase, tamanio pequenio
- Negritas parciales en titulares: "Tu proximo **tatuaje**"

---

## Estructura de Paginas (MVP)

### Paginas
1. `/` — Home (hero + servicios + galeria destacada + artistas + proceso + testimonios + CTA)
2. `/artistas` — Lista de artistas
3. `/artistas/[slug]` — Perfil individual + trabajos
4. `/galeria` — Galeria completa filtrable
5. `/reservar` — Cal.com embed inline
6. `/contacto` — Formulario + mapa + info
7. `/aviso-legal` — Aviso legal
8. `/privacidad` — Politica de privacidad
9. `/cookies` — Politica de cookies
10. `/keystatic` — Panel CMS (solo administradores)

---

## Diseno por Pagina

### Navegacion (todas las paginas)
- Fija en top, `z-index: 10`
- Fondo transparente en hero, transiciona a blanco con `backdrop-filter: blur(10px)` al scroll
- Logo Neu a la izquierda
- Links centrados: Artistas | Galeria | Contacto
- Boton "Reservar" a la derecha: fondo `#2A2AEE`, texto blanco, `border-radius: 0` (cuadrado)
- Transicion: `all ease 0.3s`
- Mobile: hamburguesa que abre menu fullscreen blanco con links + redes sociales

### Home — Hero
- Full viewport (100vh)
- Fondo: imagen destacada de tatuaje o video loop corto
- Tipografia Michroma gigante: "NEU STUDIO" (clamp responsive ~8vw)
- Subtitulo en Outfit light: tagline del estudio
- 2 CTAs: [Reservar cita] (azul) + [Ver galeria] (outline negro)
- Efecto glow azul decorativo (CSS radial-gradient que simula el branding)
- Scroll indicator animado en la parte inferior

### Home — Servicios
- Grid 3 columnas (desktop), 1 columna (mobile)
- Card por servicio: icono minimal + nombre (Michroma) + descripcion breve (Outfit)
- Label "DESDE X EUR" en Space Grotesk uppercase con wide tracking
- Hover: elevacion sutil con `box-shadow`

### Home — Galeria destacada
- Masonry grid con 6-8 mejores trabajos (marcados como "destacada" en Keystatic)
- Hover: escala 1.02 + overlay con nombre artista + estilo
- Gradient overlay en imagenes (8 stops, inspirado en nobleart):
  ```css
  linear-gradient(0deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.3) 50%,
    rgba(0,0,0,.15) 65%, rgba(0,0,0,.075) 75.5%,
    rgba(0,0,0,.037) 82.85%, rgba(0,0,0,.019) 88%, transparent)
  ```
- Link "Ver toda la galeria" debajo
- Batch size: 9 imagenes (carga progresiva si hay mas)

### Home — Artistas
- Cards horizontales o grid
- Foto retrato + nombre artistico (Michroma) + especialidades (Space Grotesk, tags)
- Hover: revela una imagen de trabajo del artista
- Link a perfil individual

### Home — Proceso
- 4-5 pasos numerados
- Layout horizontal con linea conectora (desktop), vertical (mobile)
- Numero grande (Michroma) + titulo + descripcion breve
- Iconos minimos o ninguno

### Home — Testimonios
- Carrusel con resenias
- Nota media de Google destacada (ej: "4.8 estrellas")
- Nombre + texto + estrellas por resenia
- Fondo alterno `#F5F5F0` para separar visualmente

### Home — CTA final
- Seccion con fondo azul `#2A2AEE` o imagen de fondo con overlay
- Texto: "Listo para tu proximo tatuaje?" (Michroma)
- Boton "Reservar cita" grande (blanco sobre azul)

### Pagina Artistas (/artistas)
- Grid de cards (3 col desktop, 2 tablet, 1 mobile)
- Card: foto retrato + nombre + especialidad + link a perfil
- Sin filtros en lista (son pocos artistas: Rocio, Aranega, Adri Pinto, Fran)

### Perfil Artista (/artistas/[slug])
- Layout: foto retrato (izquierda) + info (derecha) en desktop
- Nombre artistico (Michroma), especialidades (Space Grotesk tags)
- Bio (Outfit), Instagram link
- Boton "Reservar con [nombre]" (abre Cal.com con artista preseleccionado)
- Debajo: masonry grid con todos sus trabajos (PhotoSwipe lightbox)

### Galeria (/galeria)
- Filtros por estilo en tabs/chips superiores: Todos | Fineline | Realismo | Color | Blackwork | Composicion | Freehand | Mascotas | Florales | Microrealismo | Curados
- Masonry grid con lazy loading
- Batch de 9 imagenes + boton "Ver mas"
- Click en imagen abre PhotoSwipe lightbox (swipe mobile, flechas desktop)
- Hover: overlay con artista + estilo
- Cada imagen enlaza a su artista

### Reservar (/reservar)
- Cal.com embebido inline
- Tema light con colores de marca (azul `#2A2AEE`)
- Selector: artista + tipo de sesion + duracion (2h, 4h, 6h, 8h)

### Contacto (/contacto)
- Layout 2 columnas (desktop): formulario (izq) + info (der)
- Formulario: nombre, email, telefono, mensaje, [Enviar]
- Info: direccion, telefono, WhatsApp, email, horario, redes sociales
- Google Maps embed debajo
- Envio via Cloudflare Functions + Resend

### Paginas legales
- Layout simple: titulo (Michroma) + texto (Outfit)
- Contenido editable desde Keystatic

---

## Elementos Flotantes (todas las paginas)

- **Boton WhatsApp**: esquina inferior derecha, icono verde, `z-index: 50`
- **Boton Reservar (Cal.com)**: popup flotante, encima de WhatsApp
- Mobile: barra inferior fija con ambos botones

---

## Animaciones

| Elemento | Tipo | Duracion | Easing |
|----------|------|----------|--------|
| Scroll reveal | Fade-up al entrar en viewport | 0.6s | ease-out |
| View Transitions | Fade entre paginas | 0.3s | ease |
| Galeria a artista | Image morph (transition:name) | 0.4s | ease-in-out |
| Hover galeria | Scale 1.02 + overlay | 0.3s | linear |
| Nav scroll | Transparente a blanco+blur | 0.3s | ease |
| Boton hover | Background + color transition | 0.3s | linear |

### Librerias
- **Lenis**: smooth scroll global
- **GSAP ScrollTrigger**: scroll-linked animations (fade-up de secciones)
- **Astro View Transitions**: transiciones entre paginas (2 lineas de codigo)

---

## Keystatic — Modelo de Contenido

### Colecciones

**artists** (artistas)
- `name`: texto (nombre artistico)
- `slug`: auto-generado
- `photo`: imagen (retrato)
- `bio`: texto rico
- `specialties`: multi-select [fineline, realismo, color, blackwork, composicion, freehand, mascotas, florales, microrealismo, curados]
- `instagram`: URL
- `order`: numero

**gallery** (galeria)
- `image`: imagen (upload)
- `title`: texto
- `artist`: relacion -> artists
- `style`: select (mismas opciones que specialties)
- `featured`: boolean (mostrar en home)

**services** (servicios)
- `name`: texto
- `description`: texto rico
- `price`: texto ("desde 80 EUR")
- `duration`: texto
- `order`: numero

**testimonials** (testimonios)
- `clientName`: texto
- `text`: texto
- `stars`: numero (1-5)
- `source`: select [google, instagram]

**faq** (preguntas frecuentes)
- `question`: texto
- `answer`: texto rico
- `order`: numero

### Singletons

**site** (configuracion global)
- `studioName`: texto
- `address`: texto
- `phone`: texto
- `whatsapp`: texto
- `email`: texto
- `schedule`: texto rico
- `googleMapsUrl`: URL
- `googleRating`: texto ("4.8")
- `googleReviewCount`: texto ("+200")
- `instagram`: URL
- `tiktok`: URL
- `facebook`: URL

**home** (contenido hero)
- `heroTitle`: texto
- `heroSubtitle`: texto
- `heroImage`: imagen
- `heroVideo`: URL (opcional)

**legal** (paginas legales)
- `avisoLegal`: texto rico
- `privacidad`: texto rico
- `cookies`: texto rico

---

## Imagenes

- Almacenadas en `public/images/` via Keystatic
- Optimizadas en build con Astro `<Image />` (WebP automatico)
- Lazy loading con `loading="lazy"` (excepto hero: `loading="eager"`)
- Blur-up placeholder para carga progresiva
- srcset responsive para multiples tamanios

---

## Despliegue

```
GitHub repo (neu-studio)
  -> Push a main
  -> Cloudflare Pages detecta cambio
  -> Build: npm run build (Astro SSG)
  -> Deploy a CDN global (~30s)
```

### Costes

| Concepto | Coste |
|----------|-------|
| Cloudflare Pages | Gratis |
| Dominio .es | ~8 EUR/anio |
| Cal.com | Gratis |
| Keystatic | Gratis |
| Resend (emails) | Gratis (3000/mes) |
| GitHub | Gratis |
| **Total** | **~0.67 EUR/mes** |

---

## Artistas Confirmados

1. **Rocio** — Estilos: Fineline, Florales, Color, Freehand, Mascotas, Microrealismo, Curados
2. **Aranega** — Portfolio general (fotografias de tatuaje)
3. **Adri Pinto** — Estilos: Composicion, Fineline, Micro
4. **Fran** — Estilos: Linea fina

---

## Referentes de Diseno

- **nobleart.com**: estructura de navegacion, contraste tipografico, galeria masonry+lightbox, gradient overlay
- **monolithstudio.com**: estetica blanca minimalista, hero con tipografia grande, smooth scroll
- **bangbangforever.com**: layout editorial, presentacion premium

---

## Nota sobre Formatos de Imagen

El portfolio incluye archivos .HEIC (fotos de Fran). Estos necesitan conversion a JPG/WebP antes de ser usados en la web. Astro no procesa HEIC nativamente. Se necesita un script de conversion previo o pedir las fotos en JPG.
