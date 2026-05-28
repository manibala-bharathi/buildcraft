// ===== BUILDCRAFT — ADMIN.JS (with localStorage DB) =====

const API = 'http://localhost:3000/api';

// ===== LOCAL DATABASE (fallback when backend not running) =====
const DB = {
  get: (key) => JSON.parse(localStorage.getItem(`bc_${key}`) || 'null'),
  set: (key, val) => localStorage.setItem(`bc_${key}`, JSON.stringify(val)),

  getEnquiries: () => DB.get('enquiries') || [],
  saveEnquiries: (d) => DB.set('enquiries', d),

  getProjects: () => DB.get('projects') || defaultProjects,
  saveProjects: (d) => DB.set('projects', d),

  getServices: () => DB.get('services') || defaultServices,
  saveServices: (d) => DB.set('services', d),
};

const defaultProjects = [
  { id: 1, title: 'Sunrise Residency', category: 'residential', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', location: 'Coimbatore', description: 'Luxury residential complex with 120 units.' },
  { id: 2, title: 'Tech Park Alpha', category: 'commercial', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80', location: 'Chennai', description: 'Modern 10-floor IT office complex.' },
  { id: 3, title: 'Steel Factory Unit 5', category: 'industrial', image: 'https://images.unsplash.com/photo-1565459823968-1c8cddf85eea?w=600&q=80', location: 'Trichy', description: 'Heavy-duty industrial warehouse and factory.' },
  { id: 4, title: 'Green Valley Villas', category: 'residential', image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80', location: 'Ooty', description: '24 premium eco-friendly villas.' },
];

const defaultServices = [
  { id: 1, icon: 'fas fa-home', title: 'Residential Construction', description: 'Custom homes and villas built to your specifications.' },
  { id: 2, icon: 'fas fa-building', title: 'Commercial Buildings', description: 'Offices, malls, and retail spaces.' },
  { id: 3, icon: 'fas fa-industry', title: 'Industrial Projects', description: 'Factories and warehouses.' },
  { id: 4, icon: 'fas fa-paintbrush', title: 'Interior Design', description: 'Complete interior finishing solutions.' },
  { id: 5, icon: 'fas fa-tools', title: 'Renovation', description: 'Full renovation and remodeling.' },
  { id: 6, icon: 'fas fa-ruler-combined', title: 'Architecture & Planning', description: 'Design and project planning.' },
];

// Add demo enquiries if empty
function seedEnquiries() {
  if (DB.getEnquiries().length === 0) {
    DB.saveEnquiries([
      { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '9876543210', service: 'Residential Construction', message: 'I need a 3BHK villa in Coimbatore.', date: new Date(Date.now() - 86400000).toISOString(), status: 'new' },
      { id: 2, name: 'Priya S', email: 'priya@email.com', phone: '9876543211', service: 'Commercial Buildings', message: 'Office complex for 200 employees.', date: new Date(Date.now() - 172800000).toISOString(), status: 'read' },
    ]);
  }
}

// ===== LOGIN =====
function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  if (email === 'bb27034@gmail.com' && pass === 'manidhar') {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('adminLayout').style.display = 'flex';
    initAdmin();
  } else {
    alert('Invalid credentials! please Enter Valid Email or Password');
  }
}

function logout() {
  document.getElementById('loginOverlay').style.display = 'flex';
  document.getElementById('adminLayout').style.display = 'none';
}

// Enter key login
document.getElementById('loginPass').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

// ===== TABS =====
document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = item.dataset.tab;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById('pageTitle').textContent = item.textContent.trim().replace(/\d/g, '').trim();
    if (tab === 'enquiries') loadEnquiries();
    if (tab === 'projects') loadProjectsAdmin();
    if (tab === 'services') loadServicesAdmin();
    if (tab === 'reviews') loadReviews();
  });
});

// ===== INIT =====
function initAdmin() {
  seedEnquiries();
  loadDashboard();
}

