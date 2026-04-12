document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');

  menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      navbar.classList.toggle('menu-active');
  });

  // --- Scroll-triggered Theme ---
  const triggers = document.querySelectorAll('.theme-trigger');
  
  const handleThemeScroll = () => {
      let isGarnet = false;
      triggers.forEach(trigger => {
          const { top } = trigger.getBoundingClientRect();
          if (top <= window.innerHeight * 0.6) {
              isGarnet = true;
          }
      });
      
      if (isGarnet) {
          document.body.classList.remove('theme-almond');
          document.body.classList.add('theme-garnet');
      } else {
          document.body.classList.remove('theme-garnet');
          document.body.classList.add('theme-almond');
      }
  };

  window.addEventListener('scroll', handleThemeScroll, { passive: true });
  handleThemeScroll(); // Check on init

  // --- Intersection Observer for Layout Animations ---
  const animElements = document.querySelectorAll('.anim-target');
  
  const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              fadeObserver.unobserve(entry.target); 
          }
      });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animElements.forEach(el => fadeObserver.observe(el));

  // --- Custom Cursor ---
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  
  if (window.matchMedia("(pointer: fine)").matches) {
      document.body.appendChild(cursorDot);
      document.body.appendChild(cursorRing);

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;
      
      window.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          
          cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
      });

      // Lerp for the ring
      const animateRing = () => {
          ringX += (mouseX - ringX) * 0.15;
          ringY += (mouseY - ringY) * 0.15;
          cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
          requestAnimationFrame(animateRing);
      };
      animateRing();

      // Hover states
      const interactables = document.querySelectorAll('a, button, .menu-toggle, .logo, .magnetic');
      interactables.forEach(el => {
          el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
          el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
      });
  } else {
      // Mobile Touch Flare Effect
      document.addEventListener('touchstart', (e) => {
          const touch = e.touches[0];
          const flare = document.createElement('div');
          flare.className = 'touch-flare';
          flare.style.left = `${touch.clientX}px`;
          flare.style.top = `${touch.clientY}px`;
          
          document.body.appendChild(flare);
          
          // Clean up after animation finishes (0.5s)
          setTimeout(() => {
              flare.remove();
          }, 500);
      }, { passive: true });
  }

  // --- Magnetic Elements ---
  const magneticEls = document.querySelectorAll('.magnetic');
  magneticEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
          el.classList.add('magnet-active');
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.3; // Pull strength
          const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
          el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => {
          el.classList.remove('magnet-active');
          el.style.transform = `translate(0px, 0px)`;
      });
  });

  // --- Subtle Parallax ---
  const parallaxEls = document.querySelectorAll('.parallax-bg');
  window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      parallaxEls.forEach(el => {
          const speed = el.dataset.speed || 0.1;
          const yPos = -(scrolled * speed);
          el.style.transform = `translateY(${yPos}px) scale(1.1)`;
      });
  }, { passive: true });
});
