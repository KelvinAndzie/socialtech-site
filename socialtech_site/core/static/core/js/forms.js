// ============================================
// FORMS.JS - Global Form Validation & Handling
// All form-related functionality
// ============================================

(function() {
    'use strict';
    
    // ========================================
    // 1. BOOTSTRAP FORM VALIDATION
    // ========================================
    const initBootstrapValidation = () => {
        const forms = document.querySelectorAll('.needs-validation');
        
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                
                form.classList.add('was-validated');
            }, false);
        });
    };
    
    
    // ========================================
    // 2. REAL-TIME EMAIL VALIDATION
    // ========================================
    const initEmailValidation = () => {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        
        emailInputs.forEach(input => {
            input.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (this.value && !emailRegex.test(this.value)) {
                    this.classList.add('is-invalid');
                    showFieldError(this, 'Please enter a valid email address');
                } else if (this.value) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                    removeFieldError(this);
                }
            });
            
            // Remove error on input
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                    removeFieldError(this);
                }
            });
        });
    };
    
    
    // ========================================
    // 3. PHONE NUMBER FORMATTING
    // ========================================
    const initPhoneFormatting = () => {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
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
        });
    };
    
    
    // ========================================
    // 4. PASSWORD STRENGTH INDICATOR
    // ========================================
    const initPasswordStrength = () => {
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        
        passwordInputs.forEach(input => {
            // Create strength indicator
            const strengthDiv = document.createElement('div');
            strengthDiv.className = 'password-strength mt-2';
            strengthDiv.innerHTML = `
                <div class="progress" style="height: 5px;">
                    <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                </div>
                <small class="text-muted strength-text">Enter a password</small>
            `;
            input.parentElement.appendChild(strengthDiv);
            
            const progressBar = strengthDiv.querySelector('.progress-bar');
            const strengthText = strengthDiv.querySelector('.strength-text');
            
            input.addEventListener('input', function() {
                const password = this.value;
                const strength = calculatePasswordStrength(password);
                
                // Update progress bar
                progressBar.style.width = strength.percent + '%';
                progressBar.className = 'progress-bar bg-' + strength.color;
                strengthText.textContent = strength.text;
                strengthText.className = 'text-' + strength.color + ' small';
            });
        });
    };
    
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 15;
        if (/[a-z]/.test(password)) strength += 15;
        if (/[A-Z]/.test(password)) strength += 15;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^A-Za-z0-9]/.test(password)) strength += 15;
        
        if (strength < 40) {
            return { percent: strength, color: 'danger', text: 'Weak password' };
        } else if (strength < 70) {
            return { percent: strength, color: 'warning', text: 'Medium password' };
        } else {
            return { percent: strength, color: 'success', text: 'Strong password' };
        }
    }
    
    
    // ========================================
    // 5. CHARACTER COUNTER FOR TEXTAREAS
    // ========================================
    const initCharacterCounter = () => {
        const textareas = document.querySelectorAll('textarea[maxlength], textarea[data-max-chars]');
        
        textareas.forEach(textarea => {
            const maxLength = textarea.getAttribute('maxlength') || textarea.getAttribute('data-max-chars');
            
            if (maxLength) {
                const counter = document.createElement('small');
                counter.className = 'form-text text-muted character-counter';
                textarea.parentElement.appendChild(counter);
                
                const updateCounter = () => {
                    const current = textarea.value.length;
                    counter.textContent = `${current} / ${maxLength} characters`;
                    
                    if (current > maxLength * 0.9) {
                        counter.classList.add('text-warning');
                        counter.classList.remove('text-muted');
                    } else {
                        counter.classList.add('text-muted');
                        counter.classList.remove('text-warning');
                    }
                };
                
                textarea.addEventListener('input', updateCounter);
                updateCounter();
            }
        });
    };
    
    
    // ========================================
    // 6. FILE UPLOAD VALIDATION
    // ========================================
    const initFileUploadValidation = () => {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            const acceptedTypes = input.getAttribute('accept')?.split(',') || [];
            const maxSize = parseInt(input.getAttribute('data-max-size')) || 5 * 1024 * 1024; // 5MB default
            
            // Create file info display
            const fileInfo = document.createElement('small');
            fileInfo.className = 'form-text text-muted file-info';
            input.parentElement.appendChild(fileInfo);
            
            input.addEventListener('change', function() {
                const file = this.files[0];
                
                if (!file) {
                    fileInfo.textContent = '';
                    return;
                }
                
                // Validate file type
                if (acceptedTypes.length > 0) {
                    const fileType = '.' + file.name.split('.').pop();
                    const isValidType = acceptedTypes.some(type => 
                        type.trim() === fileType || 
                        file.type.includes(type.trim().replace('.', ''))
                    );
                    
                    if (!isValidType) {
                        this.value = '';
                        fileInfo.className = 'form-text text-danger';
                        fileInfo.textContent = `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`;
                        return;
                    }
                }
                
                // Validate file size
                if (file.size > maxSize) {
                    this.value = '';
                    fileInfo.className = 'form-text text-danger';
                    fileInfo.textContent = `File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(2)}MB`;
                    return;
                }
                
                // Show file info
                fileInfo.className = 'form-text text-success';
                fileInfo.textContent = `✓ ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
            });
        });
    };
    
    
    // ========================================
    // 7. FORM AUTO-SAVE (LocalStorage)
    // ========================================
    const initFormAutoSave = () => {
        const autoSaveForms = document.querySelectorAll('[data-autosave]');
        
        autoSaveForms.forEach(form => {
            const formId = form.id || 'form_' + Date.now();
            const storageKey = 'autosave_' + formId;
            
            // Load saved data
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    Object.keys(data).forEach(key => {
                        const input = form.querySelector(`[name="${key}"]`);
                        if (input && input.type !== 'password') {
                            input.value = data[key];
                        }
                    });
                    
                    // Show restore notification
                    showFormNotification(form, 'info', 'Form data restored from previous session');
                } catch (e) {
                    console.error('Failed to restore form data:', e);
                }
            }
            
            // Save on input
            form.addEventListener('input', debounce(function(e) {
                if (e.target.type === 'password') return;
                
                const formData = new FormData(form);
                const data = {};
                
                for (let [key, value] of formData.entries()) {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input && input.type !== 'password') {
                        data[key] = value;
                    }
                }
                
                localStorage.setItem(storageKey, JSON.stringify(data));
            }, 1000));
            
            // Clear on submit
            form.addEventListener('submit', function() {
                localStorage.removeItem(storageKey);
            });
        });
    };
    
    
    // ========================================
    // 8. AJAX FORM SUBMISSION
    // ========================================
    window.submitFormAjax = async function(form, successCallback, errorCallback) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Disable button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
        
        try {
            const response = await fetch(form.action || window.location.href, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            
            if (response.ok) {
                const data = await response.json().catch(() => ({}));
                
                if (successCallback) {
                    successCallback(data);
                } else {
                    showFormNotification(form, 'success', 'Form submitted successfully!');
                    form.reset();
                    form.classList.remove('was-validated');
                }
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            if (errorCallback) {
                errorCallback(error);
            } else {
                showFormNotification(form, 'danger', 'Submission failed. Please try again.');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    };
    
    
    // ========================================
    // 9. FORM FIELD HELPERS
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
        const errorDiv = input.parentElement.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function showFormNotification(form, type, message) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        form.insertAdjacentElement('beforebegin', notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    
    // ========================================
    // 10. CONFIRM BEFORE SUBMIT
    // ========================================
    const initConfirmSubmit = () => {
        const confirmForms = document.querySelectorAll('[data-confirm]');
        
        confirmForms.forEach(form => {
            const message = form.getAttribute('data-confirm') || 'Are you sure you want to submit this form?';
            
            form.addEventListener('submit', function(e) {
                if (!confirm(message)) {
                    e.preventDefault();
                }
            });
        });
    };
    
    
    // ========================================
    // 11. DYNAMIC FORM FIELDS
    // ========================================
    window.addFormField = function(containerId, fieldHtml) {
        const container = document.getElementById(containerId);
        if (container) {
            const wrapper = document.createElement('div');
            wrapper.className = 'dynamic-field mb-3';
            wrapper.innerHTML = fieldHtml;
            container.appendChild(wrapper);
        }
    };
    
    window.removeFormField = function(button) {
        const field = button.closest('.dynamic-field');
        if (field) {
            field.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => field.remove(), 300);
        }
    };
    
    
    // ========================================
    // 12. DEBOUNCE HELPER
    // ========================================
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
    
    
    // ========================================
    // 13. INITIALIZE ALL FORM FEATURES
    // ========================================
    function initAllFormFeatures() {
        initBootstrapValidation();
        initEmailValidation();
        initPhoneFormatting();
        initPasswordStrength();
        initCharacterCounter();
        initFileUploadValidation();
        initFormAutoSave();
        initConfirmSubmit();
        
        console.log('📝 All form features initialized');
    }
    
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllFormFeatures);
    } else {
        initAllFormFeatures();
    }
    
    
    // Export functions globally
    window.FormHelpers = {
        showFieldError,
        removeFieldError,
        showFormNotification,
        calculatePasswordStrength
    };
    
})();


// ========================================
// FORM STYLES
// ========================================
const formStyles = document.createElement('style');
formStyles.textContent = `
    /* Form validation styles */
    .was-validated .form-control:valid,
    .form-control.is-valid {
        border-color: #28a745;
        padding-right: calc(1.5em + 0.75rem);
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right calc(0.375em + 0.1875rem) center;
        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    
    .was-validated .form-control:invalid,
    .form-control.is-invalid {
        border-color: #dc3545;
    }
    
    /* Password strength indicator */
    .password-strength .progress {
        border-radius: 3px;
        overflow: hidden;
    }
    
    .password-strength .progress-bar {
        transition: width 0.3s ease, background-color 0.3s ease;
    }
    
    /* File upload styles */
    .file-info {
        display: block;
        margin-top: 0.5rem;
    }
    
    /* Character counter */
    .character-counter {
        display: block;
        text-align: right;
        margin-top: 0.25rem;
    }
    
    /* Form animations */
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    /* Loading state for buttons */
    button[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
    }
    
    /* Focus styles */
    .form-control:focus,
    .form-select:focus {
        border-color: #2BB6E0;
        box-shadow: 0 0 0 0.2rem rgba(43, 182, 224, 0.25);
    }
`;
document.head.appendChild(formStyles);