// ===== DASHBOARD =====
function loadDashboard() {
  const enquiries = DB.getEnquiries();
  const projects = DB.getProjects();
  const services = DB.getServices();
  const pending = enquiries.filter(e => e.status === 'new').length;

  document.getElementById('statEnquiries').textContent = enquiries.length;
  document.getElementById('statProjects').textContent = projects.length;
  document.getElementById('statServices').textContent = services.length;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('enquiryBadge').textContent = pending;
  const reviews = JSON.parse(localStorage.getItem('bc_reviews') || '[]');
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  document.getElementById('reviewBadge').textContent = pendingReviews;

  const tbody = document.getElementById('recentBody');
  const recent = [...enquiries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  tbody.innerHTML = recent.map(e => `
    <tr>
      <td>${e.name}</td>
      <td>${e.service}</td>
      <td>${e.phone}</td>
      <td>${formatDate(e.date)}</td>
      <td><span class="status-badge ${e.status}">${e.status}</span></td>
    </tr>
  `).join('') || '<tr><td colspan="5" style="text-align:center;color:#555">No enquiries yet</td></tr>';
}

// ===== ENQUIRIES =====
function loadEnquiries() {
  const tbody = document.getElementById('enquiriesBody');
  const enquiries = DB.getEnquiries().sort((a, b) => new Date(b.date) - new Date(a.date));

  tbody.innerHTML = enquiries.map(e => `
    <tr>
      <td>${e.name}</td>
      <td>${e.email}</td>
      <td>${e.phone}</td>
      <td>${e.service}</td>
      <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${e.message}">${e.message}</td>
      <td>${formatDate(e.date)}</td>
      <td>
        <select onchange="updateEnquiryStatus(${e.id}, this.value)" style="background:#1a1a1a;border:1px solid #333;color:#ccc;padding:4px 8px;border-radius:4px;font-size:0.8rem">
          <option value="new" ${e.status==='new'?'selected':''}>New</option>
          <option value="read" ${e.status==='read'?'selected':''}>Read</option>
          <option value="done" ${e.status==='done'?'selected':''}>Done</option>
        </select>
      </td>
      <td>
        <button class="btn-icon delete" onclick="deleteEnquiry(${e.id})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="8" style="text-align:center;color:#555;padding:32px">No enquiries yet</td></tr>';
}

function updateEnquiryStatus(id, status) {
  const list = DB.getEnquiries();
  const idx = list.findIndex(e => e.id === id);
  if (idx > -1) { list[idx].status = status; DB.saveEnquiries(list); }
  loadDashboard();
}

function deleteEnquiry(id) {
  if (!confirm('Delete this enquiry?')) return;
  DB.saveEnquiries(DB.getEnquiries().filter(e => e.id !== id));
  loadEnquiries(); loadDashboard();
}

function clearEnquiries() {
  if (!confirm('Clear ALL enquiries? This cannot be undone.')) return;
  DB.saveEnquiries([]);
  loadEnquiries(); loadDashboard();
}

// ===== PROJECTS ADMIN =====
function loadProjectsAdmin() {
  const grid = document.getElementById('projectsAdmin');
  const projects = DB.getProjects();
  grid.innerHTML = projects.map(p => `
    <div class="admin-card">
      <img class="admin-card-img" src="${p.image}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'"/>
      <div class="admin-card-body">
        <span class="card-tag">${p.category}</span>
        <h4>${p.title}</h4>
        <p>${p.location || ''}</p>
        <div class="card-actions">
          <button class="btn-icon" onclick="editProject(${p.id})"><i class="fas fa-edit"></i></button>
          <button class="btn-icon delete" onclick="deleteProject(${p.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('') || '<p style="color:#555">No projects yet. Add one!</p>';
}

function openProjectModal(id = null) {
  document.getElementById('projectModal').classList.add('open');
  document.getElementById('projectModalTitle').textContent = id ? 'Edit Project' : 'Add Project';
  if (id) {
    const p = DB.getProjects().find(x => x.id === id);
    document.getElementById('projectId').value = p.id;
    document.getElementById('projectTitle').value = p.title;
    document.getElementById('projectCategory').value = p.category;
    document.getElementById('projectLocation').value = p.location || '';
    document.getElementById('projectImage').value = p.image;
    document.getElementById('projectDesc').value = p.description || '';
  } else {
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
  }
}

function editProject(id) { openProjectModal(id); }

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  DB.saveProjects(DB.getProjects().filter(p => p.id !== id));
  loadProjectsAdmin();
}

document.getElementById('projectForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('projectId').value;
  const project = {
    id: id ? +id : Date.now(),
    title: document.getElementById('projectTitle').value,
    category: document.getElementById('projectCategory').value,
    location: document.getElementById('projectLocation').value,
    image: document.getElementById('projectImage').value,
    description: document.getElementById('projectDesc').value,
  };
  const list = DB.getProjects();
  if (id) {
    const idx = list.findIndex(p => p.id === +id);
    if (idx > -1) list[idx] = project;
  } else {
    list.push(project);
  }
  DB.saveProjects(list);
  closeModal('projectModal');
  loadProjectsAdmin();
});

