// ===== BUILDCRAFT CONSTRUCTION — MAIN.JS =====

const API = 'http://localhost:4000/api';

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    navLinks.classList.remove('open');
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = +el.getAttribute('data-target');
  let count = 0;
  const step = target / 80;
  const timer = setInterval(() => {
    count += step;
    if (count >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(count);
  }, 20);
}
const counters = document.querySelectorAll('.num');
let countersStarted = false;
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counters.forEach(animateCounter);
  }
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ===== FADE IN ON SCROLL =====
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
fadeEls.forEach(el => fadeObserver.observe(el));

// ===== LOAD SERVICES =====
// ===== LOAD SERVICES =====
async function loadServices() {
  const grid = document.getElementById('servicesGrid');
  const defaultServices = [
    { id: 1, icon: 'fas fa-home', title: 'Residential Construction', description: 'Custom homes, villas, and apartments built to your exact specifications with premium materials.' },
    { id: 2, icon: 'fas fa-building', title: 'Commercial Buildings', description: 'Office complexes, retail spaces, and commercial hubs designed for functionality and impact.' },
    { id: 3, icon: 'fas fa-industry', title: 'Industrial Projects', description: 'Warehouses, factories, and industrial facilities built for durability and efficiency.' },
    { id: 4, icon: 'fas fa-paintbrush', title: 'Interior Design', description: 'Complete interior solutions — from concept to completion with top-tier finishes.' },
    { id: 5, icon: 'fas fa-tools', title: 'Renovation & Remodeling', description: 'Breathe new life into your existing spaces with our expert renovation services.' },
    { id: 6, icon: 'fas fa-ruler-combined', title: 'Architecture & Planning', description: 'Expert architectural design and project planning for complex builds.' },
  ];
  const saved = JSON.parse(localStorage.getItem('bc_services') || 'null');
  renderServices(saved || defaultServices, grid);
}

function renderServices(services, grid) {
  grid.innerHTML = services.map((s, i) => `
    <div class="service-card fade-in" style="animation-delay:${i * 0.1}s">
      <div class="service-icon"><i class="${s.icon}"></i></div>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
    </div>
  `).join('');
  addFadeObservers();
}

// ===== LOAD PROJECTS =====
async function loadProjects() {
  const saved = JSON.parse(localStorage.getItem('bc_projects') || 'null');
  if (saved) allProjects = saved;
  renderProjects('all');
}

