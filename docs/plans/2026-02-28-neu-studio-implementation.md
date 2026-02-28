# Neu Studio — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a white, urban, minimalist tattoo studio website for Neu Studio (Dos Hermanas) with portfolio gallery, artist profiles, Cal.com booking, and Keystatic CMS.

**Architecture:** Astro 5 SSG with TailwindCSS 4 for styling, Keystatic as Git-based CMS serving content from markdown/JSON files. Static output deployed to Cloudflare Pages. Cal.com embedded for booking. Cloudflare Functions for contact form emails via Resend.

**Tech Stack:** Astro 5, TypeScript, TailwindCSS 4, Keystatic, Lenis, GSAP ScrollTrigger, PhotoSwipe, Cal.com embed, Cloudflare Pages, Resend.

**Design doc:** `docs/plans/2026-02-28-neu-studio-design.md`

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.mjs`, `.gitignore`
- Create: `src/layouts/Base.astro`
- Create: `src/pages/index.astro`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

**Step 1: Initialize Astro project**

Run from project root (which already has LICENSE, README, fotos/):

```bash
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

If prompted about existing files, choose to keep them (don't overwrite README/LICENSE).

**Step 2: Install core dependencies**

```bash
npm install
npm install @astrojs/tailwind tailwindcss @astrojs/sitemap
```

**Step 3: Configure Astro**

Replace `astro.config.mjs` with:

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://neustudio.es',
  integrations: [tailwindcss(), sitemap()],
});
```

**Step 4: Create TailwindCSS config**

Create `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2A2AEE',
          'blue-hover': '#1E1ECC',
          gray: '#B6B6B6',
          dark: '#1A1A1A',
          light: '#F5F5F0',
          border: '#E5E5E5',
        },
      },
      fontFamily: {
        display: ['Michroma', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        accent: ['Space Grotesk', 'sans-serif'],
      },
      letterSpacing: {
        'tight-display': '-0.125rem',
        'wide-label': '0.25rem',
        'wider-label': '0.375rem',
      },
    },
  },
  plugins: [],
};
```

**Step 5: Create global CSS with font imports**

Create `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Michroma&family=Outfit:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Outfit', sans-serif;
    color: #1A1A1A;
    background-color: #FFFFFF;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3 {
    font-family: 'Michroma', sans-serif;
    letter-spacing: -0.125rem;
  }
}
```

**Step 6: Create Base layout**

Create `src/layouts/Base.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Neu Studio - Estudio de tatuaje en Dos Hermanas' } = Astro.props;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title} | Neu Studio</title>
  </head>
  <body class="font-body text-brand-dark bg-white">
    <slot />
  </body>
</html>
```

**Step 7: Create minimal index page**

Create `src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="Inicio">
  <main>
    <section class="h-screen flex items-center justify-center">
      <h1 class="font-display text-[clamp(3rem,8vw,6rem)] tracking-tight-display text-brand-dark">
        NEU STUDIO
      </h1>
    </section>
  </main>
</Base>
```

**Step 8: Verify it builds and runs**

```bash
npm run dev
```

Expected: Dev server at `localhost:4321` showing "NEU STUDIO" centered in Michroma font.

**Step 9: Add .gitignore entries**

Ensure `.gitignore` includes:

```
node_modules/
dist/
.astro/
.env
```

**Step 10: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json tailwind.config.mjs .gitignore src/ public/
git commit -m "feat: scaffold Astro project with TailwindCSS and typography"
```

---

## Task 2: Keystatic CMS Setup

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`
- Create: `keystatic.config.ts`
- Create: `src/content/artists/rocio.md` (and 3 more placeholder artists)
- Create: `src/content/services/tatuaje-personalizado.md` (and more placeholder services)
- Create: `src/content/testimonials/testimonio-1.md`
- Create: `src/content/faq/duele-tatuarse.md`
- Create: `src/content/gallery/` (empty, populated later)

**Step 1: Install Keystatic**

```bash
npm install @keystatic/core @keystatic/astro
```

**Step 2: Update Astro config for Keystatic**

Replace `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://neustudio.es',
  output: 'hybrid',
  integrations: [tailwindcss(), sitemap(), react(), keystatic()],
});
```

Also install react integration:

```bash
npm install @astrojs/react react react-dom
```

**Step 3: Create Keystatic config**

Create `keystatic.config.ts`:

```typescript
import { config, fields, collection, singleton } from '@keystatic/core';

const STYLES = [
  { label: 'Fineline', value: 'fineline' },
  { label: 'Realismo', value: 'realismo' },
  { label: 'Color', value: 'color' },
  { label: 'Blackwork', value: 'blackwork' },
  { label: 'Composicion', value: 'composicion' },
  { label: 'Freehand', value: 'freehand' },
  { label: 'Mascotas', value: 'mascotas' },
  { label: 'Florales', value: 'florales' },
  { label: 'Microrealismo', value: 'microrealismo' },
  { label: 'Curados', value: 'curados' },
] as const;

