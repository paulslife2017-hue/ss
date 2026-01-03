/**
 * K-Beauty Seoul - Main JavaScript
 * Code-split for better performance
 */

// Language switching
function switchLang(section, lang) {
    // Hide all content for this section
    const contents = document.querySelectorAll(`#${section}-en, #${section}-ja, #${section}-zh`);
    contents.forEach(content => content.classList.remove('active'));
    
    // Remove active from all tabs in this section
    const tabs = document.querySelectorAll(`#${section} .lang-tab`);
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected content
    document.getElementById(`${section}-${lang}`).classList.add('active');
    
    // Activate clicked tab
    event.target.classList.add('active');
}

// Smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
});

// Language selector toggle
function toggleLangMenu() {
    alert('Language: English | 日本語 | 繁體中文');
}

// Export functions to global scope
window.switchLang = switchLang;
window.toggleLangMenu = toggleLangMenu;
