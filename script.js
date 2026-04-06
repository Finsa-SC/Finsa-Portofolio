// Roles for typing animation - Offensive Security focused
const roles = [
    'Offensive Security Learner',
    'Penetration Tester (in training)',
    'CTF Player & Bug Hunter',
    'Red Team Enthusiast'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

// Enhanced Navbar with Scroll Tracking and Smooth Highlight
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    const navLinksContainer = document.querySelector('.nav-links');
    
    const highlight = document.createElement('div');
    highlight.className = 'nav-highlight';
    navLinksContainer.appendChild(highlight);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    function updateHighlight(activeLink) {
        if (!activeLink) return;
        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = navLinksContainer.getBoundingClientRect();
        highlight.style.left = `${linkRect.left - containerRect.left}px`;
        highlight.style.width = `${linkRect.width}px`;
        highlight.style.opacity = 1;
    }
    
    function onScroll() {
        const scrollPos = window.scrollY + 100;
        let currentSection = null;
        let nextSection = null;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section;
                if (index < sections.length - 1) nextSection = sections[index + 1];
            }
        });

        if (currentSection) {
            const sectionTop = currentSection.offsetTop;
            const sectionHeight = currentSection.offsetHeight;
            const sectionProgress = (scrollPos - sectionTop) / sectionHeight;
            const currentLink = document.querySelector(`.nav-links a[href="#${currentSection.id}"]`);
            const nextLink = nextSection ? document.querySelector(`.nav-links a[href="#${nextSection.id}"]`) : null;

            navLinks.forEach(l => { l.classList.remove('active'); l.classList.remove('active-partial'); });

            if (nextLink && sectionProgress > 0.7) {
                const transitionProgress = (sectionProgress - 0.7) / 0.3;
                const currentRect = currentLink.getBoundingClientRect();
                const nextRect = nextLink.getBoundingClientRect();
                const containerRect = navLinksContainer.getBoundingClientRect();
                const interpolatedLeft = (currentRect.left - containerRect.left) + (nextRect.left - currentRect.left) * transitionProgress;
                const interpolatedWidth = currentRect.width + (nextRect.width - currentRect.width) * transitionProgress;
                highlight.style.left = `${interpolatedLeft}px`;
                highlight.style.width = `${interpolatedWidth}px`;
                highlight.style.opacity = '1';
                currentLink.classList.add('active-partial');
                nextLink.classList.add('active-partial');
            } else {
                currentLink.classList.add('active');
                updateHighlight(currentLink);
            }
        }
    }
    
    window.addEventListener('scroll', onScroll);
    onScroll();
});

// o bouncing
document.addEventListener("DOMContentLoaded", () => {
    const logo = document.querySelector(".logo");
    const text = logo.textContent;
    const last = text.slice(-1);
    const base = text.slice(0, -1);

    logo.innerHTML = `${base}<span class="o-bounce">${last}</span>`;
    const o = logo.querySelector(".o-bounce");
    const baseWidth = getTextWidth(base, getComputedStyle(logo));
    o.style.left = baseWidth + "px";

    let bouncing = false;
    logo.addEventListener("click", () => {
        if (bouncing) return;
        bouncing = true;
        startBounce(o, logo, () => bouncing = false);
    });
});

function getTextWidth(text, style) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    return ctx.measureText(text).width;
}

function startBounce(el, container, onFinish) {
    let x = 0, y = 0, vx = 2.7, vy = 0;
    const gravity = 0.7, damping = 0.55, floor = 20;
    let rolling = false;
    const maxRight = window.innerWidth + 100;

    function animate() {
        if (!rolling) {
            vy += gravity;
            y += vy;
            if (y > floor) {
                y = floor;
                vy *= -damping;
                if (Math.abs(vy) < 1.0) { rolling = true; vy = 0; }
            }
        }
        x += vx;
        if (x > maxRight) return respawn(el, container, onFinish);
        el.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animate);
    }
    animate();
}

function respawn(el, container, onFinish) {
    let x = -150, y = 16, vx = 2.5;
    const jumpPoint = 20;

    function rollAnimation() {
        x += vx;
        el.style.transition = "none";
        el.style.transform = `translate(${x}px, ${y}px)`;
        if (x >= jumpPoint) return doJump(el, onFinish);
        requestAnimationFrame(rollAnimation);
    }
    rollAnimation();
}

