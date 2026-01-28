// ============================================
// ГЕОХРОМ: ТЕРРАЭНЕРГЕТИКА
// Interactive Book Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initFloatingCrystals();
    initNavigation();
    initChapters();
    initScrollEffects();
    initSidebar();
    initAmbience();
});

// ============================================
// FLOATING CRYSTALS
// ============================================

function initFloatingCrystals() {
    const container = document.getElementById('crystals');
    const colors = [
        ['#9b59b6', '#3498db'],
        ['#3498db', '#2ecc71'],
        ['#2ecc71', '#f39c12'],
        ['#e74c3c', '#9b59b6'],
        ['#f39c12', '#e74c3c']
    ];

    for (let i = 0; i < 15; i++) {
        const crystal = document.createElement('div');
        crystal.className = 'floating-crystal';

        const colorPair = colors[Math.floor(Math.random() * colors.length)];
        crystal.style.background = `linear-gradient(135deg, ${colorPair[0]} 0%, ${colorPair[1]} 100%)`;
        crystal.style.left = `${Math.random() * 100}%`;
        crystal.style.top = `${Math.random() * 100}%`;
        crystal.style.width = `${10 + Math.random() * 20}px`;
        crystal.style.height = `${20 + Math.random() * 40}px`;
        crystal.style.animationDelay = `${Math.random() * 20}s`;
        crystal.style.animationDuration = `${15 + Math.random() * 15}s`;

        container.appendChild(crystal);
    }
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navContent = document.getElementById('navContent');

    // Build navigation from book data
    bookData.parts.forEach((part, partIndex) => {
        const partDiv = document.createElement('div');
        partDiv.className = 'nav-part';

        const partTitle = document.createElement('div');
        partTitle.className = 'nav-part-title';
        partTitle.textContent = part.title;
        partDiv.appendChild(partTitle);

        part.chapters.forEach((chapter, chapterIndex) => {
            const link = document.createElement('a');
            link.className = 'nav-chapter';
            link.href = `#chapter-${partIndex}-${chapterIndex}`;
            link.textContent = chapter.title;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToChapter(partIndex, chapterIndex);
                closeSidebarOnMobile();
            });
            partDiv.appendChild(link);
        });

        navContent.appendChild(partDiv);
    });

    // Enter book button
    document.getElementById('enterBook').addEventListener('click', () => {
        scrollToChapter(0, 0);
    });
}

function scrollToChapter(partIndex, chapterIndex) {
    const chapterId = `chapter-${partIndex}-${chapterIndex}`;
    const element = document.getElementById(chapterId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateActiveNav() {
    const chapters = document.querySelectorAll('.chapter');
    const navLinks = document.querySelectorAll('.nav-chapter');
    const scrollPos = window.scrollY + window.innerHeight / 3;

    chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;

        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLinks[index]) {
                navLinks[index].classList.add('active');
            }
        }
    });
}

// ============================================
// CHAPTERS RENDERING
// ============================================

function initChapters() {
    const chaptersContainer = document.getElementById('chapters');
    let chapterCount = 0;

    bookData.parts.forEach((part, partIndex) => {
        part.chapters.forEach((chapter, chapterIndex) => {
            const chapterDiv = document.createElement('section');
            chapterDiv.className = 'chapter';
            chapterDiv.id = `chapter-${partIndex}-${chapterIndex}`;

            chapterDiv.innerHTML = `
                <header class="chapter-header fade-in">
                    <div class="chapter-number">${part.title}</div>
                    <h2 class="chapter-title">${chapter.title}</h2>
                    ${chapter.subtitle ? `<p class="chapter-subtitle">${chapter.subtitle}</p>` : ''}
                </header>
                <div class="chapter-content">
                    ${renderContent(chapter.content)}
                </div>
            `;

            chaptersContainer.appendChild(chapterDiv);
            chapterCount++;
        });
    });
}

