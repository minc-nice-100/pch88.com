/* ============================================================
   pch88.com — PJAX Router, Audio Player, Lightbox & Animations
   ============================================================ */
(function() {
  'use strict';

  /* ---- DOM refs ---- */
  const nav        = document.getElementById('siteNav');
  const navLinksEl = document.getElementById('navLinks');
  const navToggle  = document.getElementById('navToggle');
  const allNavLinks = nav.querySelectorAll('.nav-link[data-page]');
  const audio       = document.getElementById('bgAudio');
  const playerBtn   = document.getElementById('playerBtn');
  const playerWave  = document.getElementById('playerWave');
  const volumeSlider = document.getElementById('volumeSlider');
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose  = document.getElementById('lightboxClose');

  let currentPage     = 'home';
  let isTransitioning = false;
  let audioStarted    = false;

  /* ==========================================================
     PJAX Navigation
     ========================================================== */
  function navigateTo(pageName, addToHistory) {
    if (isTransitioning || pageName === currentPage) return;
    isTransitioning = true;

    const oldSection = document.getElementById('page-' + currentPage);
    const newSection = document.getElementById('page-' + pageName);
    if (!oldSection || !newSection) { isTransitioning = false; return; }

    /* Update nav active state */
    allNavLinks.forEach(function(l) {
      l.classList.toggle('active', l.dataset.page === pageName);
    });

    /* Fade out old */
    oldSection.style.transition = 'opacity 0.25s, transform 0.25s';
    oldSection.style.opacity = '0';
    oldSection.style.transform = 'translateY(8px)';

    setTimeout(function() {
      oldSection.classList.remove('active');
      oldSection.style.opacity = '';
      oldSection.style.transform = '';
      oldSection.style.transition = '';

      /* Show new */
      newSection.classList.add('active');
      newSection.style.opacity = '0';
      newSection.style.transform = 'translateY(8px)';

      requestAnimationFrame(function() {
        newSection.style.transition = 'opacity 0.35s, transform 0.35s';
        newSection.style.opacity = '1';
        newSection.style.transform = 'translateY(0)';
      });

      /* Re-observe fade-up elements */
      observeSection(newSection);

      window.scrollTo({ top: 0, behavior: 'instant' });

      currentPage = pageName;

      if (addToHistory !== false) {
        var url = pageName === 'home' ? '/' : '/#' + pageName;
        history.pushState({ page: pageName }, '', url);
      }

      setTimeout(function() {
        newSection.style.transition = '';
        isTransitioning = false;
      }, 400);
    }, 280);

    /* Close mobile nav */
    navLinksEl.classList.remove('open');
    navToggle.classList.remove('open');
  }

  /* ==========================================================
     Intersection Observer for scroll animations
     ========================================================== */
  var fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  function observeSection(section) {
    section.querySelectorAll('.fade-up').forEach(function(el) {
      el.classList.remove('visible');
      fadeObserver.observe(el);
    });
  }

  /* Initial observation */
  observeSection(document.getElementById('page-home'));

  /* ==========================================================
     Nav click handlers
     ========================================================== */
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo(link.dataset.page, true);
    });
  });

  /* Mobile nav toggle */
  navToggle.addEventListener('click', function() {
    navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  /* ==========================================================
     History popstate
     ========================================================== */
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
      navigateTo(e.state.page, false);
    } else {
      navigateTo('home', false);
    }
  });

  /* Handle initial hash / URL */
  (function handleInitialRoute() {
    var hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('page-' + hash)) {
      navigateTo(hash, false);
      history.replaceState({ page: hash }, '', '/#' + hash);
    } else {
      history.replaceState({ page: 'home' }, '', '/');
    }
  })();

  /* ==========================================================
     Audio Player
     ========================================================== */
  function initAudio() {
    if (audioStarted) return;
    audio.volume = parseFloat(volumeSlider.value);
    audio.play().then(function() {
      audioStarted = true;
      playerBtn.textContent = '⏸';   /* ⏸ */
      playerBtn.classList.add('playing');
      playerWave.classList.add('animating');
    }).catch(function() {
      /* Autoplay blocked — user must interact */
      playerBtn.textContent = '▶';   /* ▶ */
    });
  }

  playerBtn.addEventListener('click', function() {
    if (!audioStarted) { initAudio(); return; }
    if (audio.paused) {
      audio.play();
      playerBtn.textContent = '⏸';
      playerBtn.classList.add('playing');
      playerWave.classList.add('animating');
    } else {
      audio.pause();
      playerBtn.textContent = '▶';
      playerBtn.classList.remove('playing');
      playerWave.classList.remove('animating');
    }
  });

  volumeSlider.addEventListener('input', function() {
    audio.volume = parseFloat(volumeSlider.value);
  });

  /* Try autoplay on first user interaction */
  function autoplayOnInteraction() {
    if (!audioStarted) initAudio();
  }
  document.addEventListener('click', autoplayOnInteraction, { once: true });
  document.addEventListener('scroll', autoplayOnInteraction, { once: true });
  document.addEventListener('keydown', autoplayOnInteraction, { once: true });

  /* ==========================================================
     Lightbox
     ========================================================== */
  document.querySelectorAll('[data-lightbox]').forEach(function(el) {
    el.addEventListener('click', function() {
      var src     = el.dataset.lightbox;
      var caption = el.dataset.caption || '';
      lightboxImg.src = src;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function() { lightboxImg.src = ''; }, 300);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  /* ==========================================================
     Nav scroll shadow
     ========================================================== */
  var navScrollTicking = false;
  window.addEventListener('scroll', function() {
    if (!navScrollTicking) {
      requestAnimationFrame(function() {
        if (window.scrollY > 80) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        navScrollTicking = false;
      });
      navScrollTicking = true;
    }
  }, { passive: true });

})();
