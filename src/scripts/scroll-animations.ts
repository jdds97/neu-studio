import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Animate all elements with data-animate attribute
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

// Staggered animations for grid children
document.querySelectorAll('[data-animate-stagger]').forEach((container) => {
  const children = container.children;
  gsap.from(children, {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      once: true,
    },
  });
});