export default config({
  storage: { kind: 'local' },
  collections: {
    artists: collection({
      label: 'Artistas',
      slugField: 'name',
      path: 'src/content/artists/*',
      format: { contentField: 'bio' },
      schema: {
        name: fields.slug({ name: { label: 'Nombre artistico' } }),
        photo: fields.image({
          label: 'Foto retrato',
          directory: 'public/images/artists',
          publicPath: '/images/artists/',
        }),
        bio: fields.markdoc({ label: 'Bio' }),
        specialties: fields.multiselect({
          label: 'Especialidades',
          options: STYLES,
        }),
        instagram: fields.url({ label: 'Instagram' }),
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
      },
    }),
    gallery: collection({
      label: 'Galeria',
      slugField: 'title',
      path: 'src/content/gallery/*',
      schema: {
        title: fields.slug({ name: { label: 'Titulo' } }),
        image: fields.image({
          label: 'Imagen',
          directory: 'public/images/gallery',
          publicPath: '/images/gallery/',
        }),
        artist: fields.relationship({
          label: 'Artista',
          collection: 'artists',
        }),
        style: fields.select({
          label: 'Estilo',
          options: STYLES,
          defaultValue: 'fineline',
        }),
        featured: fields.checkbox({
          label: 'Destacada en home',
          defaultValue: false,
        }),
      },
    }),
    services: collection({
      label: 'Servicios',
      slugField: 'name',
      path: 'src/content/services/*',
      format: { contentField: 'description' },
      schema: {
        name: fields.slug({ name: { label: 'Nombre del servicio' } }),
        description: fields.markdoc({ label: 'Descripcion' }),
        price: fields.text({ label: 'Precio orientativo', defaultValue: 'Consultar' }),
        duration: fields.text({ label: 'Duracion aproximada' }),
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
      },
    }),
    testimonials: collection({
      label: 'Testimonios',
      slugField: 'clientName',
      path: 'src/content/testimonials/*',
      schema: {
        clientName: fields.slug({ name: { label: 'Nombre del cliente' } }),
        text: fields.text({ label: 'Texto de la resenia', multiline: true }),
        stars: fields.integer({ label: 'Estrellas', defaultValue: 5, validation: { min: 1, max: 5 } }),
        source: fields.select({
          label: 'Fuente',
          options: [
            { label: 'Google', value: 'google' },
            { label: 'Instagram', value: 'instagram' },
          ],
          defaultValue: 'google',
        }),
      },
    }),
    faq: collection({
      label: 'Preguntas Frecuentes',
      slugField: 'question',
      path: 'src/content/faq/*',
      format: { contentField: 'answer' },
      schema: {
        question: fields.slug({ name: { label: 'Pregunta' } }),
        answer: fields.markdoc({ label: 'Respuesta' }),
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
      },
    }),
  },
  singletons: {
    site: singleton({
      label: 'Configuracion del sitio',
      path: 'src/content/site',
      schema: {
        studioName: fields.text({ label: 'Nombre del estudio', defaultValue: 'Neu Studio' }),
        address: fields.text({ label: 'Direccion' }),
        phone: fields.text({ label: 'Telefono' }),
        whatsapp: fields.text({ label: 'WhatsApp' }),
        email: fields.text({ label: 'Email' }),
        schedule: fields.text({ label: 'Horario', multiline: true }),
        googleMapsUrl: fields.url({ label: 'Google Maps URL' }),
        googleRating: fields.text({ label: 'Nota Google', defaultValue: '5.0' }),
        googleReviewCount: fields.text({ label: 'Numero de resenias', defaultValue: '0' }),
        instagram: fields.url({ label: 'Instagram' }),
        tiktok: fields.url({ label: 'TikTok' }),
        facebook: fields.url({ label: 'Facebook' }),
      },
    }),
    home: singleton({
      label: 'Pagina de inicio',
      path: 'src/content/home',
      schema: {
        heroTitle: fields.text({ label: 'Titulo hero', defaultValue: 'NEU STUDIO' }),
        heroSubtitle: fields.text({ label: 'Subtitulo hero', defaultValue: 'Estudio de tatuaje en Dos Hermanas' }),
        heroImage: fields.image({
          label: 'Imagen hero',
          directory: 'public/images',
          publicPath: '/images/',
        }),
      },
    }),
    legal: singleton({
      label: 'Paginas legales',
      path: 'src/content/legal',
      schema: {
        avisoLegal: fields.markdoc({ label: 'Aviso legal' }),
        privacidad: fields.markdoc({ label: 'Politica de privacidad' }),
        cookies: fields.markdoc({ label: 'Politica de cookies' }),
      },
    }),
  },
});
```

**Step 4: Create placeholder content for 4 artists**

Create `src/content/artists/rocio.md`:
```markdown
---
name: Rocio
photo: ''
specialties:
  - fineline
  - florales
  - color
  - freehand
  - mascotas
  - microrealismo
  - curados
