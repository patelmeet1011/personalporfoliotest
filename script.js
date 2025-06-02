/**
 * @file script.js
 * @description Handles all interactive elements and dynamic functionality for Meet Patel's portfolio.
 * This includes theme toggling, Vanta.js background, AOS animations, smooth scrolling,
 * project filtering, modal interactions, contact form submission, and more.
 * @author Meet Patel
 * @see {@link https://patelmeet1011.github.io/personalporfoliotest/|Live Portfolio}
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors (Cached for performance) ---
    const htmlElement = document.documentElement;
    const themeToggleButton = document.getElementById('theme-toggle');
    const backToTopButton = document.getElementById('back-to-top');
    const skillModalElement = document.getElementById('skillModal');
    const achievementModalElement = document.getElementById('achievementModal');
    const projectFilterContainer = document.getElementById('project-filters');
    const projectItems = document.querySelectorAll('.project-gallery .project-item');
    const projectGallery = document.querySelector('.project-gallery');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');
    const currentYearSpan = document.getElementById('current-year');
    const navbar = document.getElementById('navbar-main');
    const vantaBackgroundElement = document.getElementById('vanta-bg');

    // --- Constants & Configuration ---
    /** @const {number} Scroll threshold in pixels to show the 'Back to Top' button. */
    const SCROLL_THRESHOLD_BACK_TO_TOP = 300;
    /** @const {number} Delay in milliseconds before dismissing contact form status messages. */
    const FORM_STATUS_DISMISS_DELAY = 7000;
    /** @const {number} Transition delay in milliseconds for project filtering animations. */
    const FILTER_TRANSITION_DELAY = 300;
    /** @const {string} HTML for the dark mode icon (moon). */
    const DARK_ICON = '<i class="bi bi-moon-stars-fill"></i>';
    /** @const {string} HTML for the light mode icon (sun). */
    const LIGHT_ICON = '<i class="bi bi-sun-fill"></i>';
    
    /** * @type {object|null} Holds the Vanta.js instance to allow for destruction and recreation.
     * @see {@link https://www.vantajs.com/|Vanta.js}
     */
    let vantaEffect = null;

    // --- Core Functions ---

    /**
     * Applies the selected theme to the HTML element, updates the toggle button icon,
     * stores the theme preference in localStorage, and re-initializes the Vanta.js background.
     * @param {string} theme - The theme to apply ('light' or 'dark').
     */
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-bs-theme', theme);
        if (themeToggleButton) {
            themeToggleButton.innerHTML = theme === 'dark' ? LIGHT_ICON : DARK_ICON;
            themeToggleButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('LocalStorage is not available. Theme preference will not be saved.');
        }
        // Re-initialize Vanta background to match the new theme
        initializeVantaBackground();
    };

    /**
     * Initializes or re-initializes the Vanta.js animated background.
     * It destroys any existing instance before creating a new one to reflect theme changes.
     * Handles cases where Vanta.js or Three.js libraries might not be loaded.
     */
    const initializeVantaBackground = () => {
        if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
            console.error("Vanta.js or Three.js library not found.");
            if (vantaBackgroundElement) vantaBackgroundElement.style.backgroundColor = 'var(--color-bg-dark)';
            return;
        }
        if (!vantaBackgroundElement) {
            // console.error("Vanta background element (#vanta-bg) not found."); // Optional: less verbose logging
            return;
        }

        if (vantaEffect) {
            try {
                vantaEffect.destroy();
            } catch (e) {
                console.error("Error destroying Vanta instance:", e);
            }
            vantaEffect = null;
        }

        const currentTheme = htmlElement.getAttribute('data-bs-theme') || 'light';

        try {
            vantaEffect = VANTA.NET({
                el: "#vanta-bg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: currentTheme === 'dark' ? 0x50e3c2 : 0x4a90e2, // Mint for dark, Blue for light
                backgroundColor: currentTheme === 'dark' ? 0x121212 : 0x001f3f, // Dark for dark, Dark Blue for light
                points: 11.00,
                maxDistance: 20.00,
                spacing: 16.00
            });
        } catch (e) {
             console.error("Error initializing Vanta.NET:", e);
             if (vantaBackgroundElement) vantaBackgroundElement.style.backgroundColor = currentTheme === 'dark' ? '#121212' : '#001f3f';
        }
    };

    /**
     * Initializes the website's theme based on localStorage preference or system settings.
     * Calls applyTheme() which in turn calls initializeVantaBackground().
     */
    const initializeTheme = () => {
        let storedTheme = null;
        try {
            storedTheme = localStorage.getItem('theme');
        } catch (e) { /* LocalStorage might be disabled or unavailable */ }
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
        applyTheme(initialTheme);
    };

    // --- Initialization Sequence ---
    initializeTheme(); // Sets theme and Vanta background

    // Initialize Animate on Scroll (AOS) library
    try {
        AOS.init({
            duration: 700,
            once: true,
            offset: 80,
            easing: 'ease-out-cubic',
            disable: 'mobile' // Consider enabling for mobile if effects are subtle
        });
    } catch(e) { console.error("AOS Init failed:", e); }

    // Initialize Bootstrap Tooltips
    try {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    } catch(e) { console.error("Bootstrap Tooltip init failed:", e); }


    // --- Event Listeners ---

    // Theme Toggle Button Click Handler
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Back to Top Button Scroll Handler
    if (backToTopButton) {
        const toggleBackToTopVisibility = () => {
            if (window.pageYOffset > SCROLL_THRESHOLD_BACK_TO_TOP) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        };
        window.addEventListener('scroll', toggleBackToTopVisibility);
        toggleBackToTopVisibility(); // Initial check
    }

    // Skill Modal Population
    if (skillModalElement) {
        skillModalElement.addEventListener('show.bs.modal', (event) => {
            try {
                const button = event.relatedTarget;
                const skillName = button.getAttribute('data-skill-name') || 'Skill Details';
                const skillDetails = button.getAttribute('data-skill-details') || 'No details provided.';
                const modalTitle = skillModalElement.querySelector('#modal-skill-name');
                const modalBody = skillModalElement.querySelector('#modal-skill-details');
                if (modalTitle) modalTitle.textContent = skillName;
                if (modalBody) modalBody.textContent = skillDetails;
            } catch (e) { console.error("Error populating skill modal:", e); }
        });
    }

    // Achievement Modal Population
    if (achievementModalElement) {
        achievementModalElement.addEventListener('show.bs.modal', (event) => {
             try {
                const button = event.relatedTarget;
                const achievementName = button.getAttribute('data-achievement-name') || 'Achievement Details';
                const achievementDetails = button.getAttribute('data-achievement-details') || 'Details about this achievement.';
                const modalTitle = achievementModalElement.querySelector('#modal-achievement-name');
                const modalBody = achievementModalElement.querySelector('#modal-achievement-details');
                if (modalTitle) modalTitle.textContent = achievementName;
                if (modalBody) modalBody.textContent = achievementDetails;
            } catch (e) { console.error("Error populating achievement modal:", e); }
        });
    }

    // Project Filtering Logic
    if (projectFilterContainer && projectItems.length > 0 && projectGallery) {
        projectFilterContainer.addEventListener('click', (e) => {
             if (e.target && e.target.classList.contains('filter-btn')) {
                 const currentActive = projectFilterContainer.querySelector('.filter-btn.active');
                 if (currentActive) {
                     currentActive.classList.remove('active');
                     currentActive.setAttribute('aria-pressed', 'false');
                 }
                 e.target.classList.add('active');
                 e.target.setAttribute('aria-pressed', 'true');

                 const filterValue = e.target.getAttribute('data-filter');
                 projectGallery.classList.add('filtering'); // For CSS transitions

                 projectItems.forEach(item => {
                     const tags = item.getAttribute('data-tags')?.split(',') || [];
                     const shouldShow = filterValue === 'all' || tags.includes(filterValue);
                     if (shouldShow) {
                         item.classList.remove('hide');
                     } else {
                         item.classList.add('hide');
                     }
                 });

                 setTimeout(() => {
                     if (typeof AOS !== 'undefined') AOS.refresh(); // Refresh AOS for newly visible items
                     projectGallery.classList.remove('filtering');
                 }, FILTER_TRANSITION_DELAY);
             }
        });
    }

    // Smooth Scrolling for Internal Page Links
    document.querySelectorAll('a.nav-link[href^="#"], a.footer-link[href^="#"], a.navbar-brand[href^="#"], a.back-to-top-btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's a valid same-page anchor
            if (href && href.startsWith('#') && href.length > 1) { 
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = navbar?.offsetHeight || parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').replace('px', '')) || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });

                    // Collapse navbar on mobile after click
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarToggler && !navbarToggler.classList.contains('collapsed') && navbarCollapse?.classList.contains('show')) {
                         const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, {toggle: false});
                         bsCollapse.hide();
                    }
                }
            }
        });
    });

    // Contact Form Submission Handler
    if (contactForm && formStatus && submitButton) {
        contactForm.addEventListener('submit', async (e) => {
             e.preventDefault();
             e.stopPropagation();

             // Bootstrap validation
             if (!contactForm.checkValidity()) {
                 contactForm.classList.add('was-validated');
                 formStatus.className = 'alert alert-warning alert-dismissible fade show';
                 formStatus.innerHTML = 'Please check the highlighted fields. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                 return;
             }
             contactForm.classList.add('was-validated'); // Show validation styles if all good before submit

             const formData = new FormData(contactForm);
             const formAction = contactForm.getAttribute('action'); // Get endpoint from HTML
             const submitButtonOriginalText = submitButton.innerHTML;
             const spinner = submitButton.querySelector('.spinner-border');

             // Critical: Ensure formAction is configured before attempting submission
             if (!formAction || formAction === "YOUR_FORM_ENDPOINT" || !formAction.includes("formspree") ) { // Basic check for Formspree
                 console.error("Contact form submission endpoint is not configured correctly in HTML 'action' attribute.");
                 formStatus.className = 'alert alert-danger alert-dismissible fade show';
                 formStatus.innerHTML = 'Form submission is currently unavailable. Please try again later or contact me directly via email. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                 setTimeout(() => {
                    const alertInstance = bootstrap.Alert.getOrCreateInstance(formStatus);
                    if (alertInstance) alertInstance.close();
                 }, FORM_STATUS_DISMISS_DELAY);
                 return;
             }

             // Update UI for submission attempt
             submitButton.disabled = true;
             if(spinner) spinner.classList.remove('d-none');
             // Assuming the text content is the first child node if spinner is present, otherwise the only child.
             submitButton.childNodes[spinner ? 1 : 0].textContent = ' Sending... '; 
             formStatus.className = 'alert alert-info alert-dismissible fade show';
             formStatus.innerHTML = 'Sending your message... <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';


             try {
                 const response = await fetch(formAction, {
                     method: 'POST',
                     body: formData,
                     headers: { 'Accept': 'application/json' } // Formspree requirement
                 });

                 if (response.ok) {
                     formStatus.className = 'alert alert-success alert-dismissible fade show';
                     formStatus.innerHTML = 'Message sent successfully! Thank you. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                     contactForm.reset();
                     contactForm.classList.remove('was-validated');
                 } else {
                     // Attempt to parse error from Formspree or use generic message
                     let errorMessage = 'An error occurred during submission.';
                     try {
                         const errorData = await response.json();
                         errorMessage = errorData.error || errorData.message || `Server Error: ${response.status} ${response.statusText}`;
                     } catch (parseError) {
                         // If parsing fails, stick to the status text
                         errorMessage = `Server Error: ${response.status} ${response.statusText}`;
                     }
                     throw new Error(errorMessage); // Trigger the catch block
                 }

             } catch (error) {
                 console.error('Form submission error:', error);
                 formStatus.className = 'alert alert-danger alert-dismissible fade show';
                 formStatus.innerHTML = `Oops! ${error.message || 'A network error occurred.'} Please try again or contact me via email. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
             } finally {
                 submitButton.disabled = false;
                 submitButton.innerHTML = submitButtonOriginalText; // Restore original button text and icon
                 // Auto-dismiss the status message after a delay
                 setTimeout(() => {
                    const alertInstance = bootstrap.Alert.getOrCreateInstance(formStatus);
                    if (alertInstance) alertInstance.close();
                 }, FORM_STATUS_DISMISS_DELAY);
             }
        });
    }

    // Update current year in footer (if element exists)
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded
