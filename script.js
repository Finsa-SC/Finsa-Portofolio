// Roles for typing animation
const roles = [
    'Junior Software Developer',
    'Beginner Android Developer',
    'Software Engineer',
    'Problem Solver'
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
    
    // Create highlight indicator
    const highlight = document.createElement('div');
    highlight.className = 'nav-highlight';
    navLinksContainer.appendChild(highlight);
    
    // Handle click navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update highlight position
    function updateHighlight(activeLink, progress = 1) {
        if (!activeLink) return;
        
        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = navLinksContainer.getBoundingClientRect();
        
        const left = linkRect.left - containerRect.left;
        const width = linkRect.width;
        
        highlight.style.left = `${left}px`;
        highlight.style.width = `${width}px`;
        highlight.style.opacity = progress;
    }
    
    // Handle scroll to update active nav
    function onScroll() {
        const scrollPos = window.scrollY + 100; // offset for navbar height
        
        let currentSection = null;
        let nextSection = null;
        let progress = 1;
        
        // Find current and next section
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section;
                if (index < sections.length - 1) {
                    nextSection = sections[index + 1];
                }
            }
        });
        
        if (currentSection) {
            const sectionTop = currentSection.offsetTop;
            const sectionHeight = currentSection.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Calculate progress between sections
            const sectionProgress = (scrollPos - sectionTop) / sectionHeight;
            
            // Find corresponding nav links
            const currentLink = document.querySelector(`.nav-links a[href="#${currentSection.id}"]`);
            const nextLink = nextSection ? document.querySelector(`.nav-links a[href="#${nextSection.id}"]`) : null;
            
            // Remove active class from all
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.classList.remove('active-partial');
            });
            
            // Transition zone (last 30% of current section)
            if (nextLink && sectionProgress > 0.7) {
                const transitionProgress = (sectionProgress - 0.7) / 0.3; // 0 to 1
                
                // Calculate interpolated position
                const currentRect = currentLink.getBoundingClientRect();
                const nextRect = nextLink.getBoundingClientRect();
                const containerRect = navLinksContainer.getBoundingClientRect();
                
                const currentLeft = currentRect.left - containerRect.left;
                const currentWidth = currentRect.width;
                const nextLeft = nextRect.left - containerRect.left;
                const nextWidth = nextRect.width;
                
                const interpolatedLeft = currentLeft + (nextLeft - currentLeft) * transitionProgress;
                const interpolatedWidth = currentWidth + (nextWidth - currentWidth) * transitionProgress;
                
                highlight.style.left = `${interpolatedLeft}px`;
                highlight.style.width = `${interpolatedWidth}px`;
                highlight.style.opacity = '1';
                
                // Add partial active state
                currentLink.classList.add('active-partial');
                nextLink.classList.add('active-partial');
            } else {
                // Normal state - fully on one section
                currentLink.classList.add('active');
                updateHighlight(currentLink, 1);
            }
        }
    }
    
    // Initialize
    window.addEventListener('scroll', onScroll);
    onScroll(); // Initial call
});

// o bouncing
document.addEventListener("DOMContentLoaded", () => {

    const logo = document.querySelector(".logo");
    const text = logo.textContent;
    const last = text.slice(-1);
    const base = text.slice(0, -1);

    logo.innerHTML = `
        ${base}
        <span class="o-bounce">${last}</span>
    `;

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
    let x = 0;
    let y = 0;
    let vx = 2.7;
    let vy = 0;
    let gravity = 0.7;
    let damping = 0.55;
    let floor = 20;
    let rolling = false;

    const maxRight = window.innerWidth + 100;

    function animate() {

        // vertical bounce
        if (!rolling) {
            vy += gravity;
            y += vy;

            if (y > floor) {
                y = floor;
                vy *= -damping;

                if (Math.abs(vy) < 1.0) {
                    rolling = true;
                    vy = 0;
                }
            }
        }

        // move horizontally
        x += vx;

        if (x > maxRight) {
            return respawn(el, container, onFinish);
        }

        el.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animate);
    }

    animate();
}

