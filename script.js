
let config = null;
let audio = null;
let currentTrack = 0;
let isPlaying = false;
let playlist = [];

// ====== Hàm tải config ======
async function loadConfig() {
    try {
        const res = await fetch('config.json');
        if (!res.ok) throw new Error('Không tải được config');
        return await res.json();
    } catch (e) {
        console.warn('Lỗi config, dùng mặc định:', e);
        // Fallback
        return {
            profile: { name: 'Bạn', bio: 'Chào bạn', avatar: '', status: '🌸 Online' },
            theme: { primaryColor: '#FFB4E6', secondaryColor: '#B4E6FF', font: 'Quicksand', background: '' },
            navigation: [
                { name: 'Home', url: 'index.html', icon: 'home' },
                { name: 'About Me', url: 'about.html', icon: 'heart' },
                { name: 'Music', url: 'music.html', icon: 'music' },
                { name: 'Links', url: 'links.html', icon: 'link' }
            ],
            links: { 'Mạng xã hội': [], 'Công việc': [] },
            about: { intro: 'Chưa có giới thiệu', hobbies: [], timeline: [] },
            music: { enablePlayer: true, playlist: [] }
        };
    }
}

// ====== Áp dụng theme ======
function applyTheme(theme) {
    document.documentElement.style.setProperty('--primary', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary', theme.secondaryColor);
    document.documentElement.style.setProperty('--font', theme.font || 'Quicksand');
    document.body.style.fontFamily = theme.font || 'Quicksand';

    // Background
    if (theme.background && theme.background.trim() !== '') {
        document.body.style.setProperty('--bg-image', `url(${theme.background})`);
        document.body.classList.add('bg-image');
    } else {
        document.body.classList.remove('bg-image');
        document.body.style.background = `linear-gradient(135deg, ${theme.primaryColor}55, ${theme.secondaryColor}55)`;
    }
}

// ====== Dark mode (toggle) ======
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    updateDarkIcon();
}
function initDarkMode() {
    const saved = localStorage.getItem('darkMode') === 'true';
    if (saved) document.body.classList.add('dark');
    updateDarkIcon();
}
function updateDarkIcon() {
    const btn = document.getElementById('darkToggle');
    if (!btn) return;
    const isDark = document.body.classList.contains('dark');
    btn.innerHTML = isDark ? `<i data-lucide="sun"></i>` : `<i data-lucide="moon"></i>`;
    lucide.createIcons();
}

// ====== Render Navigation ======
function renderNav() {
    const nav = document.createElement('nav');
    nav.className = 'navbar bg-white/30 backdrop-blur-md shadow-sm px-4 py-2 sticky top-0 z-50 border-b border-white/30';
    nav.id = 'mainNav';

    const container = document.createElement('div');
    container.className = 'flex-1 flex items-center justify-between max-w-4xl mx-auto';

    // Logo / tên
    const brand = document.createElement('a');
    brand.href = 'index.html';
    brand.className = 'text-xl font-bold text-pink-400 flex items-center gap-1';
    brand.innerHTML = `🌸 ${config.profile.name || 'Me'}`;

    // Menu links
    const menu = document.createElement('div');
    menu.className = 'flex items-center gap-3';

    config.navigation.forEach(item => {
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition hover:bg-white/30';
        if (window.location.pathname.includes(item.url.replace('./', ''))) {
            a.classList.add('bg-white/40', 'text-pink-500');
        }
        a.innerHTML = `<i data-lucide="${item.icon}"></i> ${item.name}`;
        menu.appendChild(a);
    });

    // Dark mode toggle
    const darkBtn = document.createElement('button');
    darkBtn.id = 'darkToggle';
    darkBtn.className = 'btn btn-ghost btn-sm rounded-full';
    darkBtn.innerHTML = `<i data-lucide="moon"></i>`;
    darkBtn.addEventListener('click', toggleDarkMode);
    menu.appendChild(darkBtn);

    container.append(brand, menu);
    nav.appendChild(container);
    return nav;
}

