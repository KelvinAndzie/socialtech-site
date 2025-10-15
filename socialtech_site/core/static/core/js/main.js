// SocialTech Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow');
        } else {
            navbar.classList.remove('shadow');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
    
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
    
    // Animate elements on scroll
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
    
    // File input display name
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name;
            if (fileName) {
                const label = this.nextElementSibling;
                if (label && label.classList.contains('form-label')) {
                    label.textContent = `Selected: ${fileName}`;
                }
            }
        });
    });
    
    // Back to top button
    const backToTop = createBackToTopButton();
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Counter animation for stats
    const counters = document.querySelectorAll('h2');
    counters.forEach(counter => {
        const text = counter.textContent;
        if (text.match(/^\d+\+?$/)) {
            const target = parseInt(text);
            const increment = target / 50;
            let current = 0;
            
            const observerCounter = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const updateCounter = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                counter.textContent = text;
                                clearInterval(updateCounter);
                            } else {
                                counter.textContent = Math.floor(current) + (text.includes('+') ? '+' : '');
                            }
                        }, 20);
                        observerCounter.unobserve(counter);
                    }
                });
            });
            
            observerCounter.observe(counter);
        }
    });
    
    // Navbar active link highlight based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', navHighlighter);
    
    function navHighlighter() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-link[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-link[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    }
    
    // Prevent form double submission
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            }
        });
    });
    
    console.log('SocialTech Website Loaded Successfully!');
});

// Helper function to create back to top button
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'btn btn-primary position-fixed rounded-circle';
    button.style.cssText = `
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    `;
    return button;
}