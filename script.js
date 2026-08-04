// ============================================================
// 1. DỮ LIỆU MẶC ĐỊNH (tập trung tại đây)
// ============================================================
const defaultData = {
  name: 'Nguyễn Văn A',
  bio: '✨ Developer & Creator',
  birth: '01/01/2000',
  job: 'Lập trình viên',
  hobbies: 'Đọc sách, du lịch, chụp ảnh',
  skills: 'HTML, CSS, JavaScript, React, Node.js',
  about: 'Tôi là một lập trình viên đam mê công nghệ, yêu thích xây dựng những sản phẩm đẹp và hữu ích. Luôn học hỏi và khám phá những điều mới mẻ.',
  avatar: 'assets/avatar-default.jpg',
  cover: 'assets/cover-default.jpg',
  social: [
    { platform: 'facebook', url: 'https://facebook.com/username' },
    { platform: 'zalo', url: 'https://zalo.me/username' },
    { platform: 'tiktok', url: 'https://tiktok.com/@username' },
    { platform: 'instagram', url: 'https://instagram.com/username' },
    { platform: 'youtube', url: 'https://youtube.com/@username' },
    { platform: 'github', url: 'https://github.com/username' },
    { platform: 'email', url: 'mailto:your@email.com' }
  ],
  projects: [
    { name: 'Portfolio Website', desc: 'Trang profile cá nhân hiện đại', url: '#' },
    { name: 'Project 2', desc: 'Ứng dụng quản lý công việc', url: '#' }
  ]
};

// ============================================================
// 2. QUẢN LÝ DỮ LIỆU VỚI LOCALSTORAGE
// ============================================================
function loadData() {
  const stored = localStorage.getItem('profileData');
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fallback */ }
  }
  // Lưu mặc định nếu chưa có
  localStorage.setItem('profileData', JSON.stringify(defaultData));
  return { ...defaultData };
}

function saveData(data) {
  localStorage.setItem('profileData', JSON.stringify(data));
}