instagram: ''
order: 1
---
Artista especializada en fineline y florales.
```

Create `src/content/artists/aranega.md`:
```markdown
---
name: Aranega
photo: ''
specialties: []
instagram: ''
order: 2
---
Artista con portfolio variado.
```

Create `src/content/artists/adri-pinto.md`:
```markdown
---
name: Adri Pinto
photo: ''
specialties:
  - composicion
  - fineline
  - microrealismo
instagram: ''
order: 3
---
Artista especializado en composicion y fineline.
```

Create `src/content/artists/fran.md`:
```markdown
---
name: Fran
photo: ''
specialties:
  - fineline
instagram: ''
order: 4
---
Artista especializado en linea fina.
```

**Step 5: Create placeholder services**

Create `src/content/services/tatuaje-personalizado.md`:
```markdown
---
name: Tatuaje personalizado
price: Consultar
duration: Variable
order: 1
---
Diseno a medida segun tu idea.
```

Create `src/content/services/cover-up.md`:
```markdown
---
name: Cover-up
price: Consultar
duration: Variable
order: 2
---
Tapamos tatuajes antiguos con un nuevo diseno.
```

Create `src/content/services/retoque.md`:
```markdown
---
name: Retoque
price: Consultar
duration: 1-2 horas
order: 3
---
Restauracion y retoque de tatuajes existentes.
```

**Step 6: Create placeholder FAQ**

Create `src/content/faq/duele-tatuarse.md`:
```markdown
---
question: Duele mucho tatuarse?
order: 1
---
La sensacion varia segun la zona del cuerpo y la tolerancia de cada persona.
```

**Step 7: Create singleton content files**

Create `src/content/site.yaml`:
```yaml
studioName: Neu Studio
address: ''
phone: ''
whatsapp: ''
email: ''
schedule: ''
googleMapsUrl: ''
googleRating: '5.0'
googleReviewCount: '0'
instagram: ''
tiktok: ''
facebook: ''
```

Create `src/content/home.yaml`:
```yaml
heroTitle: NEU STUDIO
heroSubtitle: Estudio de tatuaje en Dos Hermanas
heroImage: ''
```

**Step 8: Verify Keystatic runs**

```bash
npm run dev
```

Navigate to `http://localhost:4321/keystatic` — should show the CMS admin panel with Artists, Gallery, Services, Testimonials, FAQ collections and Site, Home, Legal singletons.

**Step 9: Commit**

```bash
git add keystatic.config.ts src/content/ astro.config.mjs package.json package-lock.json
git commit -m "feat: add Keystatic CMS with content collections and placeholder data"
```

---

## Task 3: Navigation Component

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/MobileMenu.astro`
- Modify: `src/layouts/Base.astro`

**Step 1: Create Nav component**

Create `src/components/Nav.astro`:

```astro
---
const navLinks = [
  { href: '/artistas', label: 'Artistas' },
  { href: '/galeria', label: 'Galeria' },
  { href: '/contacto', label: 'Contacto' },
];

const currentPath = Astro.url.pathname;
---

<header
  id="nav"
  class="fixed top-0 left-0 w-full z-10 transition-all duration-300 ease-in-out"
>
  <nav class="flex items-center justify-between px-6 md:px-12 py-4">
    <a href="/" class="font-display text-lg tracking-tight-display">
      NEU STUDIO
    </a>

    <ul class="hidden md:flex items-center gap-8">
      {navLinks.map(({ href, label }) => (
        <li>
          <a
            href={href}
            class:list={[
              'font-body text-[0.85rem] font-medium uppercase tracking-wide-label transition-colors duration-200',
              currentPath === href ? 'text-brand-blue' : 'text-brand-dark hover:text-brand-blue',
            ]}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>

    <div class="hidden md:block">
      <a
        href="/reservar"
        class="font-body text-sm font-medium bg-brand-blue text-white px-6 py-3 hover:bg-brand-blue-hover transition-colors duration-300"
      >
        Reservar
      </a>
    </div>

    <button
      id="menu-toggle"
      class="md:hidden flex flex-col gap-1.5 p-2"
      aria-label="Abrir menu"
    >
      <span class="block w-6 h-[2px] bg-brand-dark transition-transform duration-300" id="bar1"></span>
      <span class="block w-6 h-[2px] bg-brand-dark transition-opacity duration-300" id="bar2"></span>
      <span class="block w-6 h-[2px] bg-brand-dark transition-transform duration-300" id="bar3"></span>
    </button>
  </nav>
</header>

<div
  id="mobile-menu"
  class="fixed inset-0 z-20 bg-white flex-col items-center justify-center gap-8 hidden"
>
  <button
    id="menu-close"
    class="absolute top-6 right-6 p-2"
    aria-label="Cerrar menu"
  >
    <span class="block w-6 h-[2px] bg-brand-dark rotate-45 translate-y-[1px]"></span>
    <span class="block w-6 h-[2px] bg-brand-dark -rotate-45 -translate-y-[1px]"></span>
  </button>

  {navLinks.map(({ href, label }) => (
    <a
      href={href}
      class="font-display text-2xl tracking-tight-display text-brand-dark hover:text-brand-blue transition-colors"
    >
      {label}
    </a>
  ))}

  <a
    href="/reservar"
    class="font-body text-base font-medium bg-brand-blue text-white px-8 py-4 mt-4 hover:bg-brand-blue-hover transition-colors"
  >
    Reservar
  </a>
</div>

<script>
  const toggle = document.getElementById('menu-toggle');
  const close = document.getElementById('menu-close');
  const menu = document.getElementById('mobile-menu');

  toggle?.addEventListener('click', () => {
    menu?.classList.remove('hidden');
    menu?.classList.add('flex');
    document.body.style.overflow = 'hidden';
  });

  close?.addEventListener('click', () => {
    menu?.classList.add('hidden');
    menu?.classList.remove('flex');
    document.body.style.overflow = '';
  });
</script>
```

**Step 2: Add nav scroll behavior script**

Add to the bottom of Nav.astro, inside a second `<script>`:

```astro
<script>
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 100) {
      nav.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-sm');
    } else {
      nav.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-sm');
    }
  });
