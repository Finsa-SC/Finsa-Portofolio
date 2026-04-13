// =====================================================================
// TYPING ANIMATION
// =====================================================================
const roles = [
    'Offensive Security Learner',
    'Penetration Tester (in training)',
    'CTF Player & Bug Hunter',
    'Red Team Enthusiast'
];

let roleIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

function typeRole() {
    const el = document.getElementById('role-text');
    if (!el) return;
    const current = roles[roleIndex];

    if (!isDeleting) {
        el.textContent = current.substring(0, charIndex);
        charIndex++;
        if (charIndex > current.length) { isDeleting = true; typingSpeed = 2200; }
        else typingSpeed = 100;
    } else {
        el.textContent = current.substring(0, charIndex);
        charIndex--;
        typingSpeed = 45;
        if (charIndex < 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; charIndex = 0; typingSpeed = 400; }
    }
    setTimeout(typeRole, typingSpeed);
}

// =====================================================================
// NAVBAR
// =====================================================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navLinksContainer = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('section[id]');
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinksEl.classList.toggle('open');
        });
    }

    // Close nav on link click (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinksEl.classList.remove('open');
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Highlight pill (desktop only)
    const highlight = document.createElement('div');
    highlight.className = 'nav-highlight';
    navLinksContainer.appendChild(highlight);

    function updateHighlight(link) {
        if (!link || window.innerWidth <= 768) return;
        const lr = link.getBoundingClientRect();
        const cr = navLinksContainer.getBoundingClientRect();
        highlight.style.left = (lr.left - cr.left) + 'px';
        highlight.style.width = lr.width + 'px';
        highlight.style.opacity = '1';
    }

    function onScroll() {
        const scrollPos = window.scrollY + 110;
        let current = null;
        sections.forEach(s => {
            if (scrollPos >= s.offsetTop) current = s;
        });
        navLinks.forEach(l => { l.classList.remove('active', 'active-partial'); });
        if (current) {
            const active = document.querySelector(`.nav-links a[href="#${current.id}"]`);
            if (active) { active.classList.add('active'); updateHighlight(active); }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// =====================================================================
// LOGO O BOUNCE
// =====================================================================
function initLogoBounce() {
    const logo = document.querySelector('.logo');
    if (!logo) return;
    const text = logo.textContent.trim();
    const last = text.slice(-1);
    const base = text.slice(0, -1);
    logo.innerHTML = `${base}<span class="o-bounce">${last}</span>`;
    const o = logo.querySelector('.o-bounce');
    let bouncing = false;

    logo.addEventListener('click', () => {
        if (bouncing) return;
        bouncing = true;
        let x = 0, y = 0, vx = 2.8, vy = 0;
        const gravity = 0.65, damping = 0.5, floor = 18;
        let rolling = false;
        const maxRight = window.innerWidth + 80;

        function animate() {
            if (!rolling) {
                vy += gravity; y += vy;
                if (y > floor) { y = floor; vy *= -damping; if (Math.abs(vy) < 1) { rolling = true; vy = 0; } }
            }
            x += vx;
            if (x > maxRight) { respawn(); return; }
            o.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(animate);
        }

        function respawn() {
            let rx = -120, ry = 14;
            function roll() {
                rx += 2.5;
                o.style.transition = 'none';
                o.style.transform = `translate(${rx}px, ${ry}px)`;
                if (rx >= 0) { jump(); return; }
                requestAnimationFrame(roll);
            }
            function jump() {
                o.style.transition = 'transform 0.4s cubic-bezier(.34,1.56,.64,1)';
                o.style.transform = `translate(0, -50px)`;
                setTimeout(() => {
                    o.style.transform = 'translate(0, 0)';
                    setTimeout(() => { bouncing = false; }, 350);
                }, 280);
            }
            roll();
        }
        animate();
    });
}

// =====================================================================
// FLOATING ICONS
// =====================================================================
function initFloatingIcons() {
    const icons = document.querySelectorAll('.lang-icon');
    const photo = document.querySelector('.profile-photo');
    if (!photo || !icons.length) return;

    let mouseInside = false;

    photo.addEventListener('mouseenter', () => {
        mouseInside = true;
        const ripple = document.createElement('span');
        ripple.className = 'ripple-wave';
        const r = photo.getBoundingClientRect();
        ripple.style.cssText = `left:${r.left + r.width/2}px;top:${r.top + r.height/2}px;width:200px;height:200px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    });
    photo.addEventListener('mouseleave', () => mouseInside = false);

    function getCenter() {
        const r = photo.getBoundingClientRect();
        return { cx: r.left + r.width/2, cy: r.top + r.height/2, rad: r.width/2 + 28 };
    }

    function inZone(x, y) {
        const c = getCenter();
        return Math.hypot(x - c.cx, y - c.cy) < c.rad;
    }

    function shieldLoop() {
        if (mouseInside) {
            icons.forEach(icon => {
                const r = icon.getBoundingClientRect();
                const x = r.left + r.width/2, y = r.top + r.height/2;
                if (inZone(x, y)) {
                    const c = getCenter();
                    const angle = Math.atan2(y - c.cy, x - c.cx);
                    const safe = { x: c.cx + Math.cos(angle) * (c.rad + 80), y: c.cy + Math.sin(angle) * (c.rad + 80) };
                    const cont = icon.parentElement.getBoundingClientRect();
                    icon.classList.add('icon-damage');
                    setTimeout(() => icon.classList.remove('icon-damage'), 200);
                    icon.style.transition = '200ms linear';
                    icon.style.top = ((safe.y - cont.top) / cont.height * 100) + '%';
                    icon.style.left = ((safe.x - cont.left) / cont.width * 100) + '%';
                }
            });
        }
        requestAnimationFrame(shieldLoop);
    }
    shieldLoop();

    icons.forEach((icon, i) => {
        function move() {
            let top, left, tries = 0;
            do {
                top = Math.random() * 78 + 11;
                left = Math.random() * 78 + 11;
                const cont = icon.parentElement.getBoundingClientRect();
                const ax = cont.left + (left/100) * cont.width;
                const ay = cont.top + (top/100) * cont.height;
                if (!inZone(ax, ay)) break;
            } while (++tries < 20);
            const dur = 3200 + Math.random() * 2200;
            icon.style.transition = `${dur}ms ease-in-out`;
            icon.style.top = top + '%';
            icon.style.left = left + '%';
            setTimeout(move, dur);
        }
        setTimeout(move, i * 500);
    });
}

// =====================================================================
// SCROLL ANIMATIONS (IntersectionObserver)
// =====================================================================
function initScrollAnimations() {
    // About
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                const add = e.isIntersecting;
                aboutSection.querySelector('.section-title')?.classList.toggle('animate', add);
                aboutSection.querySelector('.about-photo')?.classList.toggle('animate', add);
                aboutSection.querySelectorAll('.info-card').forEach(c => c.classList.toggle('animate', add));
                aboutSection.querySelectorAll('.info-item').forEach(c => c.classList.toggle('animate', add));
            });
        }, { threshold: 0.15 });
        obs.observe(aboutSection);
    }

    // Skills
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const skillCards = document.querySelectorAll('.skill-card');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    skillCards.forEach((card, i) => {
                        clearTimeout(card._exitTimer);
                        card.classList.remove('exiting');
                        setTimeout(() => card.classList.add('animate'), 120 + i * 90);
                    });
                } else {
                    skillCards.forEach(card => {
                        card.classList.add('exiting');
                        card._exitTimer = setTimeout(() => {
                            card.classList.remove('animate', 'exiting');
                        }, 380);
                    });
                }
            });
        }, { threshold: 0.12, rootMargin: '-30px' });
        obs.observe(skillsSection);
    }

    // Portfolio
    const portfolioSection = document.querySelector('.portfolio-section');
    if (portfolioSection) {
        let visible = false, exitTimer = null;

        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting && !visible) {
                    visible = true;
                    clearTimeout(exitTimer);
                    portfolioSection.querySelector('.section-title')?.classList.add('animate');
                    portfolioSection.querySelector('.tab-navigation')?.classList.add('animate');
                    setTimeout(() => animateActiveTab(), 250);
                } else if (!e.isIntersecting && visible) {
                    visible = false;
                    const all = portfolioSection.querySelectorAll('.project-card, .certificate-card, .timeline-item');
                    all.forEach(c => c.classList.add('exiting'));
                    exitTimer = setTimeout(() => {
                        all.forEach(c => c.classList.remove('animate', 'exiting'));
                        portfolioSection.querySelector('.section-title')?.classList.remove('animate');
                        portfolioSection.querySelector('.tab-navigation')?.classList.remove('animate');
                    }, 350);
                }
            });
        }, { threshold: 0.06 });
        obs.observe(portfolioSection);
    }

    // Contact
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    contactSection.querySelector('.contact-title')?.classList.add('animate');
                    contactSection.querySelectorAll('.contact-info-card').forEach(c => c.classList.add('animate'));
                    contactSection.querySelector('.contact-form-wrapper')?.classList.add('animate');
                    const badge = contactSection.querySelector('.availability-badge');
                    if (badge) badge.style.opacity = '1';
                }
            });
        }, { threshold: 0.1 });
        obs.observe(contactSection);
    }
}

// =====================================================================
// MARQUEE scroll parallax
// =====================================================================
function initMarquee() {
    const tops = document.querySelectorAll('.marquee-top');
    const bots = document.querySelectorAll('.marquee-bottom');
    window.addEventListener('scroll', () => {
        const s = window.scrollY;
        tops.forEach(t => t.style.transform = `translateX(${s * -0.2}px)`);
        bots.forEach(b => b.style.transform = `translateX(${s * 0.2}px)`);
    }, { passive: true });
}

// =====================================================================
// TABS
// =====================================================================
function animateActiveTab() {
    const activePane = document.querySelector('.tab-pane.active');
    if (!activePane) return;
    const cards = activePane.querySelectorAll('.project-card, .certificate-card, .timeline-item');
    cards.forEach(c => { c.classList.remove('animate', 'exiting'); });
    void activePane.offsetWidth;
    setTimeout(() => cards.forEach(c => c.classList.add('animate')), 40);
}

function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const pane = document.getElementById(btn.dataset.tab);
            if (pane) pane.classList.add('active');
            setTimeout(animateActiveTab, 50);
        });
    });
}

// =====================================================================
// CERTIFICATE MODAL
// =====================================================================
function initCertModal() {
    const certData = [
        { name: 'LKS IT Software Solutions (District Level)', issuer: 'Department of Education of Karanganyar', date: 'February 2025', image: 'assets/CRF1.jpg' },
        { name: 'Certificate 2', issuer: 'Organization', date: '2024', image: '' },
        { name: 'Certificate 3', issuer: 'Organization', date: '2024', image: '' },
        { name: 'Certificate 4', issuer: 'Organization', date: '2024', image: '' }
    ];

    const modal = document.getElementById('certificateModal');
    if (!modal) return;

    document.querySelectorAll('.certificate-card').forEach((card, i) => {
        card.addEventListener('click', () => {
            const d = certData[i] || certData[0];
            document.getElementById('modalCertName').textContent = d.name;
            document.getElementById('modalCertIssuer').textContent = 'Issued by: ' + d.issuer;
            document.getElementById('modalCertDate').textContent = 'Date: ' + d.date;
            document.getElementById('modalCertImage').src = d.image || 'assets/fairy_icon.png';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function close() { modal.classList.remove('active'); document.body.style.overflow = ''; }
    document.querySelector('.modal-close')?.addEventListener('click', close);
    document.querySelector('.modal-overlay')?.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// =====================================================================
// SHOW MORE CERTS
// =====================================================================
function initShowMore() {
    const btn = document.querySelector('.show-more-btn');
    const hidden = document.querySelectorAll('.hidden-cert');
    if (!btn) return;
    let expanded = false;

    btn.addEventListener('click', () => {
        if (!expanded) {
            hidden.forEach((c, i) => setTimeout(() => { c.classList.add('show', 'animate'); }, i * 80));
            btn.querySelector('span').textContent = 'Show Less';
            btn.querySelector('svg').style.transform = 'rotate(180deg)';
        } else {
            hidden.forEach(c => c.classList.remove('show', 'animate'));
            btn.querySelector('span').textContent = 'Show More';
            btn.querySelector('svg').style.transform = '';
        }
        expanded = !expanded;
    });
}

// =====================================================================
// CONTACT FORM — Formspree
// =====================================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = form.querySelector('.contact-submit-btn');
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        if (!name || !email || !message) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        btn.classList.add('sending');
        btn.querySelector('span').textContent = 'Sending...';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                form.reset();
                showToast('✅ Message sent! I\'ll get back to you soon.', 'success');
            } else {
                // Cek apakah form action masih placeholder
                if (form.action.includes('xyzabc123')) {
                    showToast('⚠️ Form belum dikonfigurasi. Ganti action di index.html dengan kode Formspree kamu.', 'error');
                } else {
                    showToast('❌ Something went wrong. Please email me directly.', 'error');
                }
            }
        } catch (err) {
            if (form.action.includes('xyzabc123')) {
                showToast('⚠️ Form belum dikonfigurasi. Daftar di formspree.io lalu ganti action-nya.', 'error');
            } else {
                showToast('❌ Network error. Please try again or email me directly.', 'error');
            }
        }

        btn.classList.remove('sending');
        btn.querySelector('span').textContent = 'Send Message';
    });
}

function showToast(msg, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 4000);
}

// =====================================================================
// INIT
// =====================================================================
window.addEventListener('load', () => {
    // Show navbar
    setTimeout(() => document.getElementById('navbar')?.classList.add('visible'), 80);

    // Hero entrance
    setTimeout(() => document.querySelector('.hero-left')?.classList.add('visible'), 250);
    setTimeout(() => document.querySelector('.hero-right')?.classList.add('visible'), 420);

    // Start typing
    setTimeout(typeRole, 900);

    // Start icon float
    setTimeout(initFloatingIcons, 1200);
});

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initLogoBounce();
    initScrollAnimations();
    initMarquee();
    initTabs();
    initCertModal();
    initShowMore();
    initContactForm();
});