function respawn(el, container, onFinish) {

    // posisi awal setelah muncul kiri
    let x = -150;
    let y = 16;
    let vx = 2.5;   // rolling speed
    const jumpPoint = 20; // titik dekat posisi asli

    function rollAnimation() {

        x += vx;
        el.style.transition = "none";
        el.style.transform = `translate(${x}px, ${y}px)`;

        // Sudah dekat area awal → jump
        if (x >= jumpPoint) return doJump(el, onFinish);

        requestAnimationFrame(rollAnimation);
    }

    rollAnimation();
}

// jump to start
function doJump(el, onFinish) {
    el.style.transition = "transform 0.45s cubic-bezier(.34,1.56,.64,1)";
    el.style.transform = `translate(0px, -55px)`;

    setTimeout(() => {
        el.style.transform = `translate(0px, 0px)`;

        setTimeout(() => {
            onFinish();
        }, 400);

    }, 300);
}


// Typing Animation Function
function typeRole() {
    const roleText = document.getElementById('role-text');
    const currentRole = roles[roleIndex];
    
    if (!isDeleting) {
        // Typing
        const displayText = currentRole.substring(0, charIndex);
        roleText.innerHTML = displayText;
        roleText.setAttribute('data-text', displayText);
        charIndex++;
        
        if (charIndex > currentRole.length) {
            // Pause before deleting
            isDeleting = true;
            typingSpeed = 2000;
        } else {
            typingSpeed = 100;
        }
    } else {
        // Deleting
        const displayText = currentRole.substring(0, charIndex);
        roleText.innerHTML = displayText;
        roleText.setAttribute('data-text', displayText);
        charIndex--;
        typingSpeed = 50;
        
        if (charIndex < 0) {
            // Move to next role
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            charIndex = 0;
            typingSpeed = 500;
        }
    }
    
    setTimeout(typeRole, typingSpeed);
}