</script>
```

**Step 3: Update Base layout to include Nav**

Modify `src/layouts/Base.astro` — add `import Nav from '../components/Nav.astro';` and include `<Nav />` before `<slot />`.

**Step 4: Verify**

```bash
npm run dev
```

Expected: Fixed nav at top, transparent initially, turns white+blur on scroll. Mobile hamburger menu works. "Reservar" button styled in blue.

**Step 5: Commit**

```bash
git add src/components/Nav.astro src/layouts/Base.astro
git commit -m "feat: add responsive navigation with scroll blur effect"
```

---

## Task 4: Home Page — Hero Section

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create Hero component**

Create `src/components/Hero.astro`:

```astro
---
interface Props {
  title?: string;
  subtitle?: string;
}

const { title = 'NEU STUDIO', subtitle = 'Estudio de tatuaje en Dos Hermanas' } = Astro.props;
---

<section class="relative h-screen flex flex-col items-center justify-center overflow-hidden">
  <!-- Blue glow decorative effect (matches logo branding) -->
  <div
    class="absolute w-[400px] h-[600px] bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none"
    aria-hidden="true"
  ></div>

  <h1 class="font-display text-[clamp(3rem,8vw,6rem)] tracking-tight-display text-brand-dark text-center leading-none z-[1]">
    {title}
  </h1>

  <p class="font-accent text-sm md:text-base tracking-wide-label uppercase text-brand-gray mt-6 z-[1]">
    {subtitle}
  </p>

  <div class="flex gap-4 mt-10 z-[1]">
    <a
      href="/reservar"
      class="font-body text-sm font-medium bg-brand-blue text-white px-8 py-4 hover:bg-brand-blue-hover transition-colors duration-300"
    >
      Reservar cita
    </a>
    <a
      href="/galeria"
      class="font-body text-sm font-medium border border-brand-dark text-brand-dark px-8 py-4 hover:bg-brand-dark hover:text-white transition-colors duration-300"
    >
      Ver galeria
    </a>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 animate-bounce z-[1]">
    <div class="w-[1px] h-12 bg-brand-gray/50"></div>
  </div>
</section>
```

**Step 2: Update index.astro to use Hero**

Replace `src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
---

<Base title="Inicio">
  <main>
    <Hero />
  </main>
</Base>
```

**Step 3: Verify**

```bash
npm run dev
```

Expected: Full-viewport hero with "NEU STUDIO" in Michroma, blue glow effect, two CTA buttons, scroll indicator.

**Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add hero section with blue glow effect and CTAs"
```

---

## Task 5: Home Page — Services, Process, Testimonials, CTA Sections

**Files:**
- Create: `src/components/Services.astro`
- Create: `src/components/Process.astro`
- Create: `src/components/Testimonials.astro`
- Create: `src/components/CTASection.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create Services component**

Create `src/components/Services.astro` — reads from `src/content/services/` collection, displays as 3-column grid with Michroma name, Outfit description, Space Grotesk price label.

**Step 2: Create Process component**

Create `src/components/Process.astro` — hardcoded 5 steps (Contacto > Consulta > Diseno > Sesion > Aftercare). Horizontal layout with numbered steps in Michroma, connecting line between steps. Vertical on mobile.

**Step 3: Create Testimonials component**

Create `src/components/Testimonials.astro` — reads from `src/content/testimonials/` collection. Simple horizontal scrollable container with cards. Background `#F5F5F0`. Google rating badge.

**Step 4: Create CTA Section**