function doJump(el, onFinish) {
    el.style.transition = "transform 0.45s cubic-bezier(.34,1.56,.64,1)";
    el.style.transform = `translate(0px, -55px)`;
    setTimeout(() => {
        el.style.transform = `translate(0px, 0px)`;
        setTimeout(() => { onFinish(); }, 400);
    }, 300);
}

// Typing Animation
function typeRole() {
    const roleText = document.getElementById('role-text');
    const currentRole = roles[roleIndex];
    
    if (!isDeleting) {
        const displayText = currentRole.substring(0, charIndex);
        roleText.innerHTML = displayText;
        roleText.setAttribute('data-text', displayText);
        charIndex++;
        if (charIndex > currentRole.length) { isDeleting = true; typingSpeed = 2000; }
        else typingSpeed = 100;
    } else {
        const displayText = currentRole.substring(0, charIndex);
        roleText.innerHTML = displayText;
        roleText.setAttribute('data-text', displayText);
        charIndex--;
        typingSpeed = 50;
        if (charIndex < 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; charIndex = 0; typingSpeed = 500; }
    }
    
    setTimeout(typeRole, typingSpeed);
}

// Floating Icons + Repulsion
function animateIcons() {
    const icons = document.querySelectorAll('.lang-icon');
    const profilePhoto = document.querySelector('.profile-photo');
    let mouseInside = false;

    profilePhoto.addEventListener("mouseenter", (e) => {
        mouseInside = true;
        const ripple = document.createElement("span");
        ripple.classList.add("ripple-wave");
        const bounds = profilePhoto.getBoundingClientRect();
        ripple.style.left = bounds.left + bounds.width / 2 + "px";
        ripple.style.top = bounds.top + bounds.height / 2 + "px";
        ripple.style.width = "200px";
        ripple.style.height = "200px";
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    });

    profilePhoto.addEventListener("mouseleave", () => { mouseInside = false; });

    function getProfileBounds() {
        const rect = profilePhoto.getBoundingClientRect();
        return { centerX: rect.left + rect.width / 2, centerY: rect.top + rect.height / 2, radius: rect.width / 2 + 30 };
    }

    function insideNoGoZone(x, y) {
        const b = getProfileBounds();
        return Math.sqrt((x - b.centerX) ** 2 + (y - b.centerY) ** 2) < b.radius;
    }

    function getRepelledPosition(x, y) {
        const b = getProfileBounds();
        const angle = Math.atan2(y - b.centerY, x - b.centerX);
        return { x: b.centerX + Math.cos(angle) * (b.radius + 90), y: b.centerY + Math.sin(angle) * (b.radius + 90) };
    }

    function realtimeShield() {
        if (mouseInside) {
            icons.forEach(icon => {
                const rect = icon.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                if (insideNoGoZone(x, y)) {
                    const safe = getRepelledPosition(x, y);
                    const container = icon.parentElement.getBoundingClientRect();
                    icon.classList.add("icon-damage");
                    setTimeout(() => icon.classList.remove("icon-damage"), 200);
                    icon.style.transition = "200ms linear";
                    icon.style.top = ((safe.y - container.top) / container.height) * 100 + "%";
                    icon.style.left = ((safe.x - container.left) / container.width) * 100 + "%";
                }
            });
        }
        requestAnimationFrame(realtimeShield);
    }
    realtimeShield();

    icons.forEach((icon, index) => {
        function move() {
            let targetTop, targetLeft, tries = 0;
            do {
                targetTop = Math.random() * 80 + 10;
                targetLeft = Math.random() * 80 + 10;
                const container = icon.parentElement.getBoundingClientRect();
                const absX = container.left + (targetLeft / 100) * container.width;
                const absY = container.top + (targetTop / 100) * container.height;
                if (!insideNoGoZone(absX, absY)) break;
                tries++;
            } while (tries < 20);

            const duration = 3000 + Math.random() * 2500;
            icon.style.transition = `${duration}ms ease-in-out`;
            icon.style.top = targetTop + "%";
            icon.style.left = targetLeft + "%";
            setTimeout(move, duration);
        }
        setTimeout(move, index * 500);
    });
}

