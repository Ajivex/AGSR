/* AGSR Engineering Pte. Ltd. — Option 1 Main Script */

// ─── NAV SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── HAMBURGER ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── INTERSECTION OBSERVER (Fade Animations) ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ─── PROJECT FILTER ───
function filterProjects(event, cat) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  document.querySelectorAll('.project-card[data-category]').forEach(card => {
    const match = cat === 'all' || card.dataset.category === cat;
    card.style.display = match ? '' : 'none';
  });
}

// ─── MODALS (PROJECTS & TEAM) ───
function openProjectModal(title, tag, desc) {
  document.getElementById('projTitle').textContent = title;
  document.getElementById('projTag').textContent = tag;
  document.getElementById('projDesc').textContent = desc;
  document.getElementById('projectModal').classList.add('open');
}

function openTeamModal(name, role, exp, email, phone) {
  document.getElementById('teamName').textContent = name;
  document.getElementById('teamRole').textContent = role;
  document.getElementById('teamExp').textContent = exp;
  document.getElementById('teamWa').href = `https://wa.me/${phone}`;
  document.getElementById('teamMail').href = `mailto:${email}`;
  document.getElementById('teamModal').classList.add('open');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

// Close modals on outside click
document.querySelectorAll('.lightbox').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal.id);
  });
});

// ─── 3D WORKER SCROLL FAB ───
const scrollFab = document.getElementById('scrollWorkerFab');
const tooltip = scrollFab.querySelector('.fab-tooltip');

scrollFab.addEventListener('click', () => {
  const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200;
  if (atBottom) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: document.body.offsetHeight, behavior: 'smooth' });
  }
});

window.addEventListener('scroll', () => {
  const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200;
  tooltip.textContent = atBottom ? 'Go to Top' : 'Go to Bottom';
});

// ─── REVIEWS SLIDER (Uncomment when needed) ───
/*
let currentSlide = 0;
function slideReview(dir) {
  const slides = document.querySelectorAll('.review-slide');
  if(slides.length === 0) return;
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
}
*/

// ─── CONTACT FORM ───
// ─── CONTACT FORM ───
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlFmIeDm_ypTxzEEUbSx5CH4KjG7CvicBJ4-DUtjiDeDJdOsOYcEi5p_yieooZTl6P/exec';

document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    status.className = 'form-status error';
    status.textContent = 'Please fill in all required fields.';
    return;
  }

  btn.disabled = true;
  status.style.display = 'none';
  btn.innerHTML = 'Sending...';

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      // Added Content-Type to prevent simple CORS errors with Google Apps Script
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        name: form.name.value,
        company: form.company.value,
        email: form.email.value,
        phone: form.phone.value,
        service: form.service.value,
        message: form.message.value
      })
    });

    const text = await response.text();
    console.log("Response:", text);
    const result = JSON.parse(text);

    if (result.success) {
      status.className = 'form-status success';
      status.style.display = 'block';
      status.innerHTML = `✓ Enquiry submitted successfully.<br>Reference ID: <strong>${result.enquiryId || 'OK'}</strong>`;
      form.reset();
    } else {
      throw new Error(result.error || 'Submission failed');
    }

  } catch (err) {
    status.className = 'form-status error';
    status.style.display = 'block';
    status.textContent = 'ERROR: ' + err.message;
    console.error(err);
  }

  btn.disabled = false;
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg> Send Enquiry
  `;
});