Create `src/components/CTASection.astro` — full-width section with `bg-brand-blue`, white text in Michroma, "Reservar cita" button in white.

**Step 5: Assemble Home page**

Update `src/pages/index.astro` to import and stack all sections:

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import Services from '../components/Services.astro';
import Process from '../components/Process.astro';
import Testimonials from '../components/Testimonials.astro';
import CTASection from '../components/CTASection.astro';
---

<Base title="Inicio">
  <main>
    <Hero />
    <Services />
    <Process />
    <Testimonials />
    <CTASection />
  </main>
</Base>
```

Note: Gallery and Artists sections for home will be added in Tasks 6 and 7 after those components exist.

**Step 6: Verify all sections render**

```bash
npm run dev
```

**Step 7: Commit**

```bash
git add src/components/Services.astro src/components/Process.astro src/components/Testimonials.astro src/components/CTASection.astro src/pages/index.astro
git commit -m "feat: add services, process, testimonials and CTA sections to home"
```

---

## Task 6: Gallery Components + PhotoSwipe

**Files:**
- Create: `src/components/Gallery.astro`
- Create: `src/components/GalleryGrid.astro`
- Create: `src/pages/galeria.astro`
- Modify: `package.json` (add photoswipe)

**Step 1: Install PhotoSwipe**

```bash
npm install photoswipe
```

**Step 2: Create GalleryGrid component**

Create `src/components/GalleryGrid.astro` — reusable masonry grid. Accepts array of gallery items. Renders CSS grid with column spans. Each image has hover overlay (artist name + style tag). Click opens PhotoSwipe lightbox.

Key details:
- CSS Grid with `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`
- Hover: `scale(1.02)` + gradient overlay (8-stop gradient from design doc)
- PhotoSwipe initialized via `<script>` tag importing from `photoswipe`
- `data-pswp-width` and `data-pswp-height` on each item for PhotoSwipe
- Lazy loading with `loading="lazy"`

**Step 3: Create Gallery filter component**

Create `src/components/Gallery.astro` — wrapper with filter tabs (Space Grotesk, uppercase, wide tracking). Tabs filter items by `data-style` attribute using vanilla JS. Includes "Ver mas" button for progressive loading.

**Step 4: Create gallery page**

Create `src/pages/galeria.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import Gallery from '../components/Gallery.astro';
import { getCollection } from 'astro:content';

const galleryItems = await getCollection('gallery');
---

<Base title="Galeria">
  <main class="pt-24 pb-16 px-6 md:px-12">
    <h1 class="font-display text-[clamp(2rem,4vw,3.5rem)] tracking-tight-display mb-12">
      Galeria
    </h1>
    <Gallery items={galleryItems} />
  </main>
</Base>
```

**Step 5: Add featured gallery to home**

Modify `src/pages/index.astro` — add a `GalleryGrid` between Services and Artists sections showing only items with `featured: true`, limited to 8, with link to `/galeria`.

**Step 6: Verify gallery page and lightbox**

```bash
npm run dev
```

Navigate to `/galeria`. Verify filter tabs work, images display, PhotoSwipe opens on click.

**Step 7: Commit**

```bash
git add src/components/Gallery.astro src/components/GalleryGrid.astro src/pages/galeria.astro package.json package-lock.json src/pages/index.astro
git commit -m "feat: add gallery page with masonry grid, filters and PhotoSwipe lightbox"
```

---

## Task 7: Artists Pages

**Files:**
- Create: `src/components/ArtistCard.astro`
- Create: `src/pages/artistas/index.astro`
- Create: `src/pages/artistas/[slug].astro`
- Modify: `src/pages/index.astro` (add artists section to home)

**Step 1: Create ArtistCard component**

Create `src/components/ArtistCard.astro` — card with photo, name (Michroma), specialty tags (Space Grotesk), link to profile. Hover reveals sample work image.

**Step 2: Create artists list page**

Create `src/pages/artistas/index.astro` — reads from artists collection, renders grid of ArtistCards (3 col desktop, 2 tablet, 1 mobile).

**Step 3: Create artist detail page**

Create `src/pages/artistas/[slug].astro`:
- `getStaticPaths()` from artists collection
- Layout: photo (left) + info (right) on desktop, stacked on mobile
- Name (Michroma), specialty tags, bio, Instagram link
- "Reservar con [name]" button linking to Cal.com with artist preselected
- Below: masonry grid of their works filtered from gallery collection by artist relationship
- PhotoSwipe lightbox on images
- Astro View Transition `transition:name` on the artist photo for smooth morph from list to detail

**Step 4: Add artists section to home**

Modify `src/pages/index.astro` — add ArtistCards grid between Gallery featured and Process sections.

**Step 5: Verify**

```bash
npm run dev
```

Navigate to `/artistas` (list) and `/artistas/rocio` (detail). Verify layout, links, and PhotoSwipe.

**Step 6: Commit**

```bash
git add src/components/ArtistCard.astro src/pages/artistas/ src/pages/index.astro
git commit -m "feat: add artists list and detail pages with gallery integration"
```

---

## Task 8: Booking Page (Cal.com) + Floating Buttons

**Files:**
- Create: `src/pages/reservar.astro`
- Create: `src/components/WhatsAppButton.astro`
- Create: `src/components/BookingButton.astro`
- Modify: `src/layouts/Base.astro` (add floating buttons)

**Step 1: Create booking page**

Create `src/pages/reservar.astro`:

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="Reservar cita">
  <main class="pt-24 pb-16 px-6 md:px-12">
    <h1 class="font-display text-[clamp(2rem,4vw,3.5rem)] tracking-tight-display mb-4">
      Reservar cita
    </h1>
    <p class="font-accent text-sm tracking-wide-label uppercase text-brand-gray mb-12">
      Elige artista, tipo de sesion y horario
    </p>

    <!-- Cal.com inline embed -->
    <div id="cal-embed" class="min-h-[600px]"></div>
  </main>
</Base>

<script>
  // Cal.com embed script - replace CAL_LINK with actual Cal.com link
  (function (C, A, L) {
    let p = function (a: any, ar: any) {
      a.q.push(ar);
    };
    let d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window as any, 'https://app.cal.com/embed/embed.js', 'init');

  (window as any).Cal('init', { origin: 'https://app.cal.com' });
  (window as any).Cal('inline', {
    elementOrSelector: '#cal-embed',
    calLink: 'REPLACE_WITH_CAL_LINK',
    layout: 'month_view',
    config: {
      theme: 'light',
    },
  });
  (window as any).Cal('ui', {
    theme: 'light',
    styles: { branding: { brandColor: '#2A2AEE' } },
  });
</script>
```