// Init on load
window.addEventListener('load', () => {
    const navbar = document.getElementById('navbar');
    setTimeout(() => { navbar.classList.add('visible'); }, 100);
    
    const heroLeft = document.querySelector('.hero-left');
    setTimeout(() => { heroLeft.classList.add('visible'); }, 300);
    
    const heroRight = document.querySelector('.hero-right');
    setTimeout(() => { heroRight.classList.add('visible'); }, 500);
    
    setTimeout(() => { typeRole(); }, 1000);
    setTimeout(() => { animateIcons(); }, 1500);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ==========================================================================================
// About Me Section Animation on Scroll
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateAboutSection();
            } else {
                resetAboutAnimation();
            }
        });
    }, { threshold: 0.2, rootMargin: '0px' });

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) observer.observe(aboutSection);

    function animateAboutSection() {
        document.querySelector('.section-title')?.classList.add('animate');
        document.querySelector('.about-photo')?.classList.add('animate');
        document.querySelectorAll('.info-card').forEach(c => c.classList.add('animate'));
        document.querySelectorAll('.info-item').forEach(i => i.classList.add('animate'));
    }

    function resetAboutAnimation() {
        document.querySelector('.section-title')?.classList.remove('animate');
        document.querySelector('.about-photo')?.classList.remove('animate');
        document.querySelectorAll('.info-card').forEach(c => c.classList.remove('animate'));
        document.querySelectorAll('.info-item').forEach(i => i.classList.remove('animate'));
    }
});

// Marquee scroll direction
document.addEventListener("DOMContentLoaded", () => {
    const marqueeTop = document.querySelector(".marquee-top");
    const marqueeBottom = document.querySelector(".marquee-bottom");
    let lastScroll = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        lastScroll = currentScroll;
        if (marqueeTop) marqueeTop.style.transform = `translateX(${currentScroll * -0.25}px)`;
        if (marqueeBottom) marqueeBottom.style.transform = `translateX(${currentScroll * 0.25}px)`;
    });
});

// =======================================================================
// Skills Section Animation
// =======================================================================
const animateSkills = () => {
    const skillsSection = document.querySelector('#skills');
    const title = document.querySelector('.skills-title');
    const skillCards = document.querySelectorAll('.skill-card');

    if (!skillsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (title) { title.style.opacity = '1'; }

                skillCards.forEach((card, i) => {
                    clearTimeout(card._exitTimeout);
                    card.classList.remove('exiting');

                    setTimeout(() => {
                        card.classList.add('animate');
                    }, 150 + (i * 100));
                });

            } else {
                if (title) { title.style.opacity = '0'; }

                skillCards.forEach((card, i) => {
                    card.classList.add('exiting');

                    card._exitTimeout = setTimeout(() => {
                        card.classList.remove('animate');
                        card.classList.remove('exiting');
                    }, 450);
                });
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "-40px"
    });

    observer.observe(skillsSection);
};

// Active nav (fallback)
const updateActiveNav = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    let current = '';
    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 150) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) link.classList.add('active');
    });
};

document.addEventListener('DOMContentLoaded', () => {
    animateSkills();
    updateActiveNav();
});

window.addEventListener('scroll', updateActiveNav);


