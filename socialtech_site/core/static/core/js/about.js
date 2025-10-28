// ============================================
// ABOUT.JS - About Page Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. ANIMATED STORY SECTION
    // ========================================
    const storySection = document.querySelector('.py-5 .container:has(h2:contains("Our Story"))');
    
    if (storySection) {
        const paragraphs = storySection.querySelectorAll('p');
        
        const paragraphObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                        entry.target.style.opacity = '1';
                    }, index * 200);
                    paragraphObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        paragraphs.forEach(p => {
            p.style.opacity = '0';
            paragraphObserver.observe(p);
        });
    }
    
    
    // ========================================
    // 2. MISSION & VISION CARD INTERACTIONS
    // ========================================
    const missionVisionCards = document.querySelectorAll('.bg-light .card');
    
    missionVisionCards.forEach(card => {
        card.style.transition = 'all 0.4s ease';
        card.style.cursor = 'pointer';
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.boxShadow = '0 20px 50px rgba(43, 182, 224, 0.3)';
            
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
        
        // Click to expand
        card.addEventListener('click', function() {
            showMissionVisionModal(this);
        });
    });
    
    function showMissionVisionModal(card) {
        const title = card.querySelector('h4').textContent;
        const description = card.querySelector('p').textContent;
        const iconClass = card.querySelector('i').className;
        const iconColor = card.querySelector('i').style.color;
        
        const expandedContent = {
            'Our Mission': {
                details: [
                    'Provide affordable, high-quality IT services tailored to nonprofit needs',
                    'Facilitate access to donated and discounted technology products',
                    'Build technical capacity within organizations through training',
                    'Develop custom solutions for unique nonprofit challenges',
                    'Create a community of tech professionals committed to social impact'
                ]
            },
            'Our Vision': {
                details: [
                    'Universal access to modern technology for all social impact organizations',
                    'A thriving ecosystem of tech-enabled nonprofits across Africa',
                    'Stronger, more efficient organizations creating lasting change',
                    'A world where budget never limits mission achievement',
                    'Technology as a catalyst for social transformation'
                ]
            }
        };
        
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #2BB6E0, #8B4FBF);">
                        <h5 class="modal-title text-white">
                            <i class="${iconClass} me-2" style="color: white;"></i>${title}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <p class="lead mb-4">${description}</p>
                        
                        ${expandedContent[title] ? `
                            <h6 class="fw-bold mb-3">How We Achieve This:</h6>
                            <ul class="list-unstyled">
                                ${expandedContent[title].details.map(item => `
                                    <li class="mb-2">
                                        <i class="fas fa-check-circle me-2" style="color: ${iconColor};"></i>${item}
                                    </li>
                                `).join('')}
                            </ul>
                        ` : ''}
                        
                        <div class="alert alert-info mt-4">
                            <i class="fas fa-lightbulb me-2"></i>
                            <strong>Want to learn more?</strong> Contact us to see how we can support your organization.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <a href="/contact" class="btn btn-primary">
                            <i class="fas fa-envelope me-2"></i>Get in Touch
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
    // 3. VALUES CARDS STAGGER ANIMATION
    // ========================================
    const valueCards = document.querySelectorAll('.py-5:has(h3:contains("Core Values")) .card');
    
    const valueObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'bounceIn 0.6s ease forwards';
                }, index * 150);
                valueObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    valueCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';
        
        valueObserver.observe(card);
        
        // Hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotate(2deg)';
            this.style.boxShadow = '0 15px 30px rgba(43, 182, 224, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
            this.style.boxShadow = '';
        });
    });
    
    
    // ========================================
    // 4. "WHAT MAKES US DIFFERENT" CARDS
    // ========================================
    const differenceCards = document.querySelectorAll('.bg-light:has(h3:contains("What Makes Us Different")) .card');
    
    differenceCards.forEach((card, index) => {
        card.style.transition = 'all 0.3s ease';
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 20px 40px rgba(139, 79, 191, 0.3)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotateY(360deg)';
                icon.style.transition = 'transform 0.6s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotateY(0deg)';
            }
        });
    });
    
    
    // ========================================
    // 5. TEAM MEMBER CARDS WITH MODAL
    // ========================================
    const teamCards = document.querySelectorAll('.py-5:has(h3:contains("Leadership Team")) .card');
    
    teamCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 35px rgba(43, 182, 224, 0.3)';
            
            const avatar = this.querySelector('.rounded-circle');
            if (avatar) {
                avatar.style.transform = 'scale(1.1)';
                avatar.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
            
            const avatar = this.querySelector('.rounded-circle');
            if (avatar) {
                avatar.style.transform = 'scale(1)';
            }
        });
        
        // Add "View Profile" button
        const cardBody = card.querySelector('.card-body');
        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-sm btn-outline-primary mt-3 w-100';
        viewBtn.innerHTML = '<i class="fas fa-user-circle me-1"></i>View Full Profile';
        cardBody.appendChild(viewBtn);
        
        viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showTeamMemberModal(card);
        });
    });
    
    function showTeamMemberModal(card) {
        const name = card.querySelector('h5').textContent;
        const role = card.querySelectorAll('p')[0].textContent;
        const bio = card.querySelectorAll('p')[1].textContent;
        const avatarColor = card.querySelector('.rounded-circle').style.backgroundColor;
        
        // Extended bio data (in production, this would come from backend)
        const extendedData = {
            'Kwame Mensah': {
                fullBio: 'Kwame is a visionary leader with over 15 years of experience in nonprofit technology. Before founding SocialTech Innovations, he served as CTO at a major international development organization where he led digital transformation initiatives across 30 countries. His passion for bridging the technology gap for nonprofits drives our mission every day.',
                expertise: ['Nonprofit IT Strategy', 'Digital Transformation', 'Cloud Infrastructure', 'Team Leadership'],
                education: 'MSc Computer Science, University of Ghana',
                contact: 'kwame@socialtech.org'
            },
            'Akosua Boateng': {
                fullBio: 'Akosua brings deep expertise in nonprofit capacity building and technology training. She has worked with hundreds of organizations across Africa, helping them adopt and effectively use technology tools. Her approach focuses on sustainable skill development and empowering staff to become tech champions within their organizations.',
                expertise: ['Capacity Building', 'Technology Training', 'Change Management', 'Program Design'],
                education: 'MBA in Nonprofit Management, KNUST',
                contact: 'akosua@socialtech.org'
            },
            'David Osei': {
                fullBio: 'David is a seasoned software engineer with a heart for social impact. With over 10 years of experience building enterprise applications, he now dedicates his skills to creating innovative solutions for nonprofits. He leads our technical team in developing custom software that addresses unique challenges in the social sector.',
                expertise: ['Full Stack Development', 'Cloud Architecture', 'Mobile Development', 'DevOps'],
                education: 'BSc Software Engineering, Ashesi University',
                contact: 'david@socialtech.org'
            }
        };
        
        const data = extendedData[name] || {};
        
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header" style="background: ${avatarColor};">
                        <h5 class="modal-title text-white">${name}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="text-center mb-4">
                            <div class="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-3" 
                                 style="width: 120px; height: 120px; background-color: ${avatarColor};">
                                <i class="fas fa-user fa-4x"></i>
                            </div>
                            <h5 class="fw-bold mb-1">${name}</h5>
                            <p class="text-muted">${role}</p>
                        </div>
                        
                        <h6 class="fw-bold mb-3">About</h6>
                        <p>${data.fullBio || bio}</p>
                        
                        ${data.expertise ? `
                            <h6 class="fw-bold mb-3 mt-4">Areas of Expertise</h6>
                            <div class="d-flex gap-2 flex-wrap">
                                ${data.expertise.map(skill => 
                                    `<span class="badge bg-light text-dark">${skill}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                        
                        ${data.education ? `
                            <h6 class="fw-bold mb-2 mt-4">Education</h6>
                            <p class="text-muted">${data.education}</p>
                        ` : ''}
                        
                        ${data.contact ? `
                            <div class="alert alert-info mt-4">
                                <i class="fas fa-envelope me-2"></i>
                                <strong>Contact:</strong> <a href="mailto:${data.contact}">${data.contact}</a>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
    // 6. PARTNER LOGOS ANIMATION
    // ========================================
    const partnerLogos = document.querySelectorAll('.bg-light:has(h3:contains("Technology Partners")) .col-md-2, .col-sm-4, .col-6');
    
    const logoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'zoomIn 0.5s ease forwards';
                }, index * 100);
                logoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    partnerLogos.forEach((logo, index) => {
        logo.style.opacity = '0';
        logoObserver.observe(logo);
        
        // Add hover effect
        const logoCard = logo.querySelector('.p-3');
        if (logoCard) {
            logoCard.style.transition = 'all 0.3s ease';
            logoCard.style.cursor = 'pointer';
            
            logoCard.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.15)';
                this.style.boxShadow = '0 10px 25px rgba(43, 182, 224, 0.3)';
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotateY(360deg)';
                    icon.style.transition = 'transform 0.6s ease';
                }
            });
            
            logoCard.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '';
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotateY(0deg)';
                }
            });
            
            // Click to learn more
            logoCard.addEventListener('click', function() {
                const partnerName = this.querySelector('p').textContent;
                showPartnerInfo(partnerName);
            });
        }
    });
    
    function showPartnerInfo(partnerName) {
        const partnerData = {
            'Microsoft': 'Through Microsoft for Nonprofits, we provide access to Office 365, Azure cloud services, and enterprise software at heavily discounted rates.',
            'Google': 'Google for Nonprofits program offers G Suite, Google Ad Grants, and YouTube Nonprofit Program to eligible organizations.',
            'AWS': 'AWS provides cloud computing credits and technical training to help nonprofits scale their digital infrastructure affordably.',
            'Adobe': 'Adobe Creative Cloud for Nonprofits enables organizations to access professional design tools at discounted nonprofit pricing.',
            'Salesforce': 'Salesforce.org provides powerful CRM solutions with special nonprofit pricing and dedicated support programs.'
        };
        
        showNotification('info', 
            `<strong>${partnerName} Partnership</strong><br>${partnerData[partnerName] || 'Partnering to support nonprofit technology needs.'}`
        );
    }
    
    
    // ========================================
    // 7. TIMELINE CREATION FOR "OUR STORY"
    // ========================================
    function createTimeline() {
        const storySection = document.querySelector('.py-5:has(h2:contains("Our Story"))');
        
        if (storySection) {
            const timelineData = [
                { year: '2020', event: 'SocialTech Innovations Founded', description: 'Started with a mission to democratize technology access' },
                { year: '2021', event: 'First 50 Organizations Served', description: 'Expanded our reach across Ghana' },
                { year: '2022', event: 'International Expansion', description: 'Began serving nonprofits across Africa' },
                { year: '2023', event: 'Technology Partnership Program', description: 'Established partnerships with major tech companies' },
                { year: '2024', event: '500+ Organizations Impact', description: 'Reached milestone of serving 500+ nonprofits across 25 countries' }
            ];
            
            const timelineHTML = `
                <div class="timeline-section mt-5 pt-5 border-top">
                    <h3 class="fw-bold text-center mb-5">Our Journey</h3>
                    <div class="timeline">
                        ${timelineData.map((item, index) => `
                            <div class="timeline-item" style="animation-delay: ${index * 0.2}s;">
                                <div class="timeline-marker" style="background: ${index % 2 === 0 ? '#2BB6E0' : '#8B4FBF'};">
                                    ${item.year}
                                </div>
                                <div class="timeline-content">
                                    <h5 class="fw-bold mb-2">${item.event}</h5>
                                    <p class="text-muted mb-0">${item.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            storySection.insertAdjacentHTML('beforeend', timelineHTML);
            
            // Animate timeline items on scroll
            const timelineItems = document.querySelectorAll('.timeline-item');
            const timelineObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'slideInLeft 0.6s ease forwards';
                        timelineObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            timelineItems.forEach(item => {
                item.style.opacity = '0';
                timelineObserver.observe(item);
            });
        }
    }
    
    createTimeline();
    
    
    // ========================================
    // 8. STATISTICS COUNTER
    // ========================================
    function addStatistics() {
        const missionVisionSection = document.querySelector('.row.g-4.mb-5:has(.bg-light)');
        
        if (missionVisionSection) {
            const statsHTML = `
                <div class="col-12 mt-5">
                    <div class="card border-0" style="background: linear-gradient(135deg, #2BB6E0, #8B4FBF);">
                        <div class="card-body p-4">
                            <div class="row text-center text-white">
                                <div class="col-md-3">
                                    <h2 class="fw-bold mb-2 counter" data-target="500">0</h2>
                                    <p class="mb-0">Organizations Served</p>
                                </div>
                                <div class="col-md-3">
                                    <h2 class="fw-bold mb-2 counter" data-target="25">0</h2>
                                    <p class="mb-0">Countries Reached</p>
                                </div>
                                <div class="col-md-3">
                                    <h2 class="fw-bold mb-2 counter" data-target="1000000">0</h2>
                                    <p class="mb-0">Beneficiaries Impacted</p>
                                </div>
                                <div class="col-md-3">
                                    <h2 class="fw-bold mb-2">$5M+</h2>
                                    <p class="mb-0">Tech Value Delivered</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            missionVisionSection.insertAdjacentHTML('beforeend', statsHTML);
            
            // Animate counters
            const counters = document.querySelectorAll('.counter');
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            counters.forEach(counter => counterObserver.observe(counter));
        }
    }
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
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
    
    addStatistics();
    
    
    // ========================================
    // 9. NOTIFICATION SYSTEM
    // ========================================
    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 350px;
            max-width: 500px;
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
    console.log('%c👥 About Page Loaded', 'color: #2BB6E0; font-size: 18px; font-weight: bold;');
    console.log('%cLearn about our mission and team', 'color: #8B4FBF; font-size: 14px;');
    
});


// ========================================
// ADD ANIMATION CSS
// ========================================
const style = document.createElement('style');
style.textContent = `
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
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    /* Timeline Styles */
    .timeline {
        position: relative;
        padding: 2rem 0;
    }
    
    .timeline::before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 3px;
        height: 100%;
        background: linear-gradient(to bottom, #2BB6E0, #8B4FBF);
    }
    
    .timeline-item {
        position: relative;
        margin-bottom: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .timeline-marker {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 2;
    }
    
    .timeline-content {
        width: 40%;
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        margin-left: auto;
        margin-right: 10%;
    }
    
    .timeline-item:nth-child(even) .timeline-content {
        margin-left: 10%;
        margin-right: auto;
    }
    
    @media (max-width: 768px) {
        .timeline::before {
            left: 20px;
        }
        
        .timeline-marker {
            left: 20px;
            width: 60px;
            height: 60px;
            font-size: 1rem;
        }
        
        .timeline-content {
            width: calc(100% - 100px);
            margin-left: 100px !important;
            margin-right: 0 !important;
        }
    }
`;
document.head.appendChild(style);