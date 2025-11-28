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
    const profileContainer = document.querySelector('.profile-container');
    let isMouseOverProfile = false;
    
    // Track mouse position over profile
    profileContainer.addEventListener('mouseenter', () => {
        isMouseOverProfile = true;
    });
    
    profileContainer.addEventListener('mouseleave', () => {
        isMouseOverProfile = false;
    });
    
    // Get profile center and radius
    function getProfileBounds() {
        const rect = profileContainer.getBoundingClientRect();
        return {
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            radius: 180 // radius zona eksklusif (lebih besar dari foto)
        };
    }
    
    // Check if position collides with profile
    function isInProfileZone(x, y) {
        const bounds = getProfileBounds();
        const distance = Math.sqrt(
            Math.pow(x - bounds.centerX, 2) + 
            Math.pow(y - bounds.centerY, 2)
        );
        return distance < bounds.radius;
    }
    
    // Get safe position away from profile
    function getSafePosition(currentX, currentY) {
        const bounds = getProfileBounds();
        const containerRect = profileContainer.getBoundingClientRect();
        
        // Calculate repulsion vector
        const dx = currentX - bounds.centerX;
        const dy = currentY - bounds.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < bounds.radius) {
            // Push away from center
            const pushDistance = bounds.radius + 50;
            const angle = Math.atan2(dy, dx);
            
            const newX = bounds.centerX + Math.cos(angle) * pushDistance;
            const newY = bounds.centerY + Math.sin(angle) * pushDistance;
            
            // Convert to percentage relative to container
            const percentX = ((newX - containerRect.left) / containerRect.width) * 100;
            const percentY = ((newY - containerRect.top) / containerRect.height) * 100;
            
            return {
                top: Math.max(5, Math.min(95, percentY)),
                left: Math.max(5, Math.min(95, percentX))
            };
        }
        
        return null;
    }
    
    icons.forEach((icon, index) => {
        // Set initial random position (avoiding profile)
        let randomTop, randomLeft, attempts = 0;
        do {
            randomTop = Math.random() * 80 + 10;
            randomLeft = Math.random() * 80 + 10;
            attempts++;
        } while (attempts < 10); // Try to find safe spot
        
        icon.style.top = randomTop + '%';
        icon.style.left = randomLeft + '%';
        
        // Animate each icon continuously
        function moveIcon() {
            const currentTop = parseFloat(icon.style.top);
            const currentLeft = parseFloat(icon.style.left);
            
            // Get current absolute position
            const iconRect = icon.getBoundingClientRect();
            const iconCenterX = iconRect.left + iconRect.width / 2;
            const iconCenterY = iconRect.top + iconRect.height / 2;
            
            // Check if mouse is over profile and icon is in zone
            if (isMouseOverProfile && isInProfileZone(iconCenterX, iconCenterY)) {
                const safePos = getSafePosition(iconCenterX, iconCenterY);
                if (safePos) {
                    icon.style.top = safePos.top + '%';
                    icon.style.left = safePos.left + '%';
                    setTimeout(moveIcon, 100);
                    return;
                }
            }
            
            // Find target position that doesn't collide with profile
            let targetTop, targetLeft, validPosition = false;
            let attempts = 0;
            
            do {
                targetTop = Math.random() * 70 + 15;
                targetLeft = Math.random() * 70 + 15;
                
                const containerRect = profileContainer.getBoundingClientRect();
                const testX = containerRect.left + (targetLeft / 100) * containerRect.width;
                const testY = containerRect.top + (targetTop / 100) * containerRect.height;
                
                validPosition = !isMouseOverProfile || !isInProfileZone(testX, testY);
                attempts++;
            } while (!validPosition && attempts < 20);
            
            // Random duration between 3-6 seconds
            const duration = (Math.random() * 3 + 3) * 1000;
            
            // Random rotation
            const targetRotation = Math.random() * 20 - 10;
            
            const startTime = Date.now();
            
            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Check collision during animation
                const iconRect = icon.getBoundingClientRect();
                const iconCenterX = iconRect.left + iconRect.width / 2;
                const iconCenterY = iconRect.top + iconRect.height / 2;
                
                if (isMouseOverProfile && isInProfileZone(iconCenterX, iconCenterY)) {
                    const safePos = getSafePosition(iconCenterX, iconCenterY);
                    if (safePos) {
                        icon.style.top = safePos.top + '%';
                        icon.style.left = safePos.left + '%';
                    }
                    setTimeout(moveIcon, 100);
                    return;
                }
                
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
                    setTimeout(moveIcon, Math.random() * 1000);
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
