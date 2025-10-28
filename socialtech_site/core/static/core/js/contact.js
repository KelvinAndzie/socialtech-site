// ============================================
// CONTACT.JS - Contact Page Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. FORM VALIDATION & SUBMISSION
    // ========================================
    const contactForm = document.querySelector('form[method="post"]');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch(this.action || window.location.href, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });
                
                if (response.ok) {
                    // Success
                    showNotification('success', '✓ Message sent successfully! We\'ll get back to you soon.');
                    this.reset();
                    this.classList.remove('was-validated');
                } else {
                    // Error
                    showNotification('danger', '✗ Oops! Something went wrong. Please try again.');
                }
            } catch (error) {
                showNotification('danger', '✗ Network error. Please check your connection.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    
    // ========================================
    // 2. REAL-TIME FIELD VALIDATION
    // ========================================
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // Name validation
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            if (this.value.trim().length < 2) {
                showFieldError(this, 'Name must be at least 2 characters');
            } else {
                removeFieldError(this);
            }
        });
    }
    
    // Email validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.value)) {
                showFieldError(this, 'Please enter a valid email address');
            } else {
                removeFieldError(this);
            }
        });
    }
    
    // Phone validation (optional but format if present)
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove all non-numeric characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Format: +233 XX XXX XXXX
            if (value.length > 0) {
                if (value.startsWith('233')) {
                    value = '+' + value.slice(0, 3) + ' ' + 
                            value.slice(3, 5) + ' ' + 
                            value.slice(5, 8) + ' ' + 
                            value.slice(8, 12);
                } else if (value.startsWith('0')) {
                    value = '+233 ' + value.slice(1, 3) + ' ' + 
                            value.slice(3, 6) + ' ' + 
                            value.slice(6, 10);
                }
            }
            
            e.target.value = value.trim();
        });
    }
    
    // Subject validation
    if (subjectInput) {
        subjectInput.addEventListener('blur', function() {
            if (this.value.trim().length < 5) {
                showFieldError(this, 'Subject must be at least 5 characters');
            } else {
                removeFieldError(this);
            }
        });
    }
    
    // Message validation with character counter
    if (messageInput) {
        const charCounter = document.createElement('small');
        charCounter.className = 'form-text text-muted';
        messageInput.parentElement.appendChild(charCounter);
        
        messageInput.addEventListener('input', function() {
            const length = this.value.length;
            const maxLength = 500;
            charCounter.textContent = `${length}/${maxLength} characters`;
            
            if (length > maxLength) {
                charCounter.classList.add('text-danger');
                charCounter.classList.remove('text-muted');
            } else {
                charCounter.classList.add('text-muted');
                charCounter.classList.remove('text-danger');
            }
        });
        
        messageInput.addEventListener('blur', function() {
            if (this.value.trim().length < 10) {
                showFieldError(this, 'Message must be at least 10 characters');
            } else {
                removeFieldError(this);
            }
        });
    }
    
    
    // ========================================
    // 3. SHOW/HIDE FIELD ERRORS
    // ========================================
    function showFieldError(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        let errorDiv = input.parentElement.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            input.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }
    
    function removeFieldError(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        
        const errorDiv = input.parentElement.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    
    // ========================================
    // 4. NOTIFICATION SYSTEM
    // ========================================
    function showNotification(type, message) {
        // Remove existing notifications
        const existing = document.querySelector('.custom-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show custom-notification`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 350px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    
    // ========================================
    // 5. SOCIAL MEDIA BUTTON ANIMATIONS
    // ========================================
    const socialButtons = document.querySelectorAll('.btn-outline-primary');
    
    socialButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) rotate(5deg)';
            this.style.transition = 'all 0.3s ease';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
    
    
    // ========================================
    // 6. COPY CONTACT INFO TO CLIPBOARD
    // ========================================
    const contactInfoItems = document.querySelectorAll('.text-muted');
    
    contactInfoItems.forEach(item => {
        // Only for email, phone, address
        if (item.textContent.includes('@') || 
            item.textContent.includes('+233') || 
            item.textContent.includes('Accra')) {
            
            item.style.cursor = 'pointer';
            item.title = 'Click to copy';
            
            item.addEventListener('click', function() {
                const text = this.textContent.trim();
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        showNotification('success', `✓ Copied: ${text}`);
                        
                        // Visual feedback
                        const originalColor = this.style.color;
                        this.style.color = '#2BB6E0';
                        setTimeout(() => {
                            this.style.color = originalColor;
                        }, 300);
                    });
                }
            });
        }
    });
    
    
    // ========================================
    // 7. OFFICE HOURS LIVE STATUS
    // ========================================
    function updateOfficeStatus() {
        const workingHoursElement = document.querySelector('.text-muted.mb-0:last-of-type');
        
        if (workingHoursElement && workingHoursElement.textContent.includes('Mon - Fri')) {
            const now = new Date();
            const day = now.getDay(); // 0 = Sunday, 6 = Saturday
            const hour = now.getHours();
            
            const isWeekday = day >= 1 && day <= 5;
            const isWorkingHours = hour >= 9 && hour < 18;
            
            const statusBadge = document.createElement('span');
            statusBadge.className = 'badge ms-2';
            statusBadge.style.fontSize = '0.75rem';
            
            if (isWeekday && isWorkingHours) {
                statusBadge.classList.add('bg-success');
                statusBadge.textContent = '● Open Now';
            } else {
                statusBadge.classList.add('bg-danger');
                statusBadge.textContent = '● Closed';
            }
            
            // Add badge if not already present
            if (!workingHoursElement.querySelector('.badge')) {
                workingHoursElement.appendChild(statusBadge);
            }
        }
    }
    
    updateOfficeStatus();
    
    
    // ========================================
    // 8. INTERACTIVE MAP PLACEHOLDER
    // ========================================
    const mapPlaceholder = document.querySelector('.bg-secondary.text-white');
    
    if (mapPlaceholder) {
        mapPlaceholder.style.cursor = 'pointer';
        
        mapPlaceholder.addEventListener('click', function() {
            // Open Google Maps in new tab
            const address = encodeURIComponent('123 Tech Street, Accra, Ghana');
            window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
        });
        
        mapPlaceholder.addEventListener('mouseenter', function() {
            this.style.opacity = '0.9';
            this.style.transition = 'opacity 0.3s ease';
        });
        
        mapPlaceholder.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
        
        // Add hover text
        const hoverText = document.createElement('p');
        hoverText.textContent = 'Click to open in Google Maps';
        hoverText.className = 'mt-2';
        hoverText.style.fontSize = '0.9rem';
        mapPlaceholder.querySelector('.text-center').appendChild(hoverText);
    }
    
    
    // ========================================
    // 9. FORM AUTO-SAVE TO LOCAL STORAGE
    // ========================================
    const formFields = [nameInput, emailInput, phoneInput, subjectInput, messageInput].filter(Boolean);
    
    // Load saved data on page load
    formFields.forEach(field => {
        const savedValue = localStorage.getItem(`contact_${field.id}`);
        if (savedValue) {
            field.value = savedValue;
        }
        
        // Save on input
        field.addEventListener('input', function() {
            localStorage.setItem(`contact_${this.id}`, this.value);
        });
    });
    
    // Clear saved data on successful submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Clear localStorage after successful submission
            setTimeout(() => {
                formFields.forEach(field => {
                    localStorage.removeItem(`contact_${field.id}`);
                });
            }, 2000);
        });
    }
    
    
    // ========================================
    // 10. CONTACT INFO CARD HOVER EFFECTS
    // ========================================
    const contactCards = document.querySelectorAll('.card.border-0.shadow-sm');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 15px 40px rgba(43, 182, 224, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    
    // ========================================
    // 11. ICON ANIMATIONS ON SCROLL
    // ========================================
    const iconBoxes = document.querySelectorAll('.bg-primary.text-white.rounded');
    
    const iconObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'bounceIn 0.6s ease';
                iconObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    iconBoxes.forEach(icon => {
        iconObserver.observe(icon);
    });
    
    
    // ========================================
    // 12. TYPING INDICATOR FOR MESSAGE FIELD
    // ========================================
    if (messageInput) {
        let typingTimer;
        const typingIndicator = document.createElement('small');
        typingIndicator.className = 'text-muted fst-italic';
        typingIndicator.style.display = 'none';
        typingIndicator.innerHTML = '<i class="fas fa-pen me-1"></i>Typing...';
        messageInput.parentElement.appendChild(typingIndicator);
        
        messageInput.addEventListener('input', function() {
            clearTimeout(typingTimer);
            typingIndicator.style.display = 'block';
            
            typingTimer = setTimeout(() => {
                typingIndicator.style.display = 'none';
            }, 1000);
        });
    }
    
    
    // ========================================
    // 13. EMAIL VALIDATION WITH SUGGESTIONS
    // ========================================
    if (emailInput) {
        const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
        
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const parts = email.split('@');
            
            if (parts.length === 2) {
                const domain = parts[1].toLowerCase();
                
                // Check for common typos
                commonDomains.forEach(correctDomain => {
                    if (levenshteinDistance(domain, correctDomain) === 1) {
                        const suggestion = `${parts[0]}@${correctDomain}`;
                        if (confirm(`Did you mean: ${suggestion}?`)) {
                            this.value = suggestion;
                        }
                    }
                });
            }
        });
    }
    
    // Levenshtein distance for typo detection
    function levenshteinDistance(a, b) {
        const matrix = [];
        
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[b.length][a.length];
    }
    
    
    // ========================================
    // 14. CONSOLE EASTER EGG
    // ========================================
    console.log('%c📞 Contact Us!', 'color: #2BB6E0; font-size: 18px; font-weight: bold;');
    console.log('%cWe love hearing from our community!', 'color: #8B4FBF; font-size: 14px;');
    console.log('%cEmail: info@socialtech.com | Phone: +233 54 779 9034', 'color: #333; font-size: 12px;');
    
});


// ========================================
// ADD ANIMATION CSS DYNAMICALLY
// ========================================
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .form-control.is-valid {
        border-color: #28a745;
        padding-right: calc(1.5em + 0.75rem);
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right calc(0.375em + 0.1875rem) center;
        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
`;
document.head.appendChild(style);