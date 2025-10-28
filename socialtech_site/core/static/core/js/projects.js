// ============================================
// PROJECTS.JS - Projects Page Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. PROJECT FILTERING SYSTEM
    // ========================================
    function createProjectFilter() {
        const projectsSection = document.querySelector('.py-5 .container:has(.fw-bold:contains("Featured Success"))');
        
        if (projectsSection) {
            const filterBar = document.createElement('div');
            filterBar.className = 'mb-5';
            filterBar.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-lg-6 mb-3 mb-lg-0">
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                            <input type="text" class="form-control" id="projectSearch" 
                                   placeholder="Search projects by name, sector, or technology...">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="d-flex gap-2 flex-wrap justify-content-lg-end">
                            <button class="btn btn-sm btn-primary filter-btn active" data-filter="all">
                                <i class="fas fa-th me-1"></i>All Projects
                            </button>
                            <button class="btn btn-sm btn-outline-primary filter-btn" data-filter="Education">
                                <i class="fas fa-graduation-cap me-1"></i>Education
                            </button>
                            <button class="btn btn-sm btn-outline-primary filter-btn" data-filter="Healthcare">
                                <i class="fas fa-heartbeat me-1"></i>Healthcare
                            </button>
                            <button class="btn btn-sm btn-outline-primary filter-btn" data-filter="Environment">
                                <i class="fas fa-leaf me-1"></i>Environment
                            </button>
                            <button class="btn btn-sm btn-outline-primary filter-btn" data-filter="Faith-Based">
                                <i class="fas fa-church me-1"></i>Faith
                            </button>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <span class="text-muted small" id="filterStatus">Showing all projects</span>
                </div>
            `;
            
            const textCenter = projectsSection.querySelector('.text-center');
            textCenter.parentElement.insertBefore(filterBar, textCenter.nextSibling);
            
            // Filter functionality
            const filterButtons = filterBar.querySelectorAll('.filter-btn');
            const searchInput = document.getElementById('projectSearch');
            
            filterButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterButtons.forEach(b => {
                        b.classList.remove('btn-primary', 'active');
                        b.classList.add('btn-outline-primary');
                    });
                    this.classList.remove('btn-outline-primary');
                    this.classList.add('btn-primary', 'active');
                    
                    filterProjects(this.dataset.filter, searchInput.value);
                });
            });
            
            searchInput.addEventListener('input', function() {
                const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
                filterProjects(activeFilter, this.value);
            });
        }
    }
    
    function filterProjects(category, searchTerm = '') {
        const allProjects = document.querySelectorAll('.project-item, .col-lg-4.col-md-6');
        let visibleCount = 0;
        
        allProjects.forEach(project => {
            const projectText = project.textContent.toLowerCase();
            const badges = Array.from(project.querySelectorAll('.badge'))
                .map(b => b.textContent.toLowerCase());
            
            const matchesCategory = category === 'all' || 
                badges.some(badge => badge.includes(category.toLowerCase()));
            const matchesSearch = searchTerm === '' || 
                projectText.includes(searchTerm.toLowerCase());
            
            if (matchesCategory && matchesSearch) {
                project.style.display = '';
                project.style.animation = 'fadeInUp 0.5s ease';
                visibleCount++;
            } else {
                project.style.display = 'none';
            }
        });
        
        // Update status
        const statusText = document.getElementById('filterStatus');
        if (statusText) {
            statusText.textContent = `Showing ${visibleCount} project${visibleCount !== 1 ? 's' : ''}`;
        }
    }
    
    createProjectFilter();
    
    
    // ========================================
    // 2. PROJECT DETAIL MODAL
    // ========================================
    const projectCards = document.querySelectorAll('.project-item, .card.h-100');
    
    projectCards.forEach(card => {
        const title = card.querySelector('h3, h5');
        
        if (title) {
            // Add view details button
            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn btn-sm btn-outline-primary mt-3';
            viewBtn.innerHTML = '<i class="fas fa-eye me-1"></i>View Details';
            
            const cardBody = card.querySelector('.col-md-6, .card-body');
            if (cardBody) {
                cardBody.appendChild(viewBtn);
            }
            
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showProjectModal(card);
            });
        }
    });
    
    function showProjectModal(projectElement) {
        const title = projectElement.querySelector('h3, h5').textContent;
        const description = projectElement.querySelector('.text-muted').textContent;
        const badges = Array.from(projectElement.querySelectorAll('.badge'))
            .map(b => b.outerHTML).join(' ');
        const impactList = projectElement.querySelector('ul');
        const techBadges = projectElement.querySelectorAll('.badge.bg-light');
        const image = projectElement.querySelector('img');
        
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #2BB6E0, #8B4FBF);">
                        <h5 class="modal-title text-white">${title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-0">
                        ${image ? `
                            <img src="${image.src}" class="w-100" alt="${title}" style="max-height: 300px; object-fit: cover;">
                        ` : ''}
                        <div class="p-4">
                            <div class="mb-3">${badges}</div>
                            <p class="lead">${description}</p>
                            
                            ${impactList ? `
                                <h6 class="fw-bold mt-4 mb-3">Impact Metrics / Key Features:</h6>
                                ${impactList.outerHTML}
                            ` : ''}
                            
                            ${techBadges.length > 0 ? `
                                <h6 class="fw-bold mt-4 mb-3">Technologies Used:</h6>
                                <div class="d-flex gap-2 flex-wrap">
                                    ${Array.from(techBadges).map(b => b.outerHTML).join('')}
                                </div>
                            ` : ''}
                            
                            <div class="alert alert-info mt-4">
                                <i class="fas fa-lightbulb me-2"></i>
                                <strong>Have a similar challenge?</strong> Let's discuss how we can help your organization.
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <a href="/contact" class="btn btn-primary">
                            <i class="fas fa-envelope me-2"></i>Contact Us
                        </a>
                        <button type="button" class="btn btn-outline-primary" onclick="shareProject('${title}')">
                            <i class="fas fa-share-alt me-2"></i>Share
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
    
    window.shareProject = function(title) {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this success story from SocialTech Innovations: ${title}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy link
            navigator.clipboard.writeText(window.location.href);
            showNotification('success', '✓ Link copied to clipboard!');
        }
    };
    
    
    // ========================================
    // 3. PROJECT IMAGE GALLERY
    // ========================================
    const projectImages = document.querySelectorAll('.project-img-wrapper img');
    
    projectImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.title = 'Click to enlarge';
        
        img.addEventListener('click', function() {
            showImageModal(this.src, this.alt);
        });
        
        // Hover effect
        const wrapper = img.closest('.project-img-wrapper');
        if (wrapper) {
            wrapper.style.overflow = 'hidden';
            wrapper.style.borderRadius = '10px';
            
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.transition = 'transform 0.5s ease';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        }
    });
    
    function showImageModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content bg-transparent border-0">
                    <div class="modal-body p-0 position-relative">
                        <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
                                data-bs-dismiss="modal" style="z-index: 10;"></button>
                        <img src="${src}" alt="${alt}" class="w-100 rounded shadow-lg">
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
    // 4. COUNTER ANIMATION
    // ========================================
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
    
    function animateCounter(element) {
        const text = element.textContent;
        const target = parseInt(text.replace(/\D/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = text; // Restore original format (e.g., "1M+")
            }
        };
        
        updateCounter();
    }
    
    
    // ========================================
    // 5. TESTIMONIAL CARD INTERACTIONS
    // ========================================
    const testimonialCards = document.querySelectorAll('.py-5:has(.fw-bold:contains("What Our Partners")) .card');
    
    testimonialCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(43, 182, 224, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        // Add "Read More" functionality if text is long
        const paragraph = card.querySelector('p');
        if (paragraph && paragraph.textContent.length > 200) {
            const fullText = paragraph.textContent;
            const shortText = fullText.substring(0, 150) + '...';
            
            paragraph.textContent = shortText;
            
            const readMoreBtn = document.createElement('button');
            readMoreBtn.className = 'btn btn-link btn-sm p-0 mt-2';
            readMoreBtn.textContent = 'Read More';
            paragraph.parentElement.appendChild(readMoreBtn);
            
            let expanded = false;
            readMoreBtn.addEventListener('click', function() {
                expanded = !expanded;
                paragraph.textContent = expanded ? fullText : shortText;
                this.textContent = expanded ? 'Read Less' : 'Read More';
            });
        }
    });
    
    
    // ========================================
    // 6. SECTOR CARDS HOVER & CLICK
    // ========================================
    const sectorCards = document.querySelectorAll('.hover-lift');
    
    sectorCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(43, 182, 224, 0.3)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(360deg)';
                icon.style.transition = 'transform 0.5s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        card.addEventListener('click', function() {
            const sector = this.querySelector('h6').textContent;
            filterProjectsBySector(sector);
            
            // Scroll to filtered projects
            document.querySelector('.py-5 .container:has(.fw-bold:contains("Featured Success"))')
                .scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    function filterProjectsBySector(sector) {
        const activeFilter = document.querySelector('.filter-btn[data-filter="' + sector + '"]');
        if (activeFilter) {
            activeFilter.click();
        } else {
            // Search by sector name
            document.getElementById('projectSearch').value = sector;
            filterProjects('all', sector);
        }
        
        showNotification('info', `Filtering projects by: ${sector}`);
    }
    
    
    // ========================================
    // 7. PROJECT COMPARISON FEATURE
    // ========================================
    let selectedProjects = [];
    const maxComparison = 3;
    
    projectCards.forEach((card, index) => {
        const compareCheckbox = document.createElement('div');
        compareCheckbox.className = 'form-check position-absolute top-0 end-0 m-3';
        compareCheckbox.style.zIndex = '5';
        compareCheckbox.innerHTML = `
            <input class="form-check-input compare-checkbox" type="checkbox" 
                   id="compare-${index}" data-index="${index}">
            <label class="form-check-label text-white bg-dark px-2 py-1 rounded" for="compare-${index}">
                <i class="fas fa-balance-scale me-1"></i>Compare
            </label>
        `;
        
        const cardParent = card.querySelector('.position-relative');
        if (cardParent) {
            cardParent.style.position = 'relative';
            cardParent.appendChild(compareCheckbox);
            
            const checkbox = compareCheckbox.querySelector('input');
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    if (selectedProjects.length < maxComparison) {
                        selectedProjects.push({ index, element: card });
                        updateComparisonPanel();
                    } else {
                        this.checked = false;
                        showNotification('warning', `You can only compare up to ${maxComparison} projects`);
                    }
                } else {
                    selectedProjects = selectedProjects.filter(p => p.index !== index);
                    updateComparisonPanel();
                }
            });
        }
    });
    
    function updateComparisonPanel() {
        let panel = document.getElementById('comparison-panel');
        
        if (selectedProjects.length > 0) {
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'comparison-panel';
                panel.className = 'position-fixed bottom-0 start-0 w-100 bg-white shadow-lg p-3';
                panel.style.cssText = `
                    z-index: 1000;
                    border-top: 3px solid #2BB6E0;
                    animation: slideInUp 0.3s ease;
                `;
                document.body.appendChild(panel);
            }
            
            panel.innerHTML = `
                <div class="container">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${selectedProjects.length} project(s) selected for comparison</strong>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary" onclick="showComparisonModal()">
                                <i class="fas fa-eye me-1"></i>Compare Projects
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
    
    window.showComparisonModal = function() {
        const comparisonData = selectedProjects.map(p => {
            const title = p.element.querySelector('h3, h5').textContent;
            const sector = p.element.querySelector('.badge').textContent;
            const metrics = Array.from(p.element.querySelectorAll('li')).map(li => li.textContent);
            return { title, sector, metrics };
        });
        
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-balance-scale me-2"></i>Project Comparison
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead class="table-light">
                                    <tr>
                                        <th>Criteria</th>
                                        ${comparisonData.map(p => `<th>${p.title}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Sector</strong></td>
                                        ${comparisonData.map(p => `<td>${p.sector}</td>`).join('')}
                                    </tr>
                                    <tr>
                                        <td><strong>Impact Metrics</strong></td>
                                        ${comparisonData.map(p => `
                                            <td><ul class="small mb-0">${p.metrics.map(m => `<li>${m}</li>`).join('')}</ul></td>
                                        `).join('')}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
    };
    
    window.clearComparison = function() {
        selectedProjects = [];
        document.querySelectorAll('.compare-checkbox').forEach(cb => cb.checked = false);
        updateComparisonPanel();
    };
    
    
    // ========================================
    // 8. EXPORT/DOWNLOAD PROJECT LIST
    // ========================================
    function addExportButton() {
        const statusSpan = document.getElementById('filterStatus');
        if (statusSpan) {
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn btn-sm btn-outline-secondary ms-3';
            exportBtn.innerHTML = '<i class="fas fa-download me-1"></i>Export List';
            exportBtn.onclick = exportProjectList;
            statusSpan.parentElement.appendChild(exportBtn);
        }
    }
    
    function exportProjectList() {
        const visibleProjects = Array.from(document.querySelectorAll('.project-item, .card.h-100'))
            .filter(p => p.style.display !== 'none')
            .map(p => {
                const title = p.querySelector('h3, h5').textContent;
                const sector = p.querySelector('.badge')?.textContent || 'N/A';
                return `${title} - ${sector}`;
            });
        
        const text = `SocialTech Innovations - Project List\n\n${visibleProjects.join('\n')}`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'socialtech-projects.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('success', '✓ Project list downloaded!');
    }
    
    addExportButton();
    
    
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
        }, 4000);
    }
    
    
    // ========================================
    // 10. CONSOLE MESSAGE
    // ========================================
    console.log('%c📊 Projects Page Loaded', 'color: #2BB6E0; font-size: 18px; font-weight: bold;');
    console.log('%cExplore our success stories and impact', 'color: #8B4FBF; font-size: 14px;');
    
});


// ========================================
// ADD ANIMATION CSS
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
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
    
    .compare-checkbox {
        cursor: pointer;
    }
    
    .form-check-label {
        cursor: pointer;
        font-size: 0.875rem;
    }
`;
document.head.appendChild(style);