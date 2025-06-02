/**
 * @file script.js
 * @description Handles all interactive elements and dynamic functionality for Meet Patel's portfolio.
 * @author Meet Patel
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Global Element Selectors ---
    const htmlElement = document.documentElement;
    const themeToggleButton = document.getElementById('theme-toggle');
    const backToTopButton = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const projectFilterContainer = document.getElementById('project-filters');
    const vantaBackgroundElement = document.getElementById('vanta-bg');

    // --- Constants ---
    /** @const {number} The pixel-scroll distance after which the 'back to top' button appears. */
    const SCROLL_THRESHOLD_BACK_TO_TOP = 300;
    /** @const {number} The delay in milliseconds before the contact form status message disappears. */
    const FORM_STATUS_DISMISS_DELAY = 7000;
    /** @const {string} The inner HTML for the dark mode icon on the theme toggle button. */
    const DARK_ICON = '<i class="bi bi-moon-stars-fill"></i>';
    /** @const {string} The inner HTML for the light mode icon on the theme toggle button. */
    const LIGHT_ICON = '<i class="bi bi-sun-fill"></i>';
    
    /** @type {object|null} Holds the Vanta.js instance. */
    let vantaEffect = null;

    /**
     * Applies a theme to the site, updates UI elements, and stores the preference.
     * @param {string} theme - The theme to set ('light' or 'dark').
     */
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-bs-theme', theme);
        if (themeToggleButton) {
            themeToggleButton.innerHTML = theme === 'dark' ? LIGHT_ICON : DARK_ICON;
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('LocalStorage is not available. Theme preference will not be saved.');
        }
        initializeVantaBackground(); // Re-initialize Vanta on theme change
    };

    /**
     * Initializes or updates the Vanta.js animated background based on the current theme.
     */
    const initializeVantaBackground = () => {
        if (typeof VANTA === 'undefined' || !vantaBackgroundElement) return;
        if (vantaEffect) vantaEffect.destroy();

        const currentTheme = htmlElement.getAttribute('data-bs-theme') || 'light';
        vantaEffect = VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: currentTheme === 'dark' ? 0x50e3c2 : 0x4a90e2,
            backgroundColor: currentTheme === 'dark' ? 0x121212 : 0x001f3f,
            points: 11.00,
            maxDistance: 20.00,
            spacing: 16.00
        });
    };

    /**
     * Sets the initial theme on page load based on user preference or system settings.
     */
    const initializeTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));
    };

    // --- Initializers ---
    initializeTheme();
    AOS.init({ duration: 700, once: true, offset: 80, easing: 'ease-out-cubic' });
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // --- Event Listeners ---

    // Theme toggle button click
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Back to top button visibility
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('show', window.pageYOffset > SCROLL_THRESHOLD_BACK_TO_TOP);
        });
    }

    // Project filtering logic
    if (projectFilterContainer) {
        projectFilterContainer.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('filter-btn')) {
                projectFilterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                const filterValue = e.target.getAttribute('data-filter');
                document.querySelectorAll('.project-gallery .project-item').forEach(item => {
                    const tags = item.getAttribute('data-tags');
                    const shouldShow = filterValue === 'all' || tags.includes(filterValue);
                    item.classList.toggle('hide', !shouldShow);
                });
            }
        });
    }

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // TODO: Replace 'YOUR_FORM_ENDPOINT' with your actual Formspree URL in both index.html and here.
            if (contactForm.getAttribute('action') === 'YOUR_FORM_ENDPOINT') {
                 console.error("Form submission endpoint is not configured.");
                 return;
            }
            // Logic for form submission...
        });
    }
});