// ===== SERVICES ADMIN =====
function loadServicesAdmin() {
  const grid = document.getElementById('servicesAdmin');
  const services = DB.getServices();
  grid.innerHTML = services.map(s => `
    <div class="admin-card">
      <div class="admin-card-body">
        <div style="font-size:2rem;color:#e87722;margin-bottom:12px"><i class="${s.icon}"></i></div>
        <h4>${s.title}</h4>
        <p style="margin-top:8px">${s.description}</p>
        <div class="card-actions" style="margin-top:12px">
          <button class="btn-icon" onclick="editService(${s.id})"><i class="fas fa-edit"></i></button>
          <button class="btn-icon delete" onclick="deleteService(${s.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('') || '<p style="color:#555">No services yet. Add one!</p>';
}

function openServiceModal(id = null) {
  document.getElementById('serviceModal').classList.add('open');
  document.getElementById('serviceModalTitle').textContent = id ? 'Edit Service' : 'Add Service';
  if (id) {
    const s = DB.getServices().find(x => x.id === id);
    document.getElementById('serviceId').value = s.id;
    document.getElementById('serviceTitle').value = s.title;
    document.getElementById('serviceIcon').value = s.icon;
    document.getElementById('serviceDesc').value = s.description;
  } else {
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
  }
}

function editService(id) { openServiceModal(id); }

function deleteService(id) {
  if (!confirm('Delete this service?')) return;
  DB.saveServices(DB.getServices().filter(s => s.id !== id));
  loadServicesAdmin();
}

document.getElementById('serviceForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('serviceId').value;
  const service = {
    id: id ? +id : Date.now(),
    title: document.getElementById('serviceTitle').value,
    icon: document.getElementById('serviceIcon').value,
    description: document.getElementById('serviceDesc').value,
  };
  const list = DB.getServices();
  if (id) {
    const idx = list.findIndex(s => s.id === +id);
    if (idx > -1) list[idx] = service;
  } else {
    list.push(service);
  }
  DB.saveServices(list);
  closeModal('serviceModal');
  loadServicesAdmin();
});

// ===== MODAL =====
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ===== UTILS =====
function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ===== REVIEWS =====
function loadReviews() {
  const reviews = JSON.parse(localStorage.getItem('bc_reviews') || '[]');
  const pending = reviews.filter(r => r.status === 'pending').length;
  document.getElementById('reviewBadge').textContent = pending;

  document.getElementById('reviewsBody').innerHTML = reviews.length ? reviews.map(r => `
    <tr>
      <td>${r.name}</td>
      <td>${r.role}</td>
      <td style="max-width:200px">${r.text}</td>
      <td style="color:#e87722">${'★'.repeat(r.rating)}</td>
      <td>${new Date(r.date).toLocaleDateString('en-IN')}</td>
      <td><span class="status-badge ${r.status === 'approved' ? 'done' : r.status === 'rejected' ? 'read' : 'new'}">${r.status}</span></td>
      <td style="display:flex;gap:8px">
        <button class="btn-icon" style="color:#4caf50;border-color:#4caf50" onclick="approveReview(${r.id})" title="Approve"><i class="fas fa-check"></i></button>
        <button class="btn-icon delete" onclick="deleteReview(${r.id})" title="Delete"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="7" style="text-align:center;color:#555;padding:32px">No reviews yet</td></tr>';
}

function approveReview(id) {
  const reviews = JSON.parse(localStorage.getItem('bc_reviews') || '[]');
  const idx = reviews.findIndex(r => r.id === id);
  if (idx > -1) {
    reviews[idx].status = reviews[idx].status === 'approved' ? 'pending' : 'approved';
    localStorage.setItem('bc_reviews', JSON.stringify(reviews));
  }
  loadReviews();
}

function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  const reviews = JSON.parse(localStorage.getItem('bc_reviews') || '[]').filter(r => r.id !== id);
  localStorage.setItem('bc_reviews', JSON.stringify(reviews));
  loadReviews();
}