Note: `REPLACE_WITH_CAL_LINK` will be replaced with the actual Cal.com link when the client provides it.

**Step 2: Create WhatsApp floating button**

Create `src/components/WhatsAppButton.astro`:

```astro
---
const whatsappNumber = '34XXXXXXXXX'; // Replace with actual number
const message = encodeURIComponent('Hola, me gustaria pedir informacion sobre un tatuaje');
---

<a
  href={`https://wa.me/${whatsappNumber}?text=${message}`}
  target="_blank"
  rel="noopener noreferrer"
  class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
  aria-label="Contactar por WhatsApp"
>
  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>
```

**Step 3: Create Booking floating button**

Create `src/components/BookingButton.astro` — small floating button above WhatsApp button that triggers Cal.com popup modal.

**Step 4: Add floating buttons to Base layout**

Modify `src/layouts/Base.astro` — import and add `<WhatsAppButton />` and `<BookingButton />` before closing `</body>`.

**Step 5: Verify**

```bash
npm run dev
```

Check `/reservar` page shows Cal.com embed area. WhatsApp button visible on all pages. Booking button visible.

**Step 6: Commit**

```bash
git add src/pages/reservar.astro src/components/WhatsAppButton.astro src/components/BookingButton.astro src/layouts/Base.astro
git commit -m "feat: add booking page with Cal.com embed and floating WhatsApp/booking buttons"
```

---

## Task 9: Contact Page + Cloudflare Function

**Files:**
- Create: `src/pages/contacto.astro`
- Create: `src/components/ContactForm.astro`
- Create: `functions/api/contact.ts` (Cloudflare Pages Function)

**Step 1: Create Contact page**

Create `src/pages/contacto.astro` — 2 column layout. Left: contact form (name, email, phone, message, submit). Right: studio info (address, phone, whatsapp, email, schedule, social links) + Google Maps embed iframe.

Form uses `font-body` for inputs, labels in `font-accent` uppercase with wide tracking. Submit button in `bg-brand-blue`.

**Step 2: Create Cloudflare Function for form submission**

Create `functions/api/contact.ts`:

```typescript
interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Campos obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'web@neustudio.es',
      to: context.env.CONTACT_EMAIL,
      subject: `Contacto web: ${name}`,
      html: `
        <h2>Nuevo mensaje desde la web</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    }),
  });

  if (res.ok) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Error enviando email' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

**Step 3: Add form JS for async submission**

In `contacto.astro`, add `<script>` that intercepts form submit, sends via `fetch` to `/api/contact`, shows success/error message without page reload.

**Step 4: Verify**

```bash
npm run dev
```

Contact page renders with form and info columns. Form submission will only work when deployed to Cloudflare with env vars set.

**Step 5: Commit**

```bash
git add src/pages/contacto.astro src/components/ContactForm.astro functions/
git commit -m "feat: add contact page with form and Cloudflare Function for email"
```

---

## Task 10: Legal Pages + Footer

**Files:**
- Create: `src/pages/aviso-legal.astro`
- Create: `src/pages/privacidad.astro`
- Create: `src/pages/cookies.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/Base.astro` (add footer)

**Step 1: Create Footer component**

Create `src/components/Footer.astro` — studio name, address, phone, social links, nav links, legal links. Clean minimal layout. Border-top `#E5E5E5`. Copyright text.