// ============================================================
// 3. RENDER GIAO DIỆN TỪ DỮ LIỆU
// ============================================================
function renderProfile(data) {
  // Các trường cơ bản
  document.getElementById('displayName').textContent = data.name;
  document.getElementById('displayBio').textContent = data.bio;
  document.getElementById('infoName').textContent = data.name;
  document.getElementById('infoBirth').textContent = data.birth;
  document.getElementById('infoJob').textContent = data.job;
  document.getElementById('infoHobbies').textContent = data.hobbies;
  document.getElementById('infoSkills').textContent = data.skills;
  document.getElementById('aboutText').textContent = data.about;
  document.getElementById('avatarImg').src = data.avatar || defaultData.avatar;
  document.getElementById('coverImg').src = data.cover || defaultData.cover;

  // Social icons
  const socialContainer = document.getElementById('socialLinks');
  socialContainer.innerHTML = '';
  const iconMap = {
    facebook: 'fab fa-facebook-f',
    zalo: 'fas fa-comment-dots', // Zalo không có icon chuẩn, dùng tạm
    tiktok: 'fab fa-tiktok',
    instagram: 'fab fa-instagram',
    youtube: 'fab fa-youtube',
    github: 'fab fa-github',
    email: 'fas fa-envelope'
  };
  data.social.forEach(item => {
    const a = document.createElement('a');
    a.href = item.url;
    a.target = '_blank';
    const iconClass = iconMap[item.platform.toLowerCase()] || 'fas fa-link';
    a.innerHTML = `<i class="${iconClass}"></i>`;
    a.title = item.platform;
    socialContainer.appendChild(a);
  });

  // Projects
  const projectContainer = document.getElementById('projectList');
  projectContainer.innerHTML = '';
  data.projects.forEach(p => {
    const div = document.createElement('div');
    div.className = 'project-card';
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.desc || ''}</p>
      ${p.url && p.url !== '#' ? `<a href="${p.url}" target="_blank">Xem chi tiết →</a>` : ''}
    `;
    projectContainer.appendChild(div);
  });
}

// ============================================================
// 4. KHỞI TẠO VÀ LẮNG NGHE SỰ KIỆN
// ============================================================
let currentData = loadData();
renderProfile(currentData);

// Lắng nghe form liên hệ (demo)
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('✅ Cảm ơn bạn! Tin nhắn đã được gửi (demo).');
  this.reset();
});

// ============================================================
// 5. DARK MODE
// ============================================================
function toggleDark() {
  document.body.classList.toggle('dark');
  const icon = document.querySelector('#darkToggle i');
  if (document.body.classList.contains('dark')) {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

// ============================================================
// 6. ADMIN PANEL (mở bằng hash #admin)
// ============================================================
function openAdmin() {
  document.getElementById('adminPanel').classList.add('active');
  // Nếu đã đăng nhập thì hiện content
  if (sessionStorage.getItem('adminLogged') === 'true') {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    populateAdminForm();
  } else {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminContent').style.display = 'none';
    document.getElementById('adminPass').value = '';
  }
}

function closeAdmin() {
  document.getElementById('adminPanel').classList.remove('active');
}

function loginAdmin() {
  const pass = document.getElementById('adminPass').value;
  if (pass === 'admin123') { // Đổi mật khẩu ở đây nếu muốn
    sessionStorage.setItem('adminLogged', 'true');
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    populateAdminForm();
    document.getElementById('adminMessage').textContent = '';
  } else {
    document.getElementById('adminMessage').textContent = '❌ Sai mật khẩu!';
    document.getElementById('adminMessage').style.color = '#dc2626';
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('adminLogged');
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('adminContent').style.display = 'none';
  document.getElementById('adminMessage').textContent = '';
  closeAdmin();
}

function populateAdminForm() {
  const data = loadData();
  document.getElementById('editName').value = data.name || '';
  document.getElementById('editBio').value = data.bio || '';
  document.getElementById('editBirth').value = data.birth || '';
  document.getElementById('editJob').value = data.job || '';
  document.getElementById('editHobbies').value = data.hobbies || '';
  document.getElementById('editSkills').value = data.skills || '';
  document.getElementById('editAbout').value = data.about || '';
  document.getElementById('editAvatar').value = data.avatar || '';
  document.getElementById('editCover').value = data.cover || '';

  // Social & Projects dạng textarea (mỗi dòng)
  const socialStr = data.social.map(s => `${s.platform}|${s.url}`).join('\n');
  document.getElementById('editSocial').value = socialStr;

  const projectStr = data.projects.map(p => `${p.name}|${p.desc || ''}|${p.url || ''}`).join('\n');
  document.getElementById('editProjects').value = projectStr;
}

// Lưu thay đổi từ form admin
document.getElementById('adminForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const data = loadData(); // lấy dữ liệu hiện tại

  // Cập nhật các trường đơn
  data.name = document.getElementById('editName').value.trim() || data.name;
  data.bio = document.getElementById('editBio').value.trim() || data.bio;
  data.birth = document.getElementById('editBirth').value.trim() || data.birth;
  data.job = document.getElementById('editJob').value.trim() || data.job;
  data.hobbies = document.getElementById('editHobbies').value.trim() || data.hobbies;
  data.skills = document.getElementById('editSkills').value.trim() || data.skills;
  data.about = document.getElementById('editAbout').value.trim() || data.about;
  data.avatar = document.getElementById('editAvatar').value.trim() || data.avatar;
  data.cover = document.getElementById('editCover').value.trim() || data.cover;

  // Xử lý social
  const socialRaw = document.getElementById('editSocial').value.split('\n').filter(line => line.trim());
  data.social = socialRaw.map(line => {
    const parts = line.split('|').map(s => s.trim());
    return { platform: parts[0] || 'link', url: parts[1] || '#' };
  });

  // Xử lý projects
  const projectRaw = document.getElementById('editProjects').value.split('\n').filter(line => line.trim());
  data.projects = projectRaw.map(line => {
    const parts = line.split('|').map(s => s.trim());
    return { name: parts[0] || 'Dự án', desc: parts[1] || '', url: parts[2] || '#' };
  });

  saveData(data);
  currentData = data;
  renderProfile(data);
  document.getElementById('adminMessage').textContent = '✅ Đã lưu thay đổi!';
  document.getElementById('adminMessage').style.color = '#16a34a';
});

// Reset về mặc định
function resetData() {
  if (confirm('Bạn có chắc muốn khôi phục dữ liệu mặc định?')) {
    localStorage.setItem('profileData', JSON.stringify(defaultData));
    currentData = { ...defaultData };
    renderProfile(currentData);
    populateAdminForm();
    document.getElementById('adminMessage').textContent = '🔄 Đã khôi phục mặc định';
    document.getElementById('adminMessage').style.color = '#f59e0b';
  }
}

// ============================================================
// 7. KIỂM TRA HASH URL ĐỂ MỞ ADMIN TỰ ĐỘNG
// ============================================================
window.addEventListener('hashchange', function() {
  if (window.location.hash === '#admin') {
    openAdmin();
  } else {
    closeAdmin();
  }
});
if (window.location.hash === '#admin') {
  openAdmin();
}

// Click ra ngoài panel để đóng (tùy chọn)
document.getElementById('adminPanel').addEventListener('click', function(e) {
  if (e.target === this) {
    closeAdmin();
    window.location.hash = '';
  }
});

// ============================================================
// 8. ĐÓNG ADMIN KHI NHẤN ESC
// ============================================================
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('adminPanel').classList.contains('active')) {
    closeAdmin();
    window.location.hash = '';
  }
});

console.log('✅ Profile ready! Thay đổi dữ liệu trong mục "defaultData" hoặc qua Admin.');