// =======================================================================
// Portfolio Section
// =======================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            animateTabContent(targetTab);
        });
    });

    const portfolioSection = document.querySelector('.portfolio-section');
    let portfolioVisible = false;
    let exitResetTimer = null;

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                clearTimeout(exitResetTimer);

                if (!portfolioVisible) {
                    portfolioVisible = true;
                    animateSection();
                }

            } else if (portfolioVisible) {
                portfolioVisible = false;

                const allCards = document.querySelectorAll('.portfolio-section .project-card, .portfolio-section .certificate-card, .portfolio-section .timeline-item');
                allCards.forEach(card => {
                    card.classList.add('exiting');
                });

                const portfolioTitle = document.querySelector('.portfolio-section .section-title');
                const tabNav = document.querySelector('.tab-navigation');

                exitResetTimer = setTimeout(() => {
                    allCards.forEach(card => {
                        card.classList.remove('animate');
                        card.classList.remove('exiting');
                    });
                    if (portfolioTitle) portfolioTitle.classList.remove('animate');
                    if (tabNav) tabNav.classList.remove('animate');
                }, 450);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px"
    });

    if (portfolioSection) sectionObserver.observe(portfolioSection);

    function animateSection() {
        const title = document.querySelector('.portfolio-section .section-title');
        const tabNav = document.querySelector('.tab-navigation');
        if (title) title.classList.add('animate');
        if (tabNav) tabNav.classList.add('animate');
        setTimeout(() => { animateTabContent('projects'); }, 300);
    }

    function animateTabContent(tabName) {
        const activePane = document.getElementById(tabName);
        if (!activePane) return;

        const allCards = activePane.querySelectorAll('.project-card, .certificate-card, .timeline-item');
        allCards.forEach(card => {
            card.classList.remove('animate');
            card.classList.remove('exiting');
        });

        void activePane.offsetWidth;

        setTimeout(() => {
            allCards.forEach(card => card.classList.add('animate'));
        }, 50);
    }

    // Certificate Modal
    const certificateCards = document.querySelectorAll('.certificate-card');
    const modal = document.getElementById('certificateModal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    const certificatesData = [
        { name: 'LKS IT Software Solutions (District Level)', issuer: 'Department of Education of Karanganyar', date: 'February 2025', image: 'assets/CRF1.jpg' },
        { name: 'test', issuer: 'test', date: 'test', image: 'assets/cert2.jpg' },
        { name: 'test', issuer: 'test', date: 'test', image: 'assets/cert3.jpg' },
        { name: 'test', issuer: 'test', date: 'test', image: 'assets/cert4.jpg' }
    ];

    certificateCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const certData = certificatesData[index];
            if (certData) showCertificateModal(certData);
        });
    });

    function showCertificateModal(data) {
        document.getElementById('modalCertName').textContent = data.name;
        document.getElementById('modalCertIssuer').textContent = `Issued by: ${data.issuer}`;
        document.getElementById('modalCertDate').textContent = `Date: ${data.date}`;
        document.getElementById('modalCertImage').src = data.image;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCertificateModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeCertificateModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeCertificateModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeCertificateModal();
    });

    // Show More Certificates
    const showMoreBtn = document.querySelector('.show-more-btn');
    const hiddenCerts = document.querySelectorAll('.hidden-cert');
    let isExpanded = false;

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            if (!isExpanded) {
                hiddenCerts.forEach((cert, index) => {
                    setTimeout(() => { cert.classList.add('show'); cert.classList.add('animate'); }, index * 100);
                });
                showMoreBtn.querySelector('span').textContent = 'Show Less';
                showMoreBtn.querySelector('svg').style.transform = 'rotate(180deg)';
                isExpanded = true;
            } else {
                hiddenCerts.forEach(cert => { cert.classList.remove('show'); cert.classList.remove('animate'); });
                showMoreBtn.querySelector('span').textContent = 'Show More';
                showMoreBtn.querySelector('svg').style.transform = 'rotate(0deg)';
                isExpanded = false;
                document.querySelector('.certificates-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Parallax project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const rotateX = (e.clientY - rect.top - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 20;
            const img = card.querySelector('.project-image img');
            if (img) img.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            const img = card.querySelector('.project-image img');
            if (img) img.style.transform = 'scale(1) rotateX(0) rotateY(0)';
        });
    });

    // Timeline
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animate');
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.timeline-item').forEach(item => timelineObserver.observe(item));
});

// ===================== CONTACT SECTION =====================
document.addEventListener('DOMContentLoaded', function() {
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const title = contactSection.querySelector('.contact-title');
                    if (title) title.classList.add('animate');
                    contactSection.querySelectorAll('.contact-info-card').forEach(card => card.classList.add('animate'));
                    const badge = contactSection.querySelector('.availability-badge');
                    if (badge) badge.style.opacity = '1';
                    const formWrapper = contactSection.querySelector('.contact-form-wrapper');
                    if (formWrapper) formWrapper.classList.add('animate');
                }
            });
        }, { threshold: 0.15 });
        contactObserver.observe(contactSection);
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = contactForm.querySelector('.contact-submit-btn');
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            btn.classList.add('sending');
            btn.querySelector('span').textContent = 'Sending...';

            setTimeout(() => {
                btn.classList.remove('sending');
                btn.querySelector('span').textContent = 'Send Message';
                contactForm.reset();
                showToast('✅ Message sent! I\'ll get back to you soon.', 'success');
            }, 1800);
        });
    }
});

function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => { toast.classList.add('show'); });
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}