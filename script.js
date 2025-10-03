if (window.location.pathname.endsWith('index.html')) {
  const newPath = window.location.pathname.replace(/index\.html$/, '');
  const newUrl = `${newPath}${window.location.search}${window.location.hash}` || '/';
  history.replaceState(null, '', newUrl);
}

const toggleButton = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const header = document.querySelector('.site-header');

const closeNav = () => {
  if (!toggleButton || !navLinks) return;
  toggleButton.setAttribute('aria-expanded', 'false');
  navLinks.setAttribute('aria-hidden', 'true');
};

const openNav = () => {
  if (!toggleButton || !navLinks) return;
  toggleButton.setAttribute('aria-expanded', 'true');
  navLinks.setAttribute('aria-hidden', 'false');
};

if (toggleButton && navLinks) {
  toggleButton.addEventListener('click', () => {
    const expanded = toggleButton.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeNav();
    } else {
      openNav();
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        closeNav();
      }
    });
  });

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      navLinks.setAttribute('aria-hidden', 'false');
      toggleButton.setAttribute('aria-expanded', 'false');
    } else if (toggleButton.getAttribute('aria-expanded') === 'false') {
      navLinks.setAttribute('aria-hidden', 'true');
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (header) {
  const setHeaderState = () => {
    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });
}

const initializeAnimations = () => {
  if (prefersReducedMotion) return;

  document.documentElement.classList.add('animation-ready');

  const animatedElements = document.querySelectorAll('[data-animate]');
  animatedElements.forEach((el, index) => {
    el.style.setProperty('--delay-index', el.dataset.delay || index * 0.1);
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  animatedElements.forEach(el => observer.observe(el));
};

if (!prefersReducedMotion) {
  window.addEventListener('load', initializeAnimations);
}

const form = document.querySelector('[data-formspree="contact"]');
const statusElement = form ? form.querySelector('.form-status') : null;

if (form && statusElement) {
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(form);
    statusElement.textContent = 'Sending…';
    statusElement.classList.remove('form-status--error', 'form-status--success');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        statusElement.textContent = 'Thanks for reaching out! I’ll reply soon.';
        statusElement.classList.add('form-status--success');
        form.reset();
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      statusElement.textContent = 'Something went wrong. Please try again or email me directly.';
      statusElement.classList.add('form-status--error');
    }
  });
}

