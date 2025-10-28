// ============================================
// MAIN.JS - Core Global Functionality
// Loaded on ALL pages
// ============================================

(function() {
    'use strict';
    
    // ========================================
    // 1. NAVIGATION BAR SCROLL EFFECT
    // ========================================
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add background when scrolled
            if (currentScroll > 50) {
                navbar.classList.add('navbar-scrolled');
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.classList.remove('navbar-scrolled');
                navbar.style.backgroundColor = '';
                navbar.style.boxShadow = '';
            }
            
            // Hide/show navbar on scroll
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
        
        // Smooth transition
        navbar.style.transition = 'all 0.3s ease';
    }
    
    
    // ========================================
    // 2. MOBILE MENU TOGGLE
    // ========================================
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            const isClickInside = navbarToggler.contains(e.target) || navbarCollapse.contains(e.target);
            
            if (!isClickInside && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
        
        // Close menu when clicking nav link (mobile)
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
    
    
    // ========================================
    // 3. BACK TO TOP BUTTON
    // ========================================
    function createBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.id = 'back-to-top';
        backToTop.className = 'btn btn-primary';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 999;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(43, 182, 224, 0.4);
            transition: all 0.3s ease;
            border: none;
        `;
        
        document.body.appendChild(backToTop);
        
        // Show/hide based on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
                backToTop.style.animation = 'fadeInUp 0.3s ease';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        // Scroll to top on click
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effect
        backToTop.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        backToTop.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    createBackToTopButton();
    
    
    // ========================================
    // 4. SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors or just '#'
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // ========================================
    // 5. ACTIVE NAVIGATION LINK HIGHLIGHT
    // ========================================
    function updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
                link.classList.add('active');
                link.style.color = '#2BB6E0';
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    updateActiveNavLink();
    
    
    // ========================================
    // 6. LOADING SPINNER
    // ========================================
    function createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.id = 'page-loader';
        spinner.innerHTML = `
            <div class="spinner-wrapper">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading...</p>
            </div>
        `;
        spinner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(spinner);
        
        // Hide when page loads
        window.addEventListener('load', function() {
            spinner.style.opacity = '0';
            setTimeout(() => spinner.remove(), 300);
        });
    }
    
    // Only show spinner if page takes longer than 500ms to load
    const loaderTimeout = setTimeout(createLoadingSpinner, 500);
    window.addEventListener('load', function() {
        clearTimeout(loaderTimeout);
    });
    
    
    // ========================================
    // 7. LAZY LOAD IMAGES
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    
                    img.onload = function() {
                        img.style.opacity = '1';
                    };
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    
    // ========================================
    // 8. EXTERNAL LINKS OPEN IN NEW TAB
    // ========================================
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Add external link icon
            if (!link.querySelector('.fa-external-link-alt')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-external-link-alt ms-1';
                icon.style.fontSize = '0.8em';
                link.appendChild(icon);
            }
        }
    });
    
    
    // ========================================
    // 9. DETECT MOBILE DEVICE
    // ========================================
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    if (isMobile()) {
        document.body.classList.add('mobile-device');
    }
    
    
    // ========================================
    // 10. ACCESSIBILITY - KEYBOARD NAVIGATION
    // ========================================
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                bootstrap.Modal.getInstance(modal)?.hide();
            });
        }
        
        // Tab trap for modals
        if (e.key === 'Tab') {
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                const focusableElements = activeModal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
    
    
    // ========================================
    // 11. COPY TO CLIPBOARD HELPER
    // ========================================
    window.copyToClipboard = function(text, successMessage = 'Copied to clipboard!') {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showGlobalNotification('success', successMessage);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                showGlobalNotification('success', successMessage);
            } catch (err) {
                console.error('Fallback copy failed:', err);
            }
            
            document.body.removeChild(textarea);
        }
    };
    
    
    // ========================================
    // 12. GLOBAL NOTIFICATION SYSTEM
    // ========================================
    window.showGlobalNotification = function(type, message, duration = 4000) {
        // Remove existing notifications
        const existing = document.querySelectorAll('.global-notification');
        existing.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show global-notification`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                <div>${message}</div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    };
    
    
    // ========================================
    // 13. FORM CSRF TOKEN HELPER
    // ========================================
    window.getCSRFToken = function() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    };
    
    
    // ========================================
    // 14. DETECT SLOW INTERNET CONNECTION
    // ========================================
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection && connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.body.classList.add('slow-connection');
            showGlobalNotification('warning', 'Slow connection detected. Some features may be limited.', 6000);
        }
    }
    
    
    // ========================================
    // 15. PRINT PAGE HELPER
    // ========================================
    window.printPage = function() {
        window.print();
    };
    
    
    // ========================================
    // 16. DEBOUNCE HELPER (Exported globally)
    // ========================================
    window.debounce = function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    
    // ========================================
    // 17. THROTTLE HELPER (Exported globally)
    // ========================================
    window.throttle = function(func, limit) {
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
    };
    
    
    // ========================================
    // 18. INITIALIZE ALL ON DOM READY
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        console.log('%c🚀 SocialTech Innovations', 'color: #2BB6E0; font-size: 24px; font-weight: bold;');
        console.log('%cEmpowering communities through technology', 'color: #8B4FBF; font-size: 14px;');
        console.log('%c→ Website loaded successfully!', 'color: #28a745; font-size: 12px;');
        
        // Add loaded class to body
        document.body.classList.add('page-loaded');
    });
    
    
    // ========================================
    // 19. ERROR HANDLING
    // ========================================
    window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.error);
        // In production, you could send this to an error tracking service
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
    });
    
})();


// ========================================
// ADD GLOBAL ANIMATION STYLES
// ========================================
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .navbar {
        transition: all 0.3s ease !important;
    }
    
    #back-to-top:hover {
        transform: translateY(-5px) scale(1.1) !important;
    }
    
    /* Smooth scroll behavior */
    html {
        scroll-behavior: smooth;
    }
    
    /* Focus visible for accessibility */
    *:focus-visible {
        outline: 2px solid #2BB6E0;
        outline-offset: 2px;
    }
    
    /* Mobile-specific adjustments */
    .mobile-device .card {
        transition: none !important;
    }
    
    /* Slow connection adjustments */
    .slow-connection img {
        filter: blur(5px);
        transition: filter 0.3s;
    }
    
    .slow-connection img.loaded {
        filter: none;
    }
`;
document.head.appendChild(globalStyles);