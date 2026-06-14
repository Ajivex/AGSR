/* AGSR Engineering Pte. Ltd. — Main Script */
 /* Generated from index.html */

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
 hamburger.setAttribute('aria-expanded', open);
 document.body.style.overflow = open ? 'hidden' : '';
 });
 function closeMobile() {
 hamburger.classList.remove('open');
 mobileMenu.classList.remove('open');
 hamburger.setAttribute('aria-expanded', 'false');
 document.body.style.overflow = '';
 }
 mobileMenu.addEventListener('click', (e) => {
 if (e.target.tagName === 'A') closeMobile();
 });

// ─── COUNTERS ───
 function animateCounter(el, target, duration = 1800) {
 let start = null;
 const step = (timestamp) => {
 if (!start) start = timestamp;
 const progress = Math.min((timestamp - start) / duration, 1);
 const eased = 1 - Math.pow(1 - progress, 3);
 el.textContent = Math.floor(eased * target);
 if (progress < 1) requestAnimationFrame(step);
 else el.textContent = target;
 };
 requestAnimationFrame(step);
 }
 let countersStarted = false;
 const statsData = { 'stat-years': 20, 'stat-projects': 500, 'stat-clients': 120, 'stat-team': 80 };

// ─── INTERSECTION OBSERVER ───
 const observer = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 entry.target.classList.add('visible');

 // Start counters when hero stats visible
 if (!countersStarted && entry.target.closest('#hero')) {
 countersStarted = true;
 setTimeout(() => {
 Object.entries(statsData).forEach(([id, val]) => {
 const el = document.getElementById(id);
 if (el) animateCounter(el, val);
 });
 }, 400);
 }
 observer.unobserve(entry.target);
 }
 });
 }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
 // Observe hero for counters
 const heroSection = document.querySelector('#hero');
 if (heroSection) observer.observe(heroSection);

// ─── PROJECT FILTER ───
 function filterProjects(cat) {
 document.querySelectorAll('.tab-btn').forEach(btn => {
 btn.classList.remove('active');
 btn.setAttribute('aria-selected', 'false');
 });
 event.target.classList.add('active');
 event.target.setAttribute('aria-selected', 'true');

 document.querySelectorAll('.project-card').forEach(card => {
 const match = cat === 'all' || card.dataset.category === cat;
 card.style.display = match ? '' : 'none';
 });
 }

// ─── LIGHTBOX ───
 function openLightbox(title, tag, desc, emoji) {
 document.getElementById('lightboxTitle').textContent = title;
 document.getElementById('lightboxTag').textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
 document.getElementById('lightboxDesc').textContent = desc;
 document.getElementById('lightboxEmoji').textContent = emoji;
 const lb = document.getElementById('lightbox');
 lb.classList.add('open');
 document.body.style.overflow = 'hidden';
 lb.querySelector('.lightbox-close').focus();
 }
 function closeLightbox() {
 document.getElementById('lightbox').classList.remove('open');
 document.body.style.overflow = '';
 }
 document.getElementById('lightbox').addEventListener('click', (e) => {
 if (e.target === e.currentTarget) closeLightbox();
 });
 document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape') closeLightbox();
 });

// ─── CONTACT FORM ───
 // ⚙️ CONFIGURE THESE:
 const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'; // Replace with your Formspree endpoint
 const WHATSAPP_NUMBER = '6590000000'; // Replace with actual number (no + or spaces)

document.getElementById('contactForm').addEventListener('submit', async (e) => {
 e.preventDefault();
 const form = e.target;
 const btn = document.getElementById('submitBtn');
 const status = document.getElementById('formStatus');

 // Basic validation
 const name = form.name.value.trim();
 const email = form.email.value.trim();
 const message = form.message.value.trim();
 if (!name || !email || !message) {
 status.className = 'form-status error';
 status.textContent = 'Please fill in all required fields (Name, Email, Message).';
 return;
 }
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
 status.className = 'form-status error';
 status.textContent = 'Please enter a valid email address.';
 return;
 }

 btn.disabled = true;
 btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Sending…';
 status.className = 'form-status';
 status.style.display = 'none';

 try {
 // Send via Formspree (email)
 const res = await fetch(FORMSPREE_URL, {
 method: 'POST',
 headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
 body: JSON.stringify({
 name: form.name.value,
 company: form.company.value,
 email: form.email.value,
 phone: form.phone.value,
 service: form.service.value,
 message: form.message.value,
 })
 });

 if (res.ok) {
 // WhatsApp notification
 const waMsg = encodeURIComponent(
 `🔔 *New Enquiry — AGSR Engineering*\n\n` +
 `*Name:* ${form.name.value}\n` +
 `*Company:* ${form.company.value || 'Not provided'}\n` +
 `*Email:* ${form.email.value}\n` +
 `*Phone:* ${form.phone.value || 'Not provided'}\n` +
 `*Service:* ${form.service.value || 'Not specified'}\n\n` +
 `*Message:*\n${form.message.value}`
 );
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`, '_blank', 'noopener');

 status.className = 'form-status success';
 status.textContent = '✓ Your enquiry has been sent! We will contact you within 24 hours. A WhatsApp notification has also been opened.';
 form.reset();
 } else {
 throw new Error('Server error');
 }
 } catch {
 status.className = 'form-status error';
 status.textContent = 'Something went wrong. Please email us directly at enquiries@agsrengineering.com.sg or call +65 9XXX XXXX.';
 } finally {
 btn.disabled = false;
 btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Enquiry';
 }
 });
