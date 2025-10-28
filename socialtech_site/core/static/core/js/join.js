// ============================================
// JOIN.JS - Join/Careers Page Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. FORM VALIDATION & SUBMISSION
    // ========================================
    const applicationForm = document.querySelector('form[method="post"]');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                showNotification('warning', '⚠️ Please fill in all required fields');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
            
            const formData = new FormData(this);
            
            try {
                // Check file size
                const resume = formData.get('resume');
                if (resume && resume.size > 5 * 1024 * 1024) {
                    throw new Error('Resume file size must be less than 5MB');
                }
                
                const response = await fetch(this.action || window.location.href, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });
                
                if (response.ok) {
                    // Success
                    showSuccessModal();
                    this.reset();
                    this.classList.remove('was-validated');
                } else {
                    // Error
                    showNotification('danger', '✗ Submission failed. Please try again.');
                }
            } catch (error) {
                showNotification('danger', '✗ ' + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    
    // ========================================
    // 2. REAL-TIME FIELD VALIDATION
    // ========================================
    const firstName = document.getElementById('first_name');
    const lastName = document.getElementById('last_name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const linkedin = document.getElementById('linkedin');
    const portfolio = document.getElementById('portfolio');
    const coverLetter = document.getElementById('cover_letter');
    const resume = document.getElementById('resume');
    
    // Name validation
    [firstName, lastName].forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                if (this.value.trim().length < 2) {
                    showFieldError(this, 'Name must be at least 2 characters');
                } else if (!/^[a-zA-Z\s-]+$/.test(this.value)) {
                    showFieldError(this, 'Name should only contain letters');
                } else {
                    removeFieldError(this);
                }
            });
            
            // Capitalize first letter as user types
            input.addEventListener('input', function() {
                this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
            });
        }
    });
    
    // Email validation with suggestions
    if (email) {
        email.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.value)) {
                showFieldError(this, 'Please enter a valid email address');
            } else {
                removeFieldError(this);
                checkEmailDomain(this);
            }
        });
    }
    
    // Phone validation and formatting
    if (phone) {
        phone.addEventListener('input', function(e) {
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
        
        phone.addEventListener('blur', function() {
            if (this.value && this.value.length < 10) {
                showFieldError(this, 'Please enter a valid phone number');
            } else {
                removeFieldError(this);
            }
        });
    }
    
    // LinkedIn URL validation
    if (linkedin) {
        linkedin.addEventListener('blur', function() {
            if (this.value && !this.value.includes('linkedin.com')) {
                showFieldError(this, 'Please enter a valid LinkedIn URL');
            } else {
                removeFieldError(this);
            }
        });
    }
    
    // Portfolio URL validation
    if (portfolio) {
        portfolio.addEventListener('blur', function() {
            if (this.value) {
                try {
                    new URL(this.value);
                    removeFieldError(this);
                } catch {
                    showFieldError(this, 'Please enter a valid URL');
                }
            }
        });
    }
    
    // Cover letter character counter
    if (coverLetter) {
        const minChars = 100;
        const maxChars = 1000;
        
        const counter = document.createElement('div');
        counter.className = 'form-text d-flex justify-content-between';
        counter.innerHTML = `
            <span id="char-count">0 / ${maxChars} characters</span>
            <span id="char-status" class="text-muted">Minimum ${minChars} characters</span>
        `;
        coverLetter.parentElement.appendChild(counter);
        
        coverLetter.addEventListener('input', function() {
            const length = this.value.length;
            const charCount = document.getElementById('char-count');
            const charStatus = document.getElementById('char-status');
            
            charCount.textContent = `${length} / ${maxChars} characters`;
            
            if (length < minChars) {
                charStatus.textContent = `${minChars - length} more characters needed`;
                charStatus.className = 'text-danger';
            } else if (length > maxChars) {
                charStatus.textContent = `${length - maxChars} characters over limit`;
                charStatus.className = 'text-danger';
            } else {
                charStatus.textContent = '✓ Good length';
                charStatus.className = 'text-success';
            }
        });
    }
    
    // Resume file validation
    if (resume) {
        const fileInfo = document.createElement('small');
        fileInfo.className = 'form-text text-muted mt-2';
        resume.parentElement.appendChild(fileInfo);
        
        resume.addEventListener('change', function() {
            const file = this.files[0];
            
            if (file) {
                const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                const maxSize = 5 * 1024 * 1024; // 5MB
                
                if (!validTypes.includes(file.type)) {
                    showFieldError(this, 'Please upload a PDF or DOC file');
                    this.value = '';
                    fileInfo.textContent = '';
                    return;
                }
                
                if (file.size > maxSize) {
                    showFieldError(this, 'File size must be less than 5MB');
                    this.value = '';
                    fileInfo.textContent = '';
                    return;
                }
                
                removeFieldError(this);
                fileInfo.textContent = `✓ ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                fileInfo.className = 'form-text text-success mt-2';
            }
        });
    }
    
    
    // ========================================
    // 3. POSITION SELECTOR WITH DYNAMIC SKILLS
    // ========================================
    const positionSelect = document.getElementById('position');
    
    if (positionSelect) {
        const skillsData = {
            'frontend': ['React', 'Vue.js', 'HTML/CSS', 'JavaScript', 'Responsive Design'],
            'backend': ['Python', 'Django', 'Node.js', 'PostgreSQL', 'REST APIs'],
            'fullstack': ['React', 'Django', 'PostgreSQL', 'Git', 'Docker'],
            'mobile': ['React Native', 'Flutter', 'iOS', 'Android', 'Mobile UI'],
            'designer': ['Figma', 'Adobe XD', 'UI Design', 'Prototyping', 'User Research'],
            'devops': ['Docker', 'AWS', 'CI/CD', 'Kubernetes', 'Linux'],
            'pm': ['Agile', 'Scrum', 'Jira', 'Stakeholder Management', 'Leadership']
        };
        
        positionSelect.addEventListener('change', function() {
            const position = this.value;
            
            // Remove existing skills section
            const existingSkills = document.getElementById('skills-section');
            if (existingSkills) existingSkills.remove();
            
            if (position && position !== 'other' && skillsData[position]) {
                const skillsSection = document.createElement('div');
                skillsSection.id = 'skills-section';
                skillsSection.className = 'col-12';
                skillsSection.innerHTML = `
                    <label class="form-label fw-bold">
                        <i class="fas fa-tools me-2"></i>Select Your Skills for ${this.options[this.selectedIndex].text}
                    </label>
                    <div class="row g-2">
                        ${skillsData[position].map(skill => `
                            <div class="col-md-4">
                                <div class="form-check">
                                    <input class="form-check-input skill-checkbox" type="checkbox" 
                                           name="skills[]" value="${skill}" id="skill-${skill.replace(/\s/g, '-')}">
                                    <label class="form-check-label" for="skill-${skill.replace(/\s/g, '-')}">
                                        ${skill}
                                    </label>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <small class="text-muted d-block mt-2">
                        <i class="fas fa-info-circle me-1"></i>Select all skills you're proficient in
                    </small>
                `;
                
                // Insert after portfolio field
                const portfolioRow = portfolio.closest('.col-12');
                portfolioRow.parentElement.insertBefore(skillsSection, portfolioRow.nextSibling);
                
                // Add animation
                skillsSection.style.animation = 'fadeInUp 0.5s ease';
            }
        });
    }
    
    
    // ========================================
    // 4. FORM PROGRESS TRACKER
    // ========================================
    function createProgressTracker() {
        const formCard = document.querySelector('.card-body.p-5:has(form)');
        
        if (formCard) {
            const progressBar = document.createElement('div');
            progressBar.className = 'mb-4';
            progressBar.innerHTML = `
                <div class="d-flex justify-content-between mb-2">
                    <small class="text-muted">Application Progress</small>
                    <small class="text-muted"><span id="progress-percent">0</span>% Complete</small>
                </div>
                <div class="progress" style="height: 8px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" 
                         role="progressbar" 
                         id="form-progress" 
                         style="width: 0%"></div>
                </div>
            `;
            
            const formTitle = formCard.querySelector('h3');
            formTitle.parentElement.insertBefore(progressBar, formTitle.nextSibling);
            
            // Update progress on input
            const requiredFields = applicationForm.querySelectorAll('[required]');
            
            function updateProgress() {
                let filled = 0;
                requiredFields.forEach(field => {
                    if (field.type === 'checkbox') {
                        if (field.checked) filled++;
                    } else if (field.type === 'file') {
                        if (field.files.length > 0) filled++;
                    } else {
                        if (field.value.trim()) filled++;
                    }
                });
                
                const percent = Math.round((filled / requiredFields.length) * 100);
                const progressBar = document.getElementById('form-progress');
                const progressPercent = document.getElementById('progress-percent');
                
                progressBar.style.width = percent + '%';
                progressPercent.textContent = percent;
                
                // Change color based on progress
                progressBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
                if (percent === 100) {
                    progressBar.classList.add('bg-success');
                } else if (percent >= 50) {
                    progressBar.classList.add('bg-info');
                } else {
                    progressBar.classList.add('bg-warning');
                }
            }
            
            requiredFields.forEach(field => {
                field.addEventListener('input', updateProgress);
                field.addEventListener('change', updateProgress);
            });
            
            updateProgress();
        }
    }
    
    createProgressTracker();
    
    
    // ========================================
    // 5. JOB CARDS HOVER EFFECTS
    // ========================================
    const jobCards = document.querySelectorAll('.py-5:has(.fw-bold:contains("Current Openings")) .card');
    
    jobCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
        card.style.cursor = 'pointer';
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(43, 182, 224, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
        
        // Add "Apply Now" button
        const cardBody = card.querySelector('.card-body');
        const applyBtn = document.createElement('button');
        applyBtn.className = 'btn btn-primary btn-sm mt-3 w-100';
        applyBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Apply for this Position';
        cardBody.appendChild(applyBtn);
        
        applyBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const jobTitle = card.querySelector('h5').textContent;
            prePopulateForm(jobTitle);
            
            // Scroll to form
            document.querySelector('form[method="post"]').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
        
        // Show full job description on click
        card.addEventListener('click', function() {
            showJobModal(this);
        });
    });
    
    function prePopulateForm(jobTitle) {
        const positionSelect = document.getElementById('position');
        
        // Map job titles to positions
        const positionMap = {
            'Full Stack Developer': 'fullstack',
            'UI/UX Designer': 'designer',
            'Frontend Developer': 'frontend',
            'Backend Developer': 'backend'
        };
        
        for (let [key, value] of Object.entries(positionMap)) {
            if (jobTitle.includes(key)) {
                positionSelect.value = value;
                positionSelect.dispatchEvent(new Event('change'));
                break;
            }
        }
        
        showNotification('info', `✓ Position pre-selected: ${jobTitle}`);
    }
    
    function showJobModal(card) {
        const title = card.querySelector('h5').textContent;
        const location = card.querySelector('.text-muted').textContent;
        const type = card.querySelector('.badge').textContent;
        const description = card.querySelector('p.text-muted').textContent;
        const skills = Array.from(card.querySelectorAll('.badge.bg-light'))
            .map(b => b.textContent);
        
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #2BB6E0, #8B4FBF);">
                        <h5 class="modal-title text-white">${title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <span class="text-muted">
                                <i class="fas fa-map-marker-alt me-2"></i>${location}
                            </span>
                            <span class="badge bg-primary">${type}</span>
                        </div>
                        
                        <h6 class="fw-bold mb-3">Job Description</h6>
                        <p>${description}</p>
                        
                        <h6 class="fw-bold mb-3 mt-4">Required Skills</h6>
                        <div class="d-flex gap-2 flex-wrap mb-4">
                            ${skills.map(s => `<span class="badge bg-light text-dark">${s}</span>`).join('')}
                        </div>
                        
                        <h6 class="fw-bold mb-3">Responsibilities</h6>
                        <ul>
                            <li>Develop and maintain high-quality software solutions</li>
                            <li>Collaborate with cross-functional teams</li>
                            <li>Participate in code reviews and technical discussions</li>
                            <li>Contribute to technical documentation</li>
                            <li>Stay updated with latest industry trends</li>
                        </ul>
                        
                        <h6 class="fw-bold mb-3">What We Offer</h6>
                        <ul>
                            <li>Competitive salary and benefits</li>
                            <li>Flexible working hours</li>
                            <li>Professional development opportunities</li>
                            <li>Collaborative work environment</li>
                            <li>Impactful projects with social missions</li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="applyForPosition('${title}')">
                            <i class="fas fa-paper-plane me-2"></i>Apply Now
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', function() {
            modal.remove();
        });
    }
    
    window.applyForPosition = function(jobTitle) {
        bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
        prePopulateForm(jobTitle);
        document.querySelector('form[method="post"]').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };
    
    
    // ========================================
    // 6. BENEFITS CARDS ANIMATIONS
    // ========================================
    const benefitCards = document.querySelectorAll('.hover-lift');
    
    benefitCards.forEach((card, index) => {
        card.style.transition = 'all 0.3s ease';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.05)';
            this.style.boxShadow = '0 20px 40px rgba(43, 182, 224, 0.3)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(360deg)';
                icon.style.transition = 'transform 0.6s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    
    // ========================================
    // 7. EMAIL DOMAIN CHECKER
    // ========================================
    function checkEmailDomain(emailInput) {
        const email = emailInput.value.toLowerCase();
        const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
        const parts = email.split('@');
        
        if (parts.length === 2) {
            const domain = parts[1];
            
            // Check for common typos
            commonDomains.forEach(correctDomain => {
                if (levenshteinDistance(domain, correctDomain) === 1) {
                    const suggestion = `${parts[0]}@${correctDomain}`;
                    
                    const suggestionDiv = document.createElement('small');
                    suggestionDiv.className = 'text-warning d-block mt-1';
                    suggestionDiv.innerHTML = `
                        Did you mean <a href="#" class="text-primary" onclick="event.preventDefault(); 
                        document.getElementById('email').value='${suggestion}'; this.parentElement.remove();">
                        ${suggestion}</a>?
                    `;
                    
                    emailInput.parentElement.appendChild(suggestionDiv);
                }
            });
        }
    }
    
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
    // 8. SUCCESS MODAL
    // ========================================
    function showSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center p-5">
                        <div class="mb-4">
                            <i class="fas fa-check-circle text-success" style="font-size: 5rem;"></i>
                        </div>
                        <h3 class="fw-bold mb-3">Application Submitted!</h3>
                        <p class="lead mb-4">
                            Thank you for your interest in joining SocialTech Innovations. 
                            We've received your application and will review it carefully.
                        </p>
                        <p class="text-muted mb-4">
                            <i class="fas fa-envelope me-2"></i>
                            A confirmation email has been sent to your email address.
                        </p>
                        <p class="text-muted small">
                            <strong>Next Steps:</strong><br>
                            • Our team will review your application within 3-5 business days<br>
                            • Selected candidates will be contacted for an initial interview<br>
                            • Check your email regularly for updates
                        </p>
                        <button type="button" class="btn btn-primary mt-3" data-bs-dismiss="modal">
                            Got it, Thanks!
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', function() {
            modal.remove();
        });
    }
    
    
    // ========================================
    // 9. HELPER FUNCTIONS
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
    
    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
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
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    
    // ========================================
    // 10. CONSOLE MESSAGE
    // ========================================
    console.log('%c💼 Join Us Page Loaded', 'color: #2BB6E0; font-size: 18px; font-weight: bold;');
    console.log('%cReady to join our team? Apply now!', 'color: #8B4FBF; font-size: 14px;');
    
});


// ========================================
// ADD ANIMATION CSS
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
    
    .form-control.is-valid,
    .form-select.is-valid {
        border-color: #28a745;
        padding-right: calc(1.5em + 0.75rem);
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right calc(0.375em + 0.1875rem) center;
        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    
    .skill-checkbox:checked + label {
        color: #2BB6E0;
        font-weight: 600;
    }
`;
document.head.appendChild(style);