**Step 2: Create legal pages**

Create 3 pages that read from the `legal` singleton in Keystatic and render the markdoc content. Simple layout: title + prose text.

**Step 3: Add Footer to Base layout**

Modify `src/layouts/Base.astro` — add `<Footer />` after `<slot />`.

**Step 4: Verify**

```bash
npm run dev
```

Footer visible on all pages. Legal pages render placeholder content. Links work.

**Step 5: Commit**

```bash
git add src/components/Footer.astro src/pages/aviso-legal.astro src/pages/privacidad.astro src/pages/cookies.astro src/layouts/Base.astro
git commit -m "feat: add footer and legal pages"
```

---

## Task 11: Smooth Scroll + Animations

**Files:**
- Modify: `package.json` (add lenis, gsap)
- Create: `src/scripts/smooth-scroll.ts`
- Create: `src/scripts/scroll-animations.ts`
- Modify: `src/layouts/Base.astro` (add scripts + view transitions)

**Step 1: Install Lenis and GSAP**

```bash
npm install lenis gsap
```

**Step 2: Create smooth scroll script**

Create `src/scripts/smooth-scroll.ts`:

```typescript
import Lenis from 'lenis';

const lenis = new Lenis({
  autoRaf: true,
});
```

**Step 3: Create scroll animation script**

Create `src/scripts/scroll-animations.ts`:

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('[data-animate]').forEach((el) => {
  gsap.from(el, {
    y: 40,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      once: true,
    },
  });
});
```

**Step 4: Add View Transitions to Base layout**

Modify `src/layouts/Base.astro`:

```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<!-- In <head>: -->
<ViewTransitions />
<!-- Before </body>: -->
<script>
  import '../scripts/smooth-scroll';
  import '../scripts/scroll-animations';
</script>
```

**Step 5: Add `data-animate` attributes to sections**

Go through each section component (Services, Process, Testimonials, Artists, Gallery, CTA) and add `data-animate` to the top-level containers so they animate on scroll.

**Step 6: Verify**

```bash
npm run dev
```

Smooth scroll active. Sections fade-up on scroll. Page transitions work between pages.

**Step 7: Commit**

```bash
git add src/scripts/ src/layouts/Base.astro src/components/ package.json package-lock.json
git commit -m "feat: add Lenis smooth scroll, GSAP scroll animations and Astro View Transitions"
```

---

## Task 12: FAQ Section + Home Assembly

**Files:**
- Create: `src/components/FAQ.astro`
- Modify: `src/pages/index.astro` (final home assembly with all sections)

**Step 1: Create FAQ accordion component**

Create `src/components/FAQ.astro` — reads from faq collection. Accordion with vanilla JS. Question in Outfit font-medium, answer in Outfit font-light. Plus/minus toggle icon. Smooth height animation.

**Step 2: Final Home page assembly**

Update `src/pages/index.astro` with all sections in order:

```astro
<Base title="Inicio">
  <main>
    <Hero />
    <Services />
    <GalleryFeatured />
    <ArtistsPreview />
    <Process />
    <Testimonials />
    <FAQ />
    <CTASection />
  </main>
</Base>
```

**Step 3: Verify complete home page**

```bash
npm run dev
```

All sections render in order, animations work, links navigate correctly.

**Step 4: Commit**

```bash
git add src/components/FAQ.astro src/pages/index.astro
git commit -m "feat: add FAQ accordion and assemble complete home page"
```

---

## Task 13: Image Conversion Script + Portfolio Import

**Files:**
- Create: `scripts/convert-images.sh`
- Populate: `public/images/gallery/` and `public/images/artists/`

**Step 1: Create image conversion script**

The `fotos/` directory has JPG, PNG, and HEIC files. HEIC needs conversion.

Create `scripts/convert-images.sh`:

```bash
#!/bin/bash
# Convert HEIC files to JPG and optimize all images for web
# Requires: imagemagick (convert) or libheif (heif-convert)

FOTOS_DIR="fotos"
OUTPUT_DIR="public/images"

mkdir -p "$OUTPUT_DIR/gallery"
mkdir -p "$OUTPUT_DIR/artists"

# Convert HEIC to JPG
find "$FOTOS_DIR" -name "*.HEIC" -o -name "*.heic" | while read f; do
  basename=$(basename "$f" | sed 's/\.[hH][eE][iI][cC]$/.jpg/')
  magick "$f" -quality 85 -resize "2000x2000>" "$OUTPUT_DIR/gallery/$basename"
  echo "Converted: $f -> $basename"
done

