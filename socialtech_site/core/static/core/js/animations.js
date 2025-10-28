// ============================================
// ANIMATIONS.JS - Global Animation System
// Scroll effects, counters, transitions
// ============================================

(function() {
    'use strict';
    
    // ========================================
    // 1. SCROLL REVEAL ANIMATIONS
    // ========================================
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('[data-animate]');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.getAttribute('data-animate') || 'fadeInUp';
                    const delay = element.getAttribute('data-delay') || 0;
                    
                    setTimeout(() => {
                        element.style.animation = `${animationType} 0.6s ease forwards`;
                        element.style.opacity = '1';
                    }, delay);
                    
                    revealObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            element.style.opacity = '0';
            revealObserver.observe(element);
        });
    };
    
    
    // ========================================
    // 2. COUNTER ANIMATION
    // ========================================
    const initCounterAnimations = () => {
        const counters = document.querySelectorAll('[data-target], .counter');
        
        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-target') || element.textContent.replace(/\D/g, ''));
            const duration = parseInt(element.getAttribute('data-duration') || 2000);
            const suffix = element.getAttribute('data-suffix') || '';
            const prefix = element.getAttribute('data-prefix') || '';
            
            if (isNaN(target)) return;
            
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                
                if (current < target) {
                    element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = prefix + target.toLocaleString() + suffix;
                }
            };
            
            updateCounter();
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    };
    
    
    // ========================================
    // 3. PARALLAX EFFECT
    // ========================================
    const initParallax = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        const handleParallax = throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 10);
        
        window.addEventListener('scroll', handleParallax);
    };
    
    
    // ========================================
    // 4. FADE IN ON SCROLL
    // ========================================
    const initFadeIn = () => {
        const fadeElements = document.querySelectorAll('.fade-in, [data-fade]');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        fadeElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeObserver.observe(element);
        });
    };
    
    
    // ========================================
    // 5. STAGGER ANIMATION FOR CHILDREN
    // ========================================
    const initStaggerAnimation = () => {
        const staggerContainers = document.querySelectorAll('[data-stagger]');
        
        staggerContainers.forEach(container => {
            const children = container.children;
            const delay = parseInt(container.getAttribute('data-stagger-delay')) || 100;
            
            const staggerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.style.animation = 'fadeInUp 0.5s ease forwards';
                                child.style.opacity = '1';
                            }, index * delay);
                        });
                        staggerObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            Array.from(children).forEach(child => {
                child.style.opacity = '0';
            });
            
            staggerObserver.observe(container);
        });
    };
    
    
    // ========================================
    // 6. HOVER TILT EFFECT
    // ========================================
    const initTiltEffect = () => {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
            
            element.style.transition = 'transform 0.3s ease';
        });
    };
    
    
    // ========================================
    // 7. SMOOTH ENTRANCE FOR CARDS
    // ========================================
    const initCardEntrances = () => {
        const cards = document.querySelectorAll('.card, .project-card, .service-card, .team-card');
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = 'cardEntrance 0.6s ease forwards';
                    }, index * 100);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(card => {
            if (!card.hasAttribute('data-no-animate')) {
                card.style.opacity = '0';
                cardObserver.observe(card);
            }
        });
    };
    
    
    // ========================================
    // 8. PROGRESS BAR ANIMATION
    // ========================================
    const initProgressBars = () => {
        const progressBars = document.querySelectorAll('[data-progress]');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-progress');
                    
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                    }, 200);
                    
                    progressObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'width 1.5s ease';
            progressObserver.observe(bar);
        });
    };
    
    
    // ========================================
    // 9. ICON PULSE ON SCROLL
    // ========================================
    const initIconPulse = () => {
        const icons = document.querySelectorAll('[data-icon-pulse], .fa-2x, .fa-3x');
        
        const iconObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'iconPulse 0.6s ease';
                    
                    setTimeout(() => {
                        entry.target.style.animation = '';
                    }, 600);
                }
            });
        }, { threshold: 0.5 });
        
        icons.forEach(icon => {
            iconObserver.observe(icon);
        });
    };
    
    
    // ========================================
    // 10. BACKGROUND GRADIENT ANIMATION
    // ========================================
    const initGradientAnimation = () => {
        const gradientElements = document.querySelectorAll('[data-gradient-animate]');
        
        gradientElements.forEach(element => {
            element.style.backgroundSize = '200% 200%';
            element.style.animation = 'gradientShift 3s ease infinite';
        });
    };
    
    
    // ========================================
    // 11. TYPING EFFECT
    // ========================================
    window.typeWriter = function(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    };
    
    
    // ========================================
    // 12. RIPPLE EFFECT ON CLICK
    // ========================================
    const initRippleEffect = () => {
        const rippleElements = document.querySelectorAll('[data-ripple], .btn');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    };
    
    
    // ========================================
    // 13. IMAGE ZOOM ON HOVER
    // ========================================
    const initImageZoom = () => {
        const zoomImages = document.querySelectorAll('[data-zoom], .project-img-wrapper img, .news-card img');
        
        zoomImages.forEach(img => {
            const wrapper = img.parentElement;
            wrapper.style.overflow = 'hidden';
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    };
    
    
    // ========================================
    // 14. SCROLL PROGRESS INDICATOR
    // ========================================
    const initScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #2BB6E0, #8B4FBF);
            width: 0%;
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    };
    
    
    // ========================================
    // 15. INITIALIZE ALL ANIMATIONS
    // ========================================
    function initAllAnimations() {
        initScrollReveal();
        initCounterAnimations();
        initParallax();
        initFadeIn();
        initStaggerAnimation();
        initTiltEffect();
        initCardEntrances();
        initProgressBars();
        initIconPulse();
        initGradientAnimation();
        initRippleEffect();
        initImageZoom();
        initScrollProgress();
        
        console.log('✨ All animations initialized');
    }
    
    
    // ========================================
    // 16. THROTTLE HELPER
    // ========================================
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllAnimations);
    } else {
        initAllAnimations();
    }
    
})();


// ========================================
// ANIMATION KEYFRAMES CSS
// ========================================
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    /* Fade Animations */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* Scale Animations */
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Bounce Animation */
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Card Entrance */
    @keyframes cardEntrance {
        from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    /* Pulse Animation */
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    /* Icon Pulse */
    @keyframes iconPulse {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(1.15);
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
    
    /* Gradient Shift */
    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
    
    /* Float Animation */
    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }
    
    /* Rotate Animation */
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    /* Slide Animations */
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInBottom {
        from {
            opacity: 0;
            transform: translateY(100%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Ripple Effect */
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Fade In Visible Class */
    .fade-in.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    /* Utility Classes */
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Loading State */
    .loading-pulse {
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    /* Hover Animations */
    .hover-lift {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .hover-lift:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }
    
    .hover-grow {
        transition: transform 0.3s ease;
    }
    
    .hover-grow:hover {
        transform: scale(1.05);
    }
    
    .hover-glow {
        transition: box-shadow 0.3s ease;
    }
    
    .hover-glow:hover {
        box-shadow: 0 0 20px rgba(43, 182, 224, 0.5);
    }
`;
document.head.appendChild(animationStyles);
('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.transition = 'transform 0.5s ease';
            });
            
            img.addEventListener