// ============================================
// SERVICES.JS - Services Page Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. SERVICE CARD HOVER EFFECTS
    // ========================================
    const serviceCards = document.querySelectorAll('.card.h-100.border-0.shadow-sm');
    
    serviceCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(43, 182, 224, 0.3)';
            
            // Icon rotation effect
            const icon = this.querySelector('.fa-2x, .fa-3x');
            if (icon) {
                icon.style.transform = 'rotate(360deg)';
                icon.style.transition = 'transform 0.6s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
            
            // Reset icon rotation
            const icon = this.querySelector('.fa-2x, .fa-3x');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    
    // ========================================
    // 2. SERVICE COMPARISON FEATURE
    // ========================================
    let selectedServices = [];
    const maxComparison = 3;
    
    // Add "Compare" button to each service card
    const coreServiceCards = document.querySelectorAll('.col-lg-6 .card');
    
    coreServiceCards.forEach((card, index) => {
        const cardBody = card.querySelector('.card-body');
        const serviceTitle = card.querySelector('h3').textContent;
        
        const compareBtn = document.createElement('button');
        compareBtn.className = 'btn btn-sm btn-outline-primary mt-3 compare-btn';
        compareBtn.innerHTML = '<i class="fas fa-balance-scale me-1"></i>Compare';
        compareBtn.dataset.service = serviceTitle;
        compareBtn.dataset.index = index;
        
        cardBody.appendChild(compareBtn);
        
        compareBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleServiceComparison(this);
        });
    });
    
    function toggleServiceComparison(btn) {
        const service = btn.dataset.service;
        const index = parseInt(btn.dataset.index);
        
        if (selectedServices.includes(index)) {
            // Remove from comparison
            selectedServices = selectedServices.filter(i => i !== index);
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-primary');
            btn.innerHTML = '<i class="fas fa-balance-scale me-1"></i>Compare';
        } else {
            // Add to comparison
            if (selectedServices.length < maxComparison) {
                selectedServices.push(index);
                btn.classList.remove('btn-outline-primary');
                btn.classList.add('btn-primary');
                btn.innerHTML = '<i class="fas fa-check me-1"></i>Selected';
            } else {
                showNotification('warning', `You can only compare up to ${maxComparison} services at once.`);
            }
        }
        
        updateComparisonPanel();
    }
    
    function updateComparisonPanel() {
        let panel = document.getElementById('comparison-panel');
        
        if (selectedServices.length > 0) {
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'comparison-panel';
                panel.className = 'position-fixed bottom-0 start-0 w-100 bg-white shadow-lg p-3';
                panel.style.zIndex = '1000';
                panel.style.borderTop = '3px solid #2BB6E0';
                document.body.appendChild(panel);
            }
            
            panel.innerHTML = `
                <div class="container">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${selectedServices.length} service(s) selected for comparison</strong>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary" onclick="showComparisonModal()">
                                <i class="fas fa-eye me-1"></i>View Comparison
                            </button>
                            <button class="btn btn-outline-secondary" onclick="clearComparison()">
                                <i class="fas fa-times me-1"></i>Clear
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else if (panel) {
            panel.remove();
        }
    }
    
    // Make functions global
    window.showComparisonModal = function() {
        alert('Service comparison feature - This would show a detailed comparison modal');
        // In production, this would open a modal with side-by-side comparison
    };
    
    window.clearComparison = function() {
        selectedServices = [];
        document.querySelectorAll('.compare-btn').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-primary');
            btn.innerHTML = '<i class="fas fa-balance-scale me-1"></i>Compare';
        });
        updateComparisonPanel();
    };
    
    
    // ========================================
    // 3. SERVICE DETAILS MODAL
    // ========================================
    serviceCards.forEach((card, index) => {
        const title = card.querySelector('h3, h5');
        if (title) {
            title.style.cursor = 'pointer';
            title.style.transition = 'color 0.3s ease';
            
            title.addEventListener('mouseenter', function() {
                this.style.color = '#2BB6E0';
            });
            
            title.addEventListener('mouseleave', function() {
                this.style.color = '';
            });
            
            title.addEventListener('click', function() {
                showServiceModal(card);
            });
        }
    });
    
    function showServiceModal(card) {
        const title = card.querySelector('h3, h5').textContent;
        const description = card.querySelector('.text-muted').textContent;
        const features = Array.from(card.querySelectorAll('li')).map(li => li.textContent);
        
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #2BB6E0, #8B4FBF); color: white;">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <p class="lead">${description}</p>
                        ${features.length > 0 ? `
                            <h6 class="fw-bold mt-4">Key Features:</h6>
                            <ul>${features.map(f => `<li>${f}</li>`).join('')}</ul>
                        ` : ''}
                        <div class="alert alert-info mt-4">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Interested in this service?</strong> Contact us for a free consultation.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <a href="/contact" class="btn btn-primary">
                            <i class="fas fa-envelope me-2"></i>Get a Quote
                        </a>
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
    // 4. PRICING CALCULATOR
    // ========================================
    function createPricingCalculator() {
        const pricingSection = document.querySelector('.py-5:has(.fw-bold:contains("Pricing Philosophy"))');
        
        if (pricingSection) {
            const calculatorCard = document.createElement('div');
            calculatorCard.className = 'card border-0 shadow-sm mt-4';
            calculatorCard.innerHTML = `
                <div class="card-body p-4">
                    <h5 class="fw-bold mb-3">
                        <i class="fas fa-calculator me-2" style="color: #2BB6E0;"></i>
                        Quick Pricing Estimator
                    </h5>
                    <div class="mb-3">
                        <label class="form-label">Organization Size:</label>
                        <select class="form-select" id="org-size">
                            <option value="small">Small (1-10 staff) - 70% discount</option>
                            <option value="medium">Medium (11-50 staff) - 50% discount</option>
                            <option value="large">Large (51+ staff) - 30% discount</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Services Needed:</label>
                        <div class="form-check">
                            <input class="form-check-input service-checkbox" type="checkbox" id="it-support" value="200">
                            <label class="form-check-label" for="it-support">IT Support ($200/month)</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input service-checkbox" type="checkbox" id="cybersecurity" value="150">
                            <label class="form-check-label" for="cybersecurity">Cybersecurity ($150/month)</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input service-checkbox" type="checkbox" id="cloud" value="100">
                            <label class="form-check-label" for="cloud">Cloud Services ($100/month)</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input service-checkbox" type="checkbox" id="training" value="80">
                            <label class="form-check-label" for="training">Training ($80/month)</label>
                        </div>
                    </div>
                    <div class="bg-light p-3 rounded">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span id="subtotal">$0</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Nonprofit Discount:</span>
                            <span id="discount" style="color: #28a745;">-$0</span>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between">
                            <strong>Estimated Monthly Cost:</strong>
                            <strong id="total" style="color: #2BB6E0; font-size: 1.5rem;">$0</strong>
                        </div>
                    </div>
                    <p class="text-muted small mt-3 mb-0">
                        <i class="fas fa-info-circle me-1"></i>
                        This is an estimate. Contact us for accurate pricing.
                    </p>
                </div>
            `;
            
            const col = document.querySelector('.col-lg-6:last-child');
            if (col) {
                col.appendChild(calculatorCard);
                
                // Add calculator functionality
                const orgSize = document.getElementById('org-size');
                const checkboxes = document.querySelectorAll('.service-checkbox');
                
                function updateCalculator() {
                    let subtotal = 0;
                    checkboxes.forEach(cb => {
                        if (cb.checked) {
                            subtotal += parseFloat(cb.value);
                        }
                    });
                    
                    let discountRate = 0.7;
                    if (orgSize.value === 'medium') discountRate = 0.5;
                    if (orgSize.value === 'large') discountRate = 0.3;
                    
                    const discount = subtotal * discountRate;
                    const total = subtotal - discount;
                    
                    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(0);
                    document.getElementById('discount').textContent = '-$' + discount.toFixed(0);
                    document.getElementById('total').textContent = '$' + total.toFixed(0);
                }
                
                orgSize.addEventListener('change', updateCalculator);
                checkboxes.forEach(cb => cb.addEventListener('change', updateCalculator));
            }
        }
    }
    
    createPricingCalculator();
    
    
    // ========================================
    // 5. FEATURE LIST EXPANSION
    // ========================================
    const featureLists = document.querySelectorAll('.list-unstyled');
    
    featureLists.forEach(list => {
        const items = list.querySelectorAll('li');
        if (items.length > 4) {
            // Hide items beyond the 4th
            for (let i = 4; i < items.length; i++) {
                items[i].style.display = 'none';
            }
            
            // Add "Show More" button
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'btn btn-link btn-sm p-0 mt-2';
            showMoreBtn.innerHTML = '<i class="fas fa-plus-circle me-1"></i>Show More';
            showMoreBtn.style.textDecoration = 'none';
            
            list.appendChild(showMoreBtn);
            
            let expanded = false;
            showMoreBtn.addEventListener('click', function() {
                expanded = !expanded;
                
                for (let i = 4; i < items.length; i++) {
                    items[i].style.display = expanded ? 'list-item' : 'none';
                }
                
                this.innerHTML = expanded 
                    ? '<i class="fas fa-minus-circle me-1"></i>Show Less'
                    : '<i class="fas fa-plus-circle me-1"></i>Show More';
            });
        }
    });
    
    
    // ========================================
    // 6. ICON PULSE ANIMATION ON SCROLL
    // ========================================
    const serviceIcons = document.querySelectorAll('.fa-2x, .fa-3x');
    
    const iconObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'pulse 1s ease';
                setTimeout(() => {
                    entry.target.style.animation = '';
                }, 1000);
            }
        });
    }, { threshold: 0.5 });
    
    serviceIcons.forEach(icon => iconObserver.observe(icon));
    
    
    // ========================================
    // 7. SERVICE CATEGORIES FILTER
    // ========================================
    function createServiceFilter() {
        const servicesSection = document.querySelector('.py-5 .container:has(.fw-bold:contains("Our Services"))');
        
        if (servicesSection) {
            const filterBar = document.createElement('div');
            filterBar.className = 'mb-4 text-center';
            filterBar.innerHTML = `
                <div class="btn-group" role="group">
                    <button class="btn btn-outline-primary filter-btn active" data-filter="all">
                        <i class="fas fa-th me-1"></i>All Services
                    </button>
                    <button class="btn btn-outline-primary filter-btn" data-filter="core">
                        <i class="fas fa-star me-1"></i>Core Services
                    </button>
                    <button class="btn btn-outline-primary filter-btn" data-filter="additional">
                        <i class="fas fa-plus me-1"></i>Additional
                    </button>
                </div>
            `;
            
            servicesSection.insertBefore(filterBar, servicesSection.querySelector('.row'));
            
            const filterButtons = filterBar.querySelectorAll('.filter-btn');
            const coreServices = document.querySelector('.py-5:not(.bg-light) .row');
            const additionalServices = document.querySelector('.py-5.bg-light');
            
            filterButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    const filter = this.dataset.filter;
                    
                    if (filter === 'all') {
                        coreServices.parentElement.style.display = 'block';
                        if (additionalServices) additionalServices.style.display = 'block';
                    } else if (filter === 'core') {
                        coreServices.parentElement.style.display = 'block';
                        if (additionalServices) additionalServices.style.display = 'none';
                    } else if (filter === 'additional') {
                        coreServices.parentElement.style.display = 'none';
                        if (additionalServices) additionalServices.style.display = 'block';
                    }
                });
            });
        }
    }
    
    createServiceFilter();
    
    
    // ========================================
    // 8. "REQUEST QUOTE" QUICK FORM
    // ========================================
    const ctaButtons = document.querySelectorAll('a[href*="contact"]');
    
    ctaButtons.forEach(btn => {
        if (btn.textContent.includes('Schedule') || btn.textContent.includes('Quote')) {
            btn.addEventListener('click', function(e) {
                if (confirm('Would you like to fill out a quick form instead of going to the contact page?')) {
                    e.preventDefault();
                    showQuickQuoteForm();
                }
            });
        }
    });
    
    function showQuickQuoteForm() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-file-invoice me-2"></i>Request a Quote
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="quick-quote-form">
                            <div class="mb-3">
                                <label class="form-label">Organization Name *</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email *</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Service Interest *</label>
                                <select class="form-select" required>
                                    <option value="">Select a service...</option>
                                    <option>Managed IT Services</option>
                                    <option>Technology Donations</option>
                                    <option>Cybersecurity</option>
                                    <option>Cloud Solutions</option>
                                    <option>Custom Development</option>
                                    <option>Training</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Brief Description</label>
                                <textarea class="form-control" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="submitQuickQuote()">
                            <i class="fas fa-paper-plane me-2"></i>Submit Request
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
    
    window.submitQuickQuote = function() {
        showNotification('success', '✓ Quote request submitted! We\'ll contact you within 24 hours.');
        bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
    };
    
    
    // ========================================
    // 9. ELIGIBILITY CHECKER
    // ========================================
    const eligibilityBtn = document.querySelector('a[href*="contact"]:has(.fa-clipboard-check)');
    
    if (eligibilityBtn) {
        eligibilityBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showEligibilityChecker();
        });
    }
    
    function showEligibilityChecker() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #2BB6E0, #8B4FBF); color: white;">
                        <h5 class="modal-title">
                            <i class="fas fa-clipboard-check me-2"></i>Eligibility Checker
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <p class="lead">Answer these questions to check your eligibility for nonprofit pricing:</p>
                        <form id="eligibility-form">
                            <div class="mb-4">
                                <label class="form-label fw-bold">1. Is your organization a registered nonprofit?</label>
                                <div>
                                    <input type="radio" name="q1" value="yes" id="q1-yes" class="form-check-input">
                                    <label for="q1-yes" class="form-check-label ms-2">Yes</label>
                                </div>
                                <div>
                                    <input type="radio" name="q1" value="no" id="q1-no" class="form-check-input">
                                    <label for="q1-no" class="form-check-label ms-2">No</label>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-bold">2. Does your organization have a clear social mission?</label>
                                <div>
                                    <input type="radio" name="q2" value="yes" id="q2-yes" class="form-check-input">
                                    <label for="q2-yes" class="form-check-label ms-2">Yes</label>
                                </div>
                                <div>
                                    <input type="radio" name="q2" value="no" id="q2-no" class="form-check-input">
                                    <label for="q2-no" class="form-check-label ms-2">No</label>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-bold">3. Can you provide documentation of your nonprofit status?</label>
                                <div>
                                    <input type="radio" name="q3" value="yes" id="q3-yes" class="form-check-input">
                                    <label for="q3-yes" class="form-check-label ms-2">Yes</label>
                                </div>
                                <div>
                                    <input type="radio" name="q3" value="no" id="q3-no" class="form-check-input">
                                    <label for="q3-no" class="form-check-label ms-2">No</label>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary w-100" onclick="checkEligibility()">
                                <i class="fas fa-check-circle me-2"></i>Check Eligibility
                            </button>
                        </form>
                        <div id="eligibility-result" class="mt-4" style="display: none;"></div>
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
    
    window.checkEligibility = function() {
        const form = document.getElementById('eligibility-form');
        const q1 = form.querySelector('input[name="q1"]:checked');
        const q2 = form.querySelector('input[name="q2"]:checked');
        const q3 = form.querySelector('input[name="q3"]:checked');
        
        if (!q1 || !q2 || !q3) {
            alert('Please answer all questions');
            return;
        }
        
        const result = document.getElementById('eligibility-result');
        result.style.display = 'block';
        
        if (q1.value === 'yes' && q2.value === 'yes' && q3.value === 'yes') {
            result.innerHTML = `
                <div class="alert alert-success">
                    <h5><i class="fas fa-check-circle me-2"></i>Congratulations! You're Eligible!</h5>
                    <p class="mb-0">Your organization qualifies for our nonprofit pricing. Contact us to get started.</p>
                    <a href="/contact" class="btn btn-success mt-3">
                        <i class="fas fa-envelope me-2"></i>Contact Us Now
                    </a>
                </div>
            `;
        } else {
            result.innerHTML = `
                <div class="alert alert-warning">
                    <h5><i class="fas fa-info-circle me-2"></i>Additional Information Needed</h5>
                    <p class="mb-0">Please contact us to discuss your specific situation. We may still be able to help!</p>
                    <a href="/contact" class="btn btn-warning mt-3">
                        <i class="fas fa-envelope me-2"></i>Get in Touch
                    </a>
                </div>
            `;
        }
    };
    
    
    // ========================================
    // 10. NOTIFICATION SYSTEM
    // ========================================
    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
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
    // 11. CONSOLE MESSAGE
    // ========================================
    console.log('%c🛠️ Services Page Loaded', 'color: #2BB6E0; font-size: 18px; font-weight: bold;');
    console.log('%cExplore our technology solutions for social impact', 'color: #8B4FBF; font-size: 14px;');
    
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
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
    
    .compare-btn {
        transition: all 0.3s ease;
    }
    
    .compare-btn:hover {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);