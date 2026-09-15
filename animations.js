/**
 * MEI HAO BEAUTY SALON — ANIMATIONS & THREE.JS ENGINE
 * Performance Target: Sub-second perception, throttled WebGL frame rate
 */

document.addEventListener('DOMContentLoaded', () => {
  // Respect Reduced Motion settings
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. THREE.JS Subtle Ambient Hero Graphic (Only on pages with #hero-canvas)
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !prefersReducedMotion && typeof THREE !== 'undefined') {
    initHeroWebGL(canvas);
  }

  /* ------------------------------------------------------------------------
     2. GSAP Scroll Animations
     ------------------------------------------------------------------------ */
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero element stagger entrance
    if (document.querySelectorAll('.gsap-hero-element').length > 0) {
      gsap.from('.gsap-hero-element', {
        duration: 1,
        y: 30,
        opacity: 0,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });
    }

    // Scroll reveal sections
    const reveals = document.querySelectorAll('.gsap-reveal');
    reveals.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 40,
        opacity: 0,
        ease: 'power2.out'
      });
    });
  }
});

/**
 * Initializes a low-overhead WebGL particle wave for the hero background.
 * Pauses automatically when offscreen.
 */
function initHeroWebGL(canvasElement) {
  let scene, camera, renderer, particles, particleGeo;
  let animationFrameId;
  let isVisible = true;

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,
      antialias: false, // Turned off for performance performance budget
      powerPreference: "low-power"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Particle Geometry
    const count = 400; // Low particle count for performance
    particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 300;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Warm Gold particle tone matching palette
    const material = new THREE.PointsMaterial({
      color: 0xc5a059,
      size: 1.5,
      transparent: true,
      opacity: 0.4
    });

    particles = new THREE.Points(particleGeo, material);
    scene.add(particles);

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
      if (isVisible) {
        const elapsedTime = clock.getElapsedTime();
        particles.rotation.y = elapsedTime * 0.03;
        particles.rotation.x = elapsedTime * 0.015;
        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // IntersectionObserver to pause rendering when hero is offscreen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });

    const heroSection = document.getElementById('hero');
    if (heroSection) observer.observe(heroSection);

    // Window Resize Handling
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });

  } catch (e) {
    // Graceful fallback if WebGL fails
    if (canvasElement) canvasElement.style.display = 'none';
  }
}
