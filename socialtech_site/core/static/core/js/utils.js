// ============================================
// UTILS.JS - Global Utility Functions
// Helper functions used across the site
// ============================================

(function() {
    'use strict';
    
    // Create Utils namespace
    window.Utils = window.Utils || {};
    
    
    // ========================================
    // 1. DEBOUNCE FUNCTION
    // ========================================
    Utils.debounce = function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) func.apply(context, args);
        };
    };
    
    
    // ========================================
    // 2. THROTTLE FUNCTION
    // ========================================
    Utils.throttle = function(func, limit) {
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
    // 3. COPY TO CLIPBOARD
    // ========================================
    Utils.copyToClipboard = function(text, successMessage = 'Copied!') {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).then(() => {
                Utils.showToast(successMessage, 'success');
                return true;
            }).catch(err => {
                console.error('Failed to copy:', err);
                return false;
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                textArea.remove();
                if (successful) {
                    Utils.showToast(successMessage, 'success');
                }
                return successful;
            } catch (err) {
                console.error('Fallback copy failed:', err);
                textArea.remove();
                return false;
            }
        }
    };
    
    
    // ========================================
    // 4. TOAST NOTIFICATION
    // ========================================
    Utils.showToast = function(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    };
    
    
    // ========================================
    // 5. FORMAT DATE
    // ========================================
    Utils.formatDate = function(date, format = 'MM/DD/YYYY') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        const formats = {
            'MM/DD/YYYY': `${month}/${day}/${year}`,
            'DD/MM/YYYY': `${day}/${month}/${year}`,
            'YYYY-MM-DD': `${year}-${month}-${day}`,
            'Month DD, YYYY': `${d.toLocaleString('default', { month: 'long' })} ${day}, ${year}`
        };
        
        return formats[format] || `${month}/${day}/${year}`;
    };
    
    
    // ========================================
    // 6. FORMAT CURRENCY
    // ========================================
    Utils.formatCurrency = function(amount, currency = 'GHS') {
        const symbols = {
            'GHS': '₵',
            'USD': ',
            'EUR': '€',
            'GBP': '£'
        };
        
        const symbol = symbols[currency] || currency;
        const formatted = parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        return `${symbol}${formatted}`;
    };
    
    
    // ========================================
    // 7. VALIDATE EMAIL
    // ========================================
    Utils.validateEmail = function(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    
    
    // ========================================
    // 8. VALIDATE PHONE
    // ========================================
    Utils.validatePhone = function(phone) {
        // Ghana phone number format: +233XXXXXXXXX or 0XXXXXXXXXX
        const regex = /^(\+233|0)[0-9]{9}$/;
        return regex.test(phone.replace(/\s/g, ''));
    };
    
    
    // ========================================
    // 9. GENERATE UUID
    // ========================================
    Utils.generateUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    
    
    // ========================================
    // 10. SLUGIFY STRING
    // ========================================
    Utils.slugify = function(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };
    
    
    // ========================================
    // 11. TRUNCATE TEXT
    // ========================================
    Utils.truncate = function(text, length = 100, suffix = '...') {
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + suffix;
    };
    
    
    // ========================================
    // 12. CAPITALIZE WORDS
    // ========================================
    Utils.capitalize = function(text) {
        return text.replace(/\b\w/g, char => char.toUpperCase());
    };
    
    
    // ========================================
    // 13. GET URL PARAMETER
    // ========================================
    Utils.getUrlParameter = function(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    
    
    // ========================================
    // 14. SET URL PARAMETER
    // ========================================
    Utils.setUrlParameter = function(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    };
    
    
    // ========================================
    // 15. SMOOTH SCROLL TO ELEMENT
    // ========================================
    Utils.scrollToElement = function(element, offset = 100) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (el) {
            const targetPosition = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };
    
    
    // ========================================
    // 16. CHECK IF ELEMENT IN VIEWPORT
    // ========================================
    Utils.isInViewport = function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    
    // ========================================
    // 17. GET ELEMENT OFFSET
    // ========================================
    Utils.getOffset = function(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    };
    
    
    // ========================================
    // 18. WAIT FOR ELEMENT
    // ========================================
    Utils.waitForElement = function(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    };
    
    
    // ========================================
    // 19. FETCH WITH TIMEOUT
    // ========================================
    Utils.fetchWithTimeout = async function(url, options = {}, timeout = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };
    
    
    // ========================================
    // 20. LOCAL STORAGE HELPERS
    // ========================================
    Utils.storage = {
        set: function(key, value, expiryDays = null) {
            const item = {
                value: value,
                timestamp: Date.now()
            };
            
            if (expiryDays) {
                item.expiry = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);
            }
            
            try {
                localStorage.setItem(key, JSON.stringify(item));
                return true;
            } catch (e) {
                console.error('LocalStorage error:', e);
                return false;
            }
        },
        
        get: function(key) {
            try {
                const itemStr = localStorage.getItem(key);
                if (!itemStr) return null;
                
                const item = JSON.parse(itemStr);
                
                // Check if expired
                if (item.expiry && Date.now() > item.expiry) {
                    localStorage.removeItem(key);
                    return null;
                }
                
                return item.value;
            } catch (e) {
                console.error('LocalStorage error:', e);
                return null;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('LocalStorage error:', e);
                return false;
            }
        },
        
        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('LocalStorage error:', e);
                return false;
            }
        }
    };
    
    
    // ========================================
    // 21. DEVICE DETECTION
    // ========================================
    Utils.device = {
        isMobile: function() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        isTablet: function() {
            return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase());
        },
        
        isDesktop: function() {
            return !this.isMobile() && !this.isTablet();
        },
        
        isIOS: function() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        },
        
        isAndroid: function() {
            return /Android/.test(navigator.userAgent);
        }
    };
    
    
    // ========================================
    // 22. RANDOM HELPERS
    // ========================================
    Utils.random = {
        number: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        choice: function(array) {
            return array[Math.floor(Math.random() * array.length)];
        },
        
        color: function() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        },
        
        string: function(length = 10) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
    };
    
    
    // ========================================
    // 23. ARRAY HELPERS
    // ========================================
    Utils.array = {
        shuffle: function(array) {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        },
        
        unique: function(array) {
            return [...new Set(array)];
        },
        
        chunk: function(array, size) {
            const chunks = [];
            for (let i = 0; i < array.length; i += size) {
                chunks.push(array.slice(i, i + size));
            }
            return chunks;
        },
        
        groupBy: function(array, key) {
            return array.reduce((result, item) => {
                const group = item[key];
                result[group] = result[group] || [];
                result[group].push(item);
                return result;
            }, {});
        }
    };
    
    
    // ========================================
    // 24. LOADING SPINNER
    // ========================================
    Utils.showLoader = function(message = 'Loading...') {
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = `
            <div class="loader-backdrop">
                <div class="loader-content">
                    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                    <p class="mt-3 text-white">${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    };
    
    Utils.hideLoader = function() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    };
    
    
    // ========================================
    // 25. MODAL HELPERS
    // ========================================
    Utils.modal = {
        show: function(title, content, buttons = []) {
            const modalId = 'util-modal-' + Date.now();
            
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = modalId;
            modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        ${buttons.length > 0 ? `
                            <div class="modal-footer">
                                ${buttons.map(btn => `
                                    <button type="button" class="btn btn-${btn.type || 'secondary'}" 
                                            onclick="${btn.onClick || ''}" ${btn.dismiss ? 'data-bs-dismiss="modal"' : ''}>
                                        ${btn.text}
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
            
            modal.addEventListener('hidden.bs.modal', () => modal.remove());
            
            return bsModal;
        },
        
        confirm: function(message, onConfirm, onCancel) {
            return this.show('Confirm', message, [
                { text: 'Cancel', type: 'secondary', dismiss: true, onClick: onCancel },
                { text: 'Confirm', type: 'primary', dismiss: true, onClick: onConfirm }
            ]);
        },
        
        alert: function(message, type = 'info') {
            const icons = {
                success: 'check-circle',
                danger: 'exclamation-triangle',
                warning: 'exclamation-circle',
                info: 'info-circle'
            };
            
            const content = `
                <div class="text-center">
                    <i class="fas fa-${icons[type]} fa-4x text-${type} mb-3"></i>
                    <p>${message}</p>
                </div>
            `;
            
            return this.show('', content, [
                { text: 'OK', type: 'primary', dismiss: true }
            ]);
        }
    };
    
    
    // ========================================
    // 26. PRINT HELPERS
    // ========================================
    Utils.print = function(selector) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">');
        printWindow.document.write('</head><body>');
        printWindow.document.write(element.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };
    
    
    // ========================================
    // 27. EXPORT DATA
    // ========================================
    Utils.exportToCSV = function(data, filename = 'export.csv') {
        const csv = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    Utils.exportToJSON = function(data, filename = 'export.json') {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    
    // ========================================
    // LOG UTILS LOADED
    // ========================================
    console.log('🛠️ Utils loaded successfully');
    
})();


// ========================================
// UTILITY STYLES
// ========================================
const utilStyles = document.createElement('style');
utilStyles.textContent = `
    /* Toast Notifications */
    .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
    }
    
    .toast-notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .toast-notification.toast-success {
        border-left: 4px solid #28a745;
    }
    
    .toast-notification.toast-error {
        border-left: 4px solid #dc3545;
    }
    
    .toast-notification.toast-info {
        border-left: 4px solid #17a2b8;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .toast-content i {
        font-size: 1.25rem;
    }
    
    .toast-success .toast-content i {
        color: #28a745;
    }
    
    .toast-error .toast-content i {
        color: #dc3545;
    }
    
    .toast-info .toast-content i {
        color: #17a2b8;
    }
    
    /* Global Loader */
    #global-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99999;
        transition: opacity 0.3s ease;
    }
    
    .loader-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .loader-content {
        text-align: center;
    }
    
    /* Smooth Transitions */
    * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`;
document.head.appendChild(utilStyles);