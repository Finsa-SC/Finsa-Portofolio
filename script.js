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
    // Intersection Observer untuk detect ketika section masuk viewport
    const observerOptions = {
        threshold: 0.2, // Trigger ketika 20% section terlihat
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate semua elemen
                animateAboutSection();
                // Stop observing setelah animasi jalan (opsional)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe about section
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        observer.observe(aboutSection);
    }

    function animateAboutSection() {
        // Animate title
        const title = document.querySelector('.section-title');
        if (title) {
            title.classList.add('animate');
        }

        // Animate photo
        const photo = document.querySelector('.about-photo');
        if (photo) {
            photo.classList.add('animate');
        }

        // Animate info cards (Who Am I & My Approach)
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach(card => {
            card.classList.add('animate');
        });

        // Animate personal info items
        const infoItems = document.querySelectorAll('.info-item');
        infoItems.forEach(item => {
            item.classList.add('animate');
        });
    }
});
