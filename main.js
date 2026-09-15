/**
 * MEI HAO BEAUTY SALON — CORE APPLICATION JS
 * Handles UI interactions, mobile drawer, form dispatches, filter dynamics, and accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollHeader();
  initFAQAccordion();
  initServiceFilters();
  initAppointmentForm();
  initBackToTop();
  updateCopyrightYear();
});

/* ------------------------------------------------------------------------
   1. Mobile Menu Drawer Controls
   ------------------------------------------------------------------------ */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    nav.setAttribute('aria-hidden', expanded);
    nav.classList.toggle('open');

    // Prevent background scrolling when menu is open
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  // Close drawer when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
      nav.classList.remove('open');
      document.body.style.overflow = '';
      btn.focus();
    }
  });
}

/* ------------------------------------------------------------------------
   2. Sticky Header & Scroll Progress
   ------------------------------------------------------------------------ */
function initScrollHeader() {
  const progress = document.getElementById('scrollProgress');
  const backBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    if (progress) {
      progress.style.width = scrolled + '%';
    }

    if (backBtn) {
      if (winScroll > 300) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }
  }, { passive: true });
}

/* ------------------------------------------------------------------------
   3. Back To Top
   ------------------------------------------------------------------------ */
function initBackToTop() {
  const backBtn = document.getElementById('backToTop');
  if (!backBtn) return;

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ------------------------------------------------------------------------
   4. FAQ Accordion Interaction
   ------------------------------------------------------------------------ */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((button) => {
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const isOpen = faqItem.classList.contains('active');

      // Close all active items
      document.querySelectorAll('.faq-item').forEach((item) => {
        item.classList.remove('active');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });

      // If clicked item was not open, open it
      if (!isOpen) {
        faqItem.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ------------------------------------------------------------------------
   5. Service Directory Category Filtering
   ------------------------------------------------------------------------ */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const categories = document.querySelectorAll('.service-category-block');

  if (filterBtns.length === 0 || categories.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      categories.forEach((cat) => {
        if (filter === 'all' || cat.getAttribute('data-category') === filter) {
          cat.style.display = 'block';
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });
}

/* ------------------------------------------------------------------------
   6. Appointment Form Dispatch (Formats data directly into WhatsApp URL)
   ------------------------------------------------------------------------ */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const service = document.getElementById('serviceSelect').value;
    const date = document.getElementById('prefDate').value;
    const time = document.getElementById('prefTime').value;
    const msg = document.getElementById('clientMessage').value.trim();

    // Construct clean WhatsApp message
    let text = `Hello Mei Hao Beauty Salon,%0A%0A`;
    text += `I would like to request an appointment enquiry with details below:%0A`;
    text += `• *Name:* ${encodeURIComponent(name)}%0A`;
    text += `• *Phone:* ${encodeURIComponent(phone)}%0A`;
    text += `• *Service:* ${encodeURIComponent(service)}%0A`;
    if (date) text += `• *Preferred Date:* ${encodeURIComponent(date)}%0A`;
    if (time) text += `• *Preferred Time:* ${encodeURIComponent(time)}%0A`;
    if (msg) text += `• *Additional Note:* ${encodeURIComponent(msg)}%0A`;

    const waUrl = `https://wa.me/923131776688?text=${text}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });
}

/* ------------------------------------------------------------------------
   7. Dynamic Copyright Year
   ------------------------------------------------------------------------ */
function updateCopyrightYear() {
  const yearEl = document.getElementById('copyrightYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
