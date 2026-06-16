
document.addEventListener('DOMContentLoaded', function () {

  const heroName = document.getElementById('heroName');

  if (heroName) {
    const text    = heroName.textContent;  
    heroName.textContent = '';              

    text.split('').forEach(function (char, index) {
      const span = document.createElement('span');
      span.classList.add('char');

      span.textContent = char === ' ' ? '\u00A0' : char;

      span.style.animationDelay = (0.05 + index * 0.06) + 's';

      heroName.appendChild(span);
    });
  }

  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);

  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          
          navLinks.forEach(link => link.classList.remove('active'));

          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(
            `.nav-link[href="#${id}"]`
          );
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }   
  );

  sections.forEach(sec => sectionObserver.observe(sec));


  const hamburger = document.getElementById('hamburger');
  const navList   = document.getElementById('navLinks');

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !navList.classList.contains('open');
    navList.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);

    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  hamburger.addEventListener('click', function () {
    toggleMenu();
  });

  
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(false);
    });
  });

  
  document.addEventListener('click', function (e) {
    if (
      navList.classList.contains('open') &&
      !navList.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });


  
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,    
      rootMargin: '0px 0px -40px 0px' 
    }
  );

  revealElements.forEach(function (el, index) {
    
    el.style.transitionDelay = (index % 4) * 0.08 + 's';
    revealObserver.observe(el);
  });


  const skillCards = document.querySelectorAll('.skill-card');

  const barObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('bar-animate');
          }, 200);
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillCards.forEach(card => barObserver.observe(card));


  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetTop = targetEl.getBoundingClientRect().top
                        + window.scrollY
                        - navHeight
                        - 12;          

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  
  const contactForm  = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  
  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.add('invalid');
    error.textContent = message;
  }


  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.remove('invalid');
    error.textContent = '';
  }


  ['formName', 'formEmail', 'formMessage'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function () {
        el.classList.remove('invalid');
        
        const errId = id.replace('form', '').toLowerCase() + 'Error';
        const errEl = document.getElementById(
          id === 'formName'    ? 'nameError'  :
          id === 'formEmail'   ? 'emailError' : 'msgError'
        );
        if (errEl) errEl.textContent = '';
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();   


      const name    = document.getElementById('formName').value.trim();
      const email   = document.getElementById('formEmail').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      
      clearError('formName',    'nameError');
      clearError('formEmail',   'emailError');
      clearError('formMessage', 'msgError');
      formFeedback.textContent = '';
      formFeedback.className   = 'form-feedback';

    
      let hasError = false;

      if (name.length < 2) {
        showError('formName', 'nameError',
                  'Please enter your full name (at least 2 characters).');
        hasError = true;
      }

      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showError('formEmail', 'emailError',
                  'Please enter a valid email address.');
        hasError = true;
      }

      if (message.length < 10) {
        showError('formMessage', 'msgError',
                  'Message must be at least 10 characters.');
        hasError = true;
      }

      if (hasError) return;


      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';

    
      setTimeout(function () {
        
        formFeedback.textContent = '✅ Message sent! I\'ll get back to you soon.';
        formFeedback.classList.add('success');

        contactForm.reset();

        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';

        setTimeout(function () {
          formFeedback.textContent = '';
          formFeedback.className   = 'form-feedback';
        }, 6000);

      }, 1500);
    });
  }


  const heroRole = document.querySelector('.hero-role');

  const phrases = [
    'Artificial Intelligence & Data Science Student',
    'Web Developer & Problem Solver',
    'AI Enthusiast & Data Explorer',
    'Future Tech Innovator'
  ];

  let phraseIndex  = 0; 
  let charIndex    = 0;   
  let isDeleting   = false;
  let typingPaused = false;

  function typeEffect() {
    if (!heroRole) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
    
      heroRole.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;
    } else {
  
      heroRole.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(typeEffect, speed);
  }


  setTimeout(typeEffect, 1500);

  console.log('✅ Portfolio script loaded successfully!');

}); 