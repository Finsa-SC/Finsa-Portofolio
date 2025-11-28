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

// Random Floating Animation for Icons
function animateIcons() {
    const icons = document.querySelectorAll('.lang-icon');
    
    icons.forEach((icon, index) => {
        // Set initial random position
        const randomTop = Math.random() * 80 + 10; // 10% to 90%
        const randomLeft = Math.random() * 80 + 10; // 10% to 90%
        icon.style.top = randomTop + '%';
        icon.style.left = randomLeft + '%';
        
        // Animate each icon continuously
        function moveIcon() {
            const currentTop = parseFloat(icon.style.top);
            const currentLeft = parseFloat(icon.style.left);
            
            // Random target position (within bounds)
            const targetTop = Math.random() * 70 + 15; // 15% to 85%
            const targetLeft = Math.random() * 70 + 15; // 15% to 85%
            
            // Random duration between 3-6 seconds
            const duration = (Math.random() * 3 + 3) * 1000;
            
            // Random rotation
            const targetRotation = Math.random() * 20 - 10; // -10 to 10 degrees
            
            const startTime = Date.now();
            
            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-in-out)
                const eased = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                // Calculate new position
                const newTop = currentTop + (targetTop - currentTop) * eased;
                const newLeft = currentLeft + (targetLeft - currentLeft) * eased;
                const newRotation = targetRotation * eased;
                
                icon.style.top = newTop + '%';
                icon.style.left = newLeft + '%';
                icon.style.transform = `rotate(${newRotation}deg)`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Start new random movement
                    setTimeout(moveIcon, Math.random() * 1000); // 0-1 second pause
                }
            }
            
            animate();
        }
        
        // Start animation with random delay for each icon
        setTimeout(moveIcon, index * 500);
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