# Copy and resize JPG/PNG
find "$FOTOS_DIR" -name "*.jpg" -o -name "*.JPG" -o -name "*.jpeg" -o -name "*.PNG" -o -name "*.png" | while read f; do
  basename=$(basename "$f" | sed 's/\.[jJ][pP][gG]$/.jpg/' | sed 's/\.[jJ][pP][eE][gG]$/.jpg/' | sed 's/\.[pP][nN][gG]$/.png/')
  magick "$f" -quality 85 -resize "2000x2000>" "$OUTPUT_DIR/gallery/$basename"
  echo "Processed: $f -> $basename"
done

echo "Done. Images in $OUTPUT_DIR/gallery/"
```

**Step 2: Run the conversion**

```bash
chmod +x scripts/convert-images.sh
bash scripts/convert-images.sh
```

Note: requires `imagemagick` installed (`sudo pacman -S imagemagick` on Arch).

**Step 3: Create Keystatic gallery entries for imported images**

For each imported image, create a corresponding entry in `src/content/gallery/` via the Keystatic admin UI or manually as YAML files linking to the image path and the correct artist + style.

**Step 4: Commit**

```bash
git add scripts/convert-images.sh public/images/ src/content/gallery/
git commit -m "feat: import and optimize portfolio images, create gallery entries"
```

Note: `public/images/` may be large. Consider `.gitignore`-ing originals in `fotos/` and only committing optimized versions. Or use Git LFS for large image files.

---

## Task 14: SEO, Meta Tags + Performance

**Files:**
- Modify: `src/layouts/Base.astro` (add comprehensive meta tags)
- Create: `public/robots.txt`
- Create: `public/sitemap.xml` (auto-generated by @astrojs/sitemap)

**Step 1: Add SEO meta tags to Base layout**

Update `src/layouts/Base.astro` head:

```astro
<!-- Open Graph -->
<meta property="og:title" content={`${title} | Neu Studio`} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:locale" content="es_ES" />
<meta property="og:site_name" content="Neu Studio" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />

<!-- Structured Data (LocalBusiness) -->
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    "name": "Neu Studio",
    "address": { "@type": "PostalAddress", "addressLocality": "Dos Hermanas", "addressRegion": "Sevilla" },
    "url": "https://neustudio.es",
  })}
</script>
```

**Step 2: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://neustudio.es/sitemap-index.xml
```

**Step 3: Verify build and check Lighthouse**

```bash
npm run build
npm run preview
```

Run Lighthouse audit. Target: Performance 95+, SEO 100, Accessibility 95+.

**Step 4: Commit**

```bash
git add src/layouts/Base.astro public/robots.txt
git commit -m "feat: add SEO meta tags, structured data and robots.txt"
```

---

## Task 15: Cloudflare Pages Deploy

**Step 1: Push to GitHub**

```bash
git remote add origin git@github.com:USERNAME/neu-studio.git
git push -u origin main
```

**Step 2: Connect Cloudflare Pages**

1. Go to Cloudflare Dashboard > Pages > Create a project
2. Connect GitHub repo `neu-studio`
3. Build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: 20

**Step 3: Set environment variables**

In Cloudflare Pages settings > Environment variables:
- `RESEND_API_KEY`: (from resend.com account)
- `CONTACT_EMAIL`: (studio email address)

**Step 4: Configure custom domain**

In Cloudflare Pages > Custom domains > Add `neustudio.es` (or whatever domain).

**Step 5: Verify deployment**

- Visit the Cloudflare Pages URL
- Test all pages render
- Test contact form sends email
- Test Cal.com embed loads
- Test WhatsApp button opens correct chat
- Test Keystatic admin at `/keystatic`

**Step 6: Commit any deployment fixes**

```bash
git add -A
git commit -m "fix: deployment configuration adjustments"
git push
```

---

## Summary

| Task | Description | Dependencies |
|------|-------------|--------------|
| 1 | Project scaffolding (Astro + Tailwind + fonts) | None |
| 2 | Keystatic CMS setup + content collections | Task 1 |
| 3 | Navigation component | Task 1 |
| 4 | Hero section | Task 3 |
| 5 | Services + Process + Testimonials + CTA | Task 2, 3 |
| 6 | Gallery + PhotoSwipe | Task 2, 3 |
| 7 | Artists pages | Task 2, 6 |
| 8 | Booking page + floating buttons | Task 3 |
| 9 | Contact page + Cloudflare Function | Task 3 |
| 10 | Legal pages + Footer | Task 2, 3 |
| 11 | Smooth scroll + animations | Tasks 4-10 |
| 12 | FAQ + final home assembly | Tasks 5-7 |
| 13 | Image conversion + portfolio import | Task 6 |
| 14 | SEO + meta tags | Tasks 1-12 |
| 15 | Cloudflare Pages deploy | All |

**Parallel tracks possible:**
- Tasks 3-4 (nav + hero) can run while Task 2 (Keystatic) is being set up
- Tasks 8, 9, 10 are independent of each other (can be parallelized)
- Task 11 (animations) should come after all visual components exist
- Task 13 (images) can start as soon as Task 6 (gallery) is done