function renderContent(content) {
    return content.map(block => {
        switch (block.type) {
            case 'heading':
                return `<h3 class="fade-in">${block.text}</h3>`;

            case 'paragraph':
                return `<p class="fade-in">${formatText(block.text)}</p>`;

            case 'quote':
                return `<blockquote class="fade-in">${formatText(block.text)}</blockquote>`;

            case 'list':
                const items = block.items.map(item => `<li>${formatText(item)}</li>`).join('');
                return `<ul class="fade-in">${items}</ul>`;

            case 'code':
                return `<pre class="fade-in"><code>${escapeHtml(block.text)}</code></pre>`;

            case 'crystal-block':
                return `<div class="crystal-block ${block.variant || ''} fade-in">${formatText(block.text)}</div>`;

            case 'meditation':
                return renderMeditation(block);

            case 'divider':
                return `<div class="title-divider fade-in" style="margin: 2rem auto;"></div>`;

            default:
                return '';
        }
    }).join('');
}

function renderMeditation(block) {
    let html = `<div class="meditation-section fade-in">`;

    if (block.title) {
        html += `<h3 style="text-align: center; margin-bottom: 2rem;">${block.title}</h3>`;
    }

    if (block.steps) {
        block.steps.forEach((step, index) => {
            html += `
                <div class="step">
                    <span class="step-number">${index + 1}</span>
                    <div>${formatText(step)}</div>
                </div>
            `;
        });
    }

    if (block.text) {
        html += `<div>${formatText(block.text)}</div>`;
    }

    html += `</div>`;
    return html;
}

function formatText(text) {
    if (!text) return '';

    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Line breaks
    text = text.replace(/\n/g, '<br>');

    return text;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// SCROLL EFFECTS
// ============================================

function initScrollEffects() {
    const progressBar = document.getElementById('progressBar');
    const depthFill = document.getElementById('depthFill');
    const depthValue = document.getElementById('depthValue');
    const backToTop = document.getElementById('backToTop');

    // Intersection Observer for fade-in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Scroll event
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        // Progress bar
        progressBar.style.width = `${scrollPercent}%`;

        // Depth indicator (0-6371 km to Earth's center)
        const depth = Math.round((scrollPercent / 100) * 6371);
        depthFill.style.width = `${scrollPercent}%`;
        depthValue.textContent = `${depth.toLocaleString()} км`;

        // Back to top button
        if (scrollTop > window.innerHeight) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Update active nav
        updateActiveNav();
    });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// SIDEBAR
// ============================================

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('open');
    });

    // Close on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

function closeSidebarOnMobile() {
    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

// ============================================
// AMBIENCE
// ============================================

function initAmbience() {
    const toggle = document.getElementById('ambienceToggle');
    let audioContext = null;
    let isPlaying = false;
    let oscillators = [];
    let gainNode = null;

    toggle.addEventListener('click', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.gain.value = 0.1;
            gainNode.connect(audioContext.destination);
        }

        if (isPlaying) {
            stopAmbience();
        } else {
            playAmbience();
        }
    });

    function playAmbience() {
        isPlaying = true;
        toggle.classList.add('active');

        // Deep earth rumble
        const frequencies = [40, 60, 80, 120, 7.83]; // Last is Schumann resonance

        frequencies.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const oscGain = audioContext.createGain();

            osc.type = i === 4 ? 'sine' : 'sine';
            osc.frequency.value = freq;
            oscGain.gain.value = i === 4 ? 0.05 : 0.02;

            // Slight modulation
            const lfo = audioContext.createOscillator();
            const lfoGain = audioContext.createGain();
            lfo.frequency.value = 0.1 + Math.random() * 0.2;
            lfoGain.gain.value = freq * 0.01;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();

            osc.connect(oscGain);
            oscGain.connect(gainNode);
            osc.start();

            oscillators.push({ osc, lfo, oscGain });
        });
    }

    function stopAmbience() {
        isPlaying = false;
        toggle.classList.remove('active');

        oscillators.forEach(({ osc, lfo, oscGain }) => {
            oscGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
            setTimeout(() => {
                osc.stop();
                lfo.stop();
            }, 1000);
        });

        oscillators = [];
    }
}

// ============================================
// PARALLAX CRYSTALS (optional enhancement)
// ============================================

document.addEventListener('mousemove', (e) => {
    const crystals = document.querySelectorAll('.floating-crystal');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    crystals.forEach((crystal, i) => {
        const speed = (i % 3 + 1) * 0.5;
        const offsetX = (x - 0.5) * speed * 30;
        const offsetY = (y - 0.5) * speed * 30;
        crystal.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
});