// ====== Render trang chủ ======
async function renderIndex() {
    config = await loadConfig();
    const app = document.getElementById('app');
    applyTheme(config.theme);
    initDarkMode();

    // Navigation
    app.appendChild(renderNav());

    // Background mây & trái tim (tạo bằng JS)
    createBackgroundEffects(app);

    // Nội dung chính
    const main = document.createElement('div');
    main.className = 'flex-1 flex items-center justify-center p-6 relative z-10';

    const card = document.createElement('div');
    card.className = 'card w-full max-w-md bg-white/20 backdrop-blur-2xl shadow-2xl border border-white/30 p-8 text-center';

    // Avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar-glow mx-auto';
    const img = document.createElement('img');
    img.src = config.profile.avatar || 'assets/default-avatar.png';
    img.alt = 'Avatar';
    img.className = 'w-full h-full object-cover rounded-full';
    avatarDiv.appendChild(img);
    card.appendChild(avatarDiv);

    // Tên
    const name = document.createElement('h1');
    name.className = 'text-3xl font-bold mt-4 text-gray-800';
    name.textContent = config.profile.name;
    card.appendChild(name);

    // Bio
    const bio = document.createElement('p');
    bio.className = 'text-gray-600 mt-1';
    bio.textContent = config.profile.bio;
    card.appendChild(bio);

    // Status
    const status = document.createElement('p');
    status.className = 'text-sm text-pink-400 mt-1';
    status.textContent = config.profile.status || '🌸 Đang online';
    card.appendChild(status);

    // 3 nút chuyển trang (lấy từ navigation, bỏ trang chủ)
    const navBtns = config.navigation.filter(n => n.url !== 'index.html');
    const btnContainer = document.createElement('div');
    btnContainer.className = 'mt-6 grid grid-cols-3 gap-3';
    navBtns.forEach(item => {
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'nav-btn flex flex-col items-center justify-center gap-1 text-gray-700';
        a.innerHTML = `<i data-lucide="${item.icon}" class="w-6 h-6"></i><span class="text-sm">${item.name}</span>`;
        btnContainer.appendChild(a);
    });
    card.appendChild(btnContainer);

    main.appendChild(card);
    app.appendChild(main);

    lucide.createIcons();
}

// ====== Trang About ======
async function renderAbout() {
    config = await loadConfig();
    const app = document.getElementById('app');
    applyTheme(config.theme);
    initDarkMode();
    app.appendChild(renderNav());

    const main = document.createElement('div');
    main.className = 'flex-1 max-w-3xl mx-auto p-6 w-full';

    // Intro
    const introCard = document.createElement('div');
    introCard.className = 'card bg-white/20 backdrop-blur-2xl shadow-xl p-6 border border-white/30';
    const introTitle = document.createElement('h2');
    introTitle.className = 'text-2xl font-bold text-pink-400 flex items-center gap-2';
    introTitle.innerHTML = `<i data-lucide="heart"></i> Về tôi`;
    introCard.appendChild(introTitle);

    const introText = document.createElement('p');
    introText.className = 'mt-3 text-gray-700 leading-relaxed';
    introText.textContent = config.about.intro || 'Đừng nghĩ gì về tôi cả, tôi là một người bình thường với cây láp 50cm^3.';
    introCard.appendChild(introText);
    main.appendChild(introCard);

    // Sở thích
    const hobbyCard = document.createElement('div');
    hobbyCard.className = 'card bg-white/20 backdrop-blur-2xl shadow-xl p-6 border border-white/30 mt-6';
    const hobbyTitle = document.createElement('h2');
    hobbyTitle.className = 'text-2xl font-bold text-pink-400 flex items-center gap-2';
    hobbyTitle.innerHTML = `<i data-lucide="star"></i> Sở thích`;
    hobbyCard.appendChild(hobbyTitle);

    const hobbyContainer = document.createElement('div');
    hobbyContainer.className = 'flex flex-wrap gap-3 mt-3';
    (config.about.hobbies || []).forEach(hobby => {
        const tag = document.createElement('span');
        tag.className = 'hobby-tag';
        tag.textContent = hobby;
        hobbyContainer.appendChild(tag);
    });
    hobbyCard.appendChild(hobbyContainer);
    main.appendChild(hobbyCard);

    // Timeline
    const timelineCard = document.createElement('div');
    timelineCard.className = 'card bg-white/20 backdrop-blur-2xl shadow-xl p-6 border border-white/30 mt-6';
    const timelineTitle = document.createElement('h2');
    timelineTitle.className = 'text-2xl font-bold text-pink-400 flex items-center gap-2';
    timelineTitle.innerHTML = `<i data-lucide="clock"></i> Hành trình của tôi`;
    timelineCard.appendChild(timelineTitle);

    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'mt-4';
    (config.about.timeline || []).forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        const year = document.createElement('div');
        year.className = 'text-sm font-bold text-pink-400';
        year.textContent = item.year || '';
        const title = document.createElement('div');
        title.className = 'font-semibold text-gray-800';
        title.textContent = item.title || '';
        const desc = document.createElement('div');
        desc.className = 'text-sm text-gray-600';
        desc.textContent = item.desc || '';
        div.append(year, title, desc);
        timelineContainer.appendChild(div);
    });
    timelineCard.appendChild(timelineContainer);
    main.appendChild(timelineCard);

    app.appendChild(main);
    lucide.createIcons();
}

