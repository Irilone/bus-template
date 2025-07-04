// Vaccine Bus JavaScript - Scoped to #vaccine-bjarred-app

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get the app container
    const app = document.getElementById('vaccine-bjarred-app');
    if (!app) return; // Exit if app container not found
    
    // Smooth scrolling for anchor links within the app
    app.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // Add active class to price toggle labels
    const priceToggles = app.querySelectorAll('.price-toggle-input');
    priceToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            // Remove active class from all labels
            app.querySelectorAll('.price-toggle-label').forEach(label => {
                label.classList.remove('active');
            });
            // Add active class to the corresponding label
            const label = app.querySelector(`label[for="${this.id}"]`);
            if (label) {
                label.classList.add('active');
            }
        });
    });
    
    // Enhance details/summary elements with smooth animations
    const details = app.querySelectorAll('details');
    details.forEach(detail => {
        const summary = detail.querySelector('summary');
        const content = detail.querySelector('.vaccine-content, .faq-content');
        
        if (summary && content) {
            // Add transition for smooth opening/closing
            content.style.transition = 'max-height 0.3s ease-out';
            
            summary.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (detail.open) {
                    // Closing
                    content.style.maxHeight = content.scrollHeight + 'px';
                    setTimeout(() => {
                        content.style.maxHeight = '0';
                    }, 10);
                    setTimeout(() => {
                        detail.open = false;
                    }, 300);
                } else {
                    // Opening
                    detail.open = true;
                    content.style.maxHeight = '0';
                    setTimeout(() => {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }, 10);
                }
            });
        }
    });
    
    // Add hover effect to cards within the app
    const cards = app.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--vb-shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--vb-shadow-sm)';
        });
    });
    
    // Lazy loading for images within the app
    const images = app.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Add print styles
    const printStyles = `
        @media print {
            #vaccine-bjarred-app .price-toggles { display: none; }
            #vaccine-bjarred-app .price-col, #vaccine-bjarred-app .price-val { display: table-cell !important; }
            #vaccine-bjarred-app details { open: true; }
            #vaccine-bjarred-app .vaccine-content, #vaccine-bjarred-app .faq-content { display: block !important; }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
    
    // Accessibility improvements
    // Add keyboard navigation for price toggles
    app.querySelectorAll('.price-toggle-label').forEach((label, index, labels) => {
        label.setAttribute('tabindex', '0');
        label.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowRight' && index < labels.length - 1) {
                labels[index + 1].focus();
            } else if (e.key === 'ArrowLeft' && index > 0) {
                labels[index - 1].focus();
            }
        });
    });
    
    console.log('Vaccine Bus scripts loaded successfully');
});