function renderProjects(filter) {
  const grid = document.getElementById('projectsGrid');
  const filtered = filter === 'all' ? allProjects : allProjects.filter(p => p.category === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="project-card fade-in">
      <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'"/>
      <div class="project-overlay">
        <span class="project-tag">${p.category} • ${p.location || ''}</span>
        <h3>${p.title}</h3>
      </div>
    </div>
  `).join('');
  addFadeObservers();
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

// ===== TESTIMONIALS =====
const testimonials = [
  { name: 'Rajesh Kumar', role: 'Home Owner, Coimbatore', text: 'BuildCraft delivered our dream home exactly on time. The quality of work is outstanding and every detail was perfect.', rating: 5 },
  { name: 'Priya Lakshmi', role: 'Business Owner, Chennai', text: 'Our commercial complex was completed ahead of schedule. Professional team, transparent pricing. Highly recommended!', rating: 5 },
  { name: 'Murugan A.', role: 'Factory Manager, Trichy', text: 'The industrial warehouse they built for us is robust and efficient. Great project management throughout.', rating: 5 },
  { name: 'Kavitha S.', role: 'Property Developer, Madurai', text: 'Partnered with BuildCraft on 3 projects. Always consistent quality and they never compromise on materials.', rating: 5 },
  { name: 'Senthil Nathan', role: 'Hotel Owner, Salem', text: 'Renovated our entire hotel lobby and rooms. The interior design team is creative and professional. Excellent outcome!', rating: 5 },
];



// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const msg = document.getElementById('formMsg');
  const formData = Object.fromEntries(new FormData(form));

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Save directly to localStorage so admin panel can see it
  const enquiries = JSON.parse(localStorage.getItem('bc_enquiries') || '[]');
  enquiries.push({
    id: Date.now(),
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    service: formData.service,
    message: formData.message,
    date: new Date().toISOString(),
    status: 'new'
  });
  localStorage.setItem('bc_enquiries', JSON.stringify(enquiries));

  msg.textContent = '✓ Enquiry sent! We will contact you within 24 hours.';
  msg.className = 'form-msg success';
  form.reset();

  btn.innerHTML = 'Send Enquiry <i class="fas fa-paper-plane"></i>';
  btn.disabled = false;
  setTimeout(() => { msg.textContent = ''; }, 5000);
});

// ===== HELPER: Re-observe new fade-in elements =====
function addFadeObservers() {
  document.querySelectorAll('.fade-in:not(.observed)').forEach(el => {
    el.classList.add('observed');
    fadeObserver.observe(el);
  });
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  loadServices();
  loadProjects();
  loadTestimonials();
});

// ===== STAR RATING =====
const stars = document.querySelectorAll('#starRating span');
let selectedRating = 5;

// Default 5 stars active
stars.forEach(s => s.classList.add('active'));

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    stars.forEach(s => s.classList.remove('active'));
    for (let i = 0; i < star.dataset.val; i++) stars[i].classList.add('active');
  });
  star.addEventListener('click', () => {
    selectedRating = +star.dataset.val;
    document.getElementById('ratingVal').value = selectedRating;
  });
  star.addEventListener('mouseout', () => {
    stars.forEach(s => s.classList.remove('active'));
    for (let i = 0; i < selectedRating; i++) stars[i].classList.add('active');
  });
});

// ===== REVIEW FORM SUBMIT =====
document.getElementById('reviewForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('reviewMsg');
  const formData = Object.fromEntries(new FormData(form));

  const reviews = JSON.parse(localStorage.getItem('bc_reviews') || '[]');
  reviews.push({
    id: Date.now(),
    name: formData.name,
    role: formData.role,
    text: formData.text,
    rating: selectedRating,
    date: new Date().toISOString(),
    status: 'pending'
  });
  localStorage.setItem('bc_reviews', JSON.stringify(reviews));

  msg.textContent = '✓ Review submitted! Thank you for your feedback.';
  msg.className = 'form-msg success';
  form.reset();
  selectedRating = 5;
  stars.forEach(s => s.classList.add('active'));
  setTimeout(() => { msg.textContent = ''; }, 5000);
});

// ===== LOAD REVIEWS (approved only) =====
function loadTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const saved = JSON.parse(localStorage.getItem('bc_reviews') || '[]');
  const approved = saved.filter(r => r.status === 'approved');

  const defaultTestimonials = [
    { name: 'Rajesh Kumar', role: 'Home Owner, Coimbatore', text: 'BuildCraft delivered our dream home exactly on time. The quality of work is outstanding and every detail was perfect.', rating: 5 },
    { name: 'Priya Lakshmi', role: 'Business Owner, Chennai', text: 'Our commercial complex was completed ahead of schedule. Professional team, transparent pricing. Highly recommended!', rating: 5 },
    { name: 'Murugan A.', role: 'Factory Manager, Trichy', text: 'The industrial warehouse they built for us is robust and efficient. Great project management throughout.', rating: 5 },
  ];

  const toShow = approved.length ? approved : defaultTestimonials;

  track.innerHTML = toShow.map(t => `
    <div class="testimonial-card fade-in">
      <div class="testimonial-stars">${'★'.repeat(t.rating)}</div>
      <p>"${t.text}"</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.name[0]}</div>
        <div class="author-info">
          <h4>${t.name}</h4>
          <span>${t.role}</span>
        </div>
      </div>
    </div>
  `).join('');
  addFadeObservers();
}