// ====== Trang Music ======
async function renderMusic() {
    config = await loadConfig();
    const app = document.getElementById('app');
    applyTheme(config.theme);
    initDarkMode();
    app.appendChild(renderNav());

    const main = document.createElement('div');
    main.className = 'flex-1 max-w-md mx-auto p-6 w-full';

    const card = document.createElement('div');
    card.className = 'card bg-white/20 backdrop-blur-2xl shadow-xl p-6 border border-white/30 text-center';

    if (!config.music.enablePlayer) {
        card.innerHTML = `<p class="text-gray-500">🎵 Chức năng nhạc đang tắt.</p>`;
        main.appendChild(card);
        app.appendChild(main);
        lucide.createIcons();
        return;
    }

    playlist = config.music.playlist || [];
    if (playlist.length === 0) {
        card.innerHTML = `<p class="text-gray-500">📭 Chưa có bài hát nào.</p>`;
        main.appendChild(card);
        app.appendChild(main);
        lucide.createIcons();
        return;
    }

    // Cover
    const coverImg = document.createElement('img');
    coverImg.id = 'musicCover';
    coverImg.className = 'w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg border-4 border-white/40';
    coverImg.src = playlist[0].cover || 'assets/default-cover.jpg';
    card.appendChild(coverImg);

    // Title
    const title = document.createElement('h3');
    title.id = 'musicTitle';
    title.className = 'text-xl font-bold mt-4 text-gray-800';
    title.textContent = playlist[0].title || 'Không tên';
    card.appendChild(title);

    // Controls
    const controls = document.createElement('div');
    controls.className = 'flex items-center justify-center gap-6 mt-4';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-ghost btn-circle';
    prevBtn.innerHTML = `<i data-lucide="skip-back"></i>`;
    prevBtn.addEventListener('click', prevTrack);

    const playBtn = document.createElement('button');
    playBtn.id = 'playBtn';
    playBtn.className = 'btn btn-circle bg-pink-400 text-white hover:bg-pink-500 border-0';
    playBtn.innerHTML = `<i data-lucide="play"></i>`;
    playBtn.addEventListener('click', togglePlay);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-ghost btn-circle';
    nextBtn.innerHTML = `<i data-lucide="skip-forward"></i>`;
    nextBtn.addEventListener('click', nextTrack);

    controls.append(prevBtn, playBtn, nextBtn);
    card.appendChild(controls);

    // Progress
    const progressContainer = document.createElement('div');
    progressContainer.className = 'mt-4 flex items-center gap-3';
    const currentTime = document.createElement('span');
    currentTime.id = 'currentTime';
    currentTime.className = 'text-sm text-gray-500';
    currentTime.textContent = '0:00';
    const progressBar = document.createElement('input');
    progressBar.type = 'range';
    progressBar.id = 'progressBar';
    progressBar.className = 'range range-primary range-xs flex-1';
    progressBar.min = 0;
    progressBar.max = 100;
    progressBar.value = 0;
    const duration = document.createElement('span');
    duration.id = 'duration';
    duration.className = 'text-sm text-gray-500';
    duration.textContent = '0:00';
    progressContainer.append(currentTime, progressBar, duration);
    card.appendChild(progressContainer);

    main.appendChild(card);
    app.appendChild(main);
    lucide.createIcons();

    // Khởi tạo audio
    audio = new Audio(playlist[0].file);
    audio.addEventListener('loadedmetadata', () => {
        duration.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = percent;
        currentTime.textContent = formatTime(audio.currentTime);
    });
    audio.addEventListener('ended', nextTrack);

    progressBar.addEventListener('input', () => {
        const seek = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seek;
    });
}

