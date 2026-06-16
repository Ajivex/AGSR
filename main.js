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
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.innerHTML = 'Sending...';
  
  // Here Google Apps script fetch logic can be placed (from original file)
  setTimeout(() => {
    btn.innerHTML = 'Enquiry Sent ✓';
    btn.style.background = '#28a745';
    e.target.reset();
    setTimeout(() => {
        btn.innerHTML = 'Send Enquiry';
        btn.style.background = '';
    }, 3000);
  }, 1500);
});
