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