// ====== Hàm điều khiển nhạc ======
function togglePlay() {
    const playBtn = document.getElementById('playBtn');
    if (!audio) return;
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playBtn.innerHTML = `<i data-lucide="play"></i>`;
    } else {
        audio.play();
        isPlaying = true;
        playBtn.innerHTML = `<i data-lucide="pause"></i>`;
    }
    lucide.createIcons();
}

function nextTrack() {
    if (playlist.length === 0) return;
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
}

function prevTrack() {
    if (playlist.length === 0) return;
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
}

function loadTrack(index) {
    const track = playlist[index];
    if (!track) return;
    audio.src = track.file;
    audio.load();
    audio.play().catch(() => {});
    isPlaying = true;
    document.getElementById('playBtn').innerHTML = `<i data-lucide="pause"></i>`;
    document.getElementById('musicTitle').textContent = track.title || 'Không tên';
    document.getElementById('musicCover').src = track.cover || 'assets/default-cover.jpg';
    lucide.createIcons();
}

function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ====== Trang Links ======
async function renderLinks() {
    config = await loadConfig();
    const app = document.getElementById('app');
    applyTheme(config.theme);
    initDarkMode();
    app.appendChild(renderNav());

    const main = document.createElement('div');
    main.className = 'flex-1 max-w-2xl mx-auto p-6 w-full';

    const links = config.links || {};
    const categories = Object.keys(links);

    if (categories.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'card bg-white/20 backdrop-blur-2xl shadow-xl p-8 text-center text-gray-500';
        empty.textContent = '📭 Chưa có liên kết nào.';
        main.appendChild(empty);
        app.appendChild(main);
        lucide.createIcons();
        return;
    }

    categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'card bg-white/20 backdrop-blur-2xl shadow-xl p-6 border border-white/30 mt-6';
        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold text-pink-400 flex items-center gap-2';
        title.innerHTML = `<i data-lucide="link"></i> ${cat}`;
        card.appendChild(title);

        const list = document.createElement('div');
        list.className = 'mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3';
        (links[cat] || []).forEach(link => {
            const a = document.createElement('a');
            a.href = link.url || '#';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'flex items-center gap-3 p-3 rounded-2xl bg-white/30 hover:bg-white/50 transition border border-white/20 shadow-sm';
            a.innerHTML = `<i data-lucide="${link.icon || 'link'}" class="w-5 h-5 text-pink-400"></i><span>${link.name || 'Link'}</span>`;
            list.appendChild(a);
        });
        card.appendChild(list);
        main.appendChild(card);
    });

    app.appendChild(main);
    lucide.createIcons();
}

// ====== Tạo hiệu ứng nền (mây + tim rơi) ======
function createBackgroundEffects(parent) {
    // Mây
    const clouds = ['☁️', '☁️', '⛅', '🌤️'];
    for (let i = 0; i < 6; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.textContent = clouds[i % clouds.length];
        cloud.style.top = Math.random() * 80 + 10 + '%';
        cloud.style.animationDelay = (i * 3) + 's';
        cloud.style.animationDuration = (18 + Math.random() * 10) + 's';
        cloud.style.fontSize = (2 + Math.random() * 2.5) + 'rem';
        parent.appendChild(cloud);
    }

    // Trái tim rơi
    const hearts = [
    '✦', '✧', '⋆', '✩', '✪',
    '☾', '☽', '☁︎', '𓂃', '𓏲',
    '🪽', '𓆩♡𓆪', '♡', '♥︎',
    '❀', '✿', '❁', '𖤐',
    '☼', '☄️', '🌙', '⭐', '💫'
];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-rain';
        heart.textContent = hearts[i % hearts.length];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = (i * 0.8) + 's';
        heart.style.animationDuration = (6 + Math.random() * 6) + 's';
        heart.style.fontSize = (1 + Math.random() * 1.8) + 'rem';
        parent.appendChild(heart);
    }
}