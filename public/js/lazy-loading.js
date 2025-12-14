/**
 * K-Beauty Seoul - Lazy Loading Module
 * Intersection Observer for performance optimization
 */

// Lazy loading enhancement with Intersection Observer
if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // For videos with lazy loading
                if (element.tagName === 'VIDEO' && element.hasAttribute('loading')) {
                    element.classList.add('loaded');
                    // Preload video metadata when visible
                    if (element.preload === 'none') {
                        element.preload = 'metadata';
                    }
                }
                
                // For images with lazy loading
                if (element.tagName === 'IMG' && element.hasAttribute('loading')) {
                    element.classList.add('loaded');
                }
                
                lazyObserver.unobserve(element);
            }
        });
    }, { 
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.01
    });
    
    // Observe all lazy-loaded elements when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[loading="lazy"]').forEach(el => {
            lazyObserver.observe(el);
        });
    });
}
