// ============================================
// HOME.JS - Home Page Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. COUNTER ANIMATION
    // ========================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    }
    
    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe all counter elements
    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });
    
    
    // ========================================
    // 2. SMOOTH SCROLL FOR CTA BUTTONS
    // ========================================
    const exploreBtns = document.querySelectorAll('a[href*="#"]');
    exploreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    
    // ========================================
    // 3. PROJECT CARDS HOVER EFFECTS
    // ========================================
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    
    // ========================================
    // 4. ANIMATED CARDS ON SCROLL
    // ========================================
    const animateOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all cards
    document.querySelectorAll('.card, .project-item').forEach(card => {
        animateOnScroll.observe(card);
    });
    
    
    // ========================================
    // 5. DYNAMIC BADGE COUNTER
    // ========================================
    function updateBadgeCounters() {
        const badges = document.querySelectorAll('.badge');
        badges.forEach(badge => {
            const text = badge.textContent;
            const match = text.match(/\d+/);
            if (match) {
                const number = parseInt(match[0]);
                badge.style.transition = 'all 0.3s ease';
            }
        });
    }
    
    updateBadgeCounters();
    
    
    // ========================================
    // 6. HERO PARALLAX EFFECT
    // ========================================
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroSection.style.backgroundPositionY = `${parallax}px`;
        });
    }
    
    
    // ========================================
    // 7. CARD STAGGER ANIMATION
    // ========================================
    function staggerCards() {
        const cards = document.querySelectorAll('.col-md-3, .col-md-4');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    staggerCards();
    
    
    // ========================================
    // 8. IMPACT STATS PULSE ANIMATION
    // ========================================
    const statIcons = document.querySelectorAll('.fa-users, .fa-map-marker-alt, .fa-laptop-code, .fa-heart');
    
    statIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.5s ease';
        });
        
        icon.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
    
    
    // ========================================
    // 9. CARD CLICK TRACKING (Analytics Ready)
    // ========================================
    const offerCards = document.querySelectorAll('#offer .card');
    
    offerCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('.card-title').textContent;
            console.log(`Card clicked: ${cardTitle}`);
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            // Here you can add Google Analytics tracking
            // gtag('event', 'card_click', { 'card_name': cardTitle });
        });
    });
    
    
    // ========================================
    // 10. PROJECT BADGE HOVER EFFECT
    // ========================================
    const projectBadges = document.querySelectorAll('.badge');
    
    projectBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'all 0.2s ease';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    
    // ========================================
    // 11. CTA BUTTON RIPPLE EFFECT
    // ========================================
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-light');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    
    // ========================================
    // 12. LAZY LOAD IMAGES
    // ========================================
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const realSrc = img.getAttribute('src');
                    if (realSrc) {
                        img.src = realSrc; // actually load the image
                    }
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    
    // ========================================
    // 13. SCROLL PROGRESS INDICATOR
    // ========================================
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // You can create a progress bar element and update it here
        // document.getElementById('progress-bar').style.width = scrollPercent + '%';
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    
    
    // ========================================
    // 14. PROJECT CARD IMAGE ZOOM ON HOVER
    // ========================================
    const projectImages = document.querySelectorAll('.project-img-wrapper img');
    
    projectImages.forEach(img => {
        const wrapper = img.parentElement;
        
        wrapper.addEventListener('mouseenter', function() {
            img.style.transform = 'scale(1.1)';
            img.style.transition = 'transform 0.5s ease';
        });
        
        wrapper.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
        });
    });
    
    
    // ========================================
    // 15. STATS SECTION BACKGROUND ANIMATION
    // ========================================
    const statsSection = document.querySelector('.py-5:has(.counter)');
    if (statsSection) {
        let offset = 0;
        
        function animateStatsBackground() {
            offset += 0.5;
            if (offset > 100) offset = 0;
            // Add subtle animation effect if needed
        }
        
        setInterval(animateStatsBackground, 50);
    }
    
    
    // ========================================
    // 16. CONSOLE WELCOME MESSAGE
    // ========================================
    console.log('%c🚀 Welcome to SocialTech Innovations!', 'color: #2BB6E0; font-size: 20px; font-weight: bold;');
    console.log('%cEmpowering communities through technology', 'color: #8B4FBF; font-size: 14px;');
    console.log('%cInterested in our work? Visit: https://socialtechinnovations.org', 'color: #333; font-size: 12px;');
    
});


// ========================================
// ADD RIPPLE EFFECT CSS DYNAMICALLY
// ========================================
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(style);