// SocialTech Innovations - Main JavaScript
// Community-Driven Technology for Social Impact

(function() {
    'use strict';
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    document.addEventListener('DOMContentLoaded', function() {
        try {
            initializeNavbar();
            initializeSmoothScroll();
            initializeForms();
            initializeAlerts();
            initializeScrollAnimations();
            initializeFileInputs();
            initializeBackToTop();
            initializeCounters();
            
            console.log('✅ SocialTech Website Loaded Successfully!');
        } catch (error) {
            console.error('❌ SocialTech JS Error:', error);
        }
    });

    // ===== NAVBAR FUNCTIONALITY =====
    function initializeNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        const handleScroll = debounce(function() {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-lg');
            } else {
                navbar.classList.remove('shadow-lg');
                navbar.classList.add('shadow-sm');
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
    }

    // ===== SMOOTH SCROLL =====
    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });
    }

    // ===== FORM HANDLING =====
    function initializeForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Form validation
            form.addEventListener('submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
                
                // Prevent double submission
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn && form.checkValidity()) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';
                    
                    // Re-enable after 3 seconds as fallback
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
                    }, 3000);
                }
            });
            
            // Store original button text
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
            }
        });
    }

    // ===== AUTO-DISMISS ALERTS =====
    function initializeAlerts() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (!alert.classList.contains('alert-permanent')) {
                setTimeout(() => {
                    if (typeof bootstrap !== 'undefined') {
                        const bsAlert = new bootstrap.Alert(alert);
                        bsAlert.close();
                    } else {
                        alert.style.transition = 'opacity 0.5s';
                        alert.style.opacity = '0';
                        setTimeout(() => alert.remove(), 500);
                    }
                }, 5000);
            }
        });
    }

    // ===== SCROLL ANIMATIONS =====
    function initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe cards and sections
        document.querySelectorAll('.card, section').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== FILE INPUT DISPLAY =====
    function initializeFileInputs() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', function(e) {
                const fileName = e.target.files[0]?.name;
                if (fileName) {
                    // Create or update file name display
                    let fileNameDisplay = input.nextElementSibling;
                    if (!fileNameDisplay || !fileNameDisplay.classList.contains('file-name-display')) {
                        fileNameDisplay = document.createElement('small');
                        fileNameDisplay.classList.add('text-muted', 'file-name-display', 'd-block', 'mt-1');
                        input.parentNode.appendChild(fileNameDisplay);
                    }
                    fileNameDisplay.innerHTML = `<i class="fas fa-file me-1"></i>Selected: ${fileName}`;
                }
            });
        });
    }

    // ===== BACK TO TOP BUTTON =====
    function initializeBackToTop() {
        const backToTop = createBackToTopButton();
        document.body.appendChild(backToTop);
        
        const handleScroll = debounce(function() {
            if (window.scrollY > 300) {
                backToTop.style.display = 'flex';
                backToTop.style.opacity = '1';
            } else {
                backToTop.style.opacity = '0';
                setTimeout(() => {
                    if (window.scrollY <= 300) {
                        backToTop.style.display = 'none';
                    }
                }, 300);
            }
        }, 50);
        
        window.addEventListener('scroll', handleScroll);
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function createBackToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.className = 'btn btn-primary position-fixed rounded-circle d-flex align-items-center justify-content-center';
        button.setAttribute('aria-label', 'Back to top');
        button.setAttribute('title', 'Back to top');
        button.style.cssText = `
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            display: none;
            opacity: 0;
            z-index: 1000;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            border: none;
        `;
        
        // Hover effect
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        });
        
        return button;
    }

    // ===== COUNTER ANIMATION =====
    function initializeCounters() {
        const counters = document.querySelectorAll('h2, .counter');
        
        counters.forEach(counter => {
            const text = counter.textContent.trim();
            
            // Match numbers with optional + or K/M suffix
            const match = text.match(/^(\d+)([+KM]*)$/);
            if (!match) return;
            
            const target = parseInt(match[1]);
            const suffix = match[2] || '';
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            let hasAnimated = false;
            
            const observerCounter = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        hasAnimated = true;
                        
                        const updateCounter = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                counter.textContent = target + suffix;
                                clearInterval(updateCounter);
                            } else {
                                counter.textContent = Math.floor(current) + suffix;
                            }
                        }, duration / steps);
                        
                        observerCounter.unobserve(counter);
                    }
                });
            }, {
                threshold: 0.5
            });
            
            observerCounter.observe(counter);
        });
    }

    // ===== PARALLAX EFFECT (Optional) =====
    if (window.innerWidth > 768) {
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const handleParallax = debounce(function() {
                const scrolled = window.pageYOffset;
                hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
            }, 10);
            
            window.addEventListener('scroll', handleParallax);
        }
    }

    // ===== NAVBAR ACTIVE STATE ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        const navHighlighter = debounce(function() {
            let scrollY = window.pageYOffset;
            
            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 100;
                const sectionId = current.getAttribute('id');
                
                const navLink = document.querySelector('.nav-link[href*="' + sectionId + '"]');
                if (navLink) {
                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        navLink.classList.add('active');
                    } else {
                        navLink.classList.remove('active');
                    }
                }
            });
        }, 50);
        
        window.addEventListener('scroll', navHighlighter);
    }

    // ===== LAZY LOAD IMAGES (for better performance) =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

})();