// Random Floating Animation for Icons with Profile Photo Repulsion
function animateIcons() {
    const icons = document.querySelectorAll('.lang-icon');
    const profilePhoto = document.querySelector('.profile-photo');

    let mouseInside = false;

    profilePhoto.addEventListener("mouseenter", (e) => {
        mouseInside = true;
        const ripple = document.createElement("span");
        ripple.classList.add("ripple-wave");

        // Pusat ripple = posisi foto
        const bounds = profilePhoto.getBoundingClientRect();
        ripple.style.left = bounds.left + bounds.width / 2 + "px";
        ripple.style.top = bounds.top + bounds.height / 2 + "px";

        // Size wave
        ripple.style.width = "200px";
        ripple.style.height = "200px";

        document.body.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
    });

    profilePhoto.addEventListener("mouseleave", () => {
        mouseInside = false;
    });

    function getProfileBounds() {
        const rect = profilePhoto.getBoundingClientRect();
        return {
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            radius: rect.width / 2 + 30
        };
    }

    function insideNoGoZone(x, y) {
        const b = getProfileBounds();
        const dist = Math.sqrt((x - b.centerX) ** 2 + (y - b.centerY) ** 2);
        return dist < b.radius;
    }

    function getRepelledPosition(x, y) {
        const b = getProfileBounds();
        const dx = x - b.centerX;
        const dy = y - b.centerY;
        const angle = Math.atan2(dy, dx);

        const extraPush = 90; 

        return {
            x: b.centerX + Math.cos(angle) * (b.radius + extraPush),
            y: b.centerY + Math.sin(angle) * (b.radius + extraPush)
        };
    }

    // --------------- NEW: REALTIME SHIELD ----------------
    function realtimeShield() {
        if (mouseInside) {
            icons.forEach(icon => {
                const rect = icon.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;

                if (insideNoGoZone(x, y)) {
                    const safe = getRepelledPosition(x, y);
                    const container = icon.parentElement.getBoundingClientRect();

                    // ----- Efek KEPENTAL + DAMAGE -----
                    icon.classList.add("icon-damage");

                    setTimeout(() => {
                        icon.classList.remove("icon-damage");
                    }, 200); // efek 0.2 detik

                    icon.style.transition = "200ms linear";
                    icon.style.top = ((safe.y - container.top) / container.height) * 100 + "%";
                    icon.style.left = ((safe.x - container.left) / container.width) * 100 + "%";
                }

            });
        }

        requestAnimationFrame(realtimeShield);
    }

    realtimeShield(); // <-- Start the shield loop
    // ------------------------------------------------------

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


// Initialize animations on page load
window.addEventListener('load', () => {
    // Show navbar with slide down animation
    const navbar = document.getElementById('navbar');
    setTimeout(() => {
        navbar.classList.add('visible');
    }, 100);
    
    // Show hero left section with slide from left
    const heroLeft = document.querySelector('.hero-left');
    setTimeout(() => {
        heroLeft.classList.add('visible');
    }, 300);
    
    // Show hero right section with slide from right
    const heroRight = document.querySelector('.hero-right');
    setTimeout(() => {
        heroRight.classList.add('visible');
    }, 500);
    
    // Start typing animation
    setTimeout(() => {
        typeRole();
    }, 1000);
    
    // Start icon floating animation
    setTimeout(() => {
        animateIcons();
    }, 1500);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ==========================================================================================
// About Me Section Animation on Scroll
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateAboutSection();   // masuk → animasi ON
            } else {
                resetAboutAnimation();   // keluar → reset supaya bisa animasi lagi
            }
        });
    }, observerOptions);

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        observer.observe(aboutSection);
    }

    function animateAboutSection() {
        document.querySelector('.section-title')?.classList.add('animate');
        document.querySelector('.about-photo')?.classList.add('animate');

        document.querySelectorAll('.info-card')
            .forEach(c => c.classList.add('animate'));
        document.querySelectorAll('.info-item')
            .forEach(i => i.classList.add('animate'));
    }

    function resetAboutAnimation() {
        document.querySelector('.section-title')?.classList.remove('animate');
        document.querySelector('.about-photo')?.classList.remove('animate');

        document.querySelectorAll('.info-card')
            .forEach(c => c.classList.remove('animate'));
        document.querySelectorAll('.info-item')
            .forEach(i => i.classList.remove('animate'));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const marqueeTop = document.querySelector(".marquee-top");
    const marqueeBottom = document.querySelector(".marquee-bottom");

    let lastScroll = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        const direction = currentScroll > lastScroll ? 1 : -1; 
        lastScroll = currentScroll;

        if (marqueeTop) marqueeTop.style.transform = `translateX(${currentScroll * -0.25}px)`;
        if (marqueeBottom) marqueeBottom.style.transform = `translateX(${currentScroll * 0.25}px)`;
    });
});



// =====================================================================================================================================================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const animateSkills = () => {
    const skillsSection = document.querySelector('#skills');
    const title = document.querySelector('.skills-title');
    const skillCards = document.querySelectorAll('.skill-card');

    if (!skillsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                // Title tanpa animasi
                title.classList.add('animate');
                title.style.opacity = '1';

                skillCards.forEach((card, i) => {
                    card.classList.remove('animate');
                    card.style.opacity = '0';

                    setTimeout(() => {
                        card.classList.add('animate');
                    }, 150 + (i * 100));
                });

            } else {
                title.classList.remove('animate');
                skillCards.forEach(card => card.classList.remove('animate'));
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: "-60px"
    });

    observer.observe(skillsSection);
};


// Active state untuk navigation
const updateActiveNav = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
};

// Init saat halaman load
document.addEventListener('DOMContentLoaded', () => {
    animateSkills();
    updateActiveNav();
});

// Update saat scroll
window.addEventListener('scroll', updateActiveNav);
