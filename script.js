/**
 * script.js
 *
 * Handles interactive elements for Meet Patel's portfolio:
 * - Theme Toggling (Light/Dark)
 * - Vanta.js Background Initialization & Theme Update
 * - Animate on Scroll (AOS) Initialization
 * - Smooth Scrolling & Active Nav Link Highlighting (via Bootstrap Scrollspy)
 * - Project Filtering
 * - Skill Modal Interaction
 * - Achievement Modal Interaction (NEW)
 * - Contact Form Submission Handling
 * - Back to Top Button
 * - Bootstrap Component Initialization (Tooltips, Modals, etc.)
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors ---
    const htmlElement = document.documentElement;
    const themeToggleButton = document.getElementById('theme-toggle');
    const backToTopButton = document.getElementById('back-to-top');
    const skillModalElement = document.getElementById('skillModal');
    const achievementModalElement = document.getElementById('achievementModal'); // New
    const projectFilterContainer = document.getElementById('project-filters');
    const projectItems = document.querySelectorAll('.project-gallery .project-item');
    const projectGallery = document.querySelector('.project-gallery');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');
    const currentYearSpan = document.getElementById('current-year');
    const navbar = document.getElementById('navbar-main');
    const vantaBackgroundElement = document.getElementById('vanta-bg'); // Vanta container

    // --- State & Constants ---
    const SCROLL_THRESHOLD_BACK_TO_TOP = 300;
    const FORM_STATUS_DISMISS_DELAY = 7000;
    const FILTER_TRANSITION_DELAY = 300;
    const DARK_ICON = '<i class="bi bi-moon-stars-fill"></i>';
    const LIGHT_ICON = '<i class="bi bi-sun-fill"></i>';
    let vantaEffect = null; // To hold the Vanta instance

    // --- Helper Functions ---

    /**
     * Sets the theme on the HTML element, updates the toggle button, stores preference, and triggers Vanta update.
     * @param {string} theme - The theme to set ('light' or 'dark').
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
        // Trigger Vanta update AFTER theme attribute is set
        initializeVantaBackground();
    };

    /**
     * Initializes the Vanta.js NET background effect, handling theme changes.
     */
    const initializeVantaBackground = () => {
        // Ensure Vanta library and container element exist
        if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
            console.error("Vanta.js or Three.js library not found.");
            if (vantaBackgroundElement) vantaBackgroundElement.style.backgroundColor = 'var(--color-bg)'; // Fallback color
            return;
        }
        if (!vantaBackgroundElement) {
            console.error("Vanta background element (#vanta-bg) not found.");
            return;
        }

        // Destroy previous instance if exists (important for theme switching)
        if (vantaEffect) {
            try {
                vantaEffect.destroy();
                console.log("Previous Vanta instance destroyed.");
            } catch (e) {
                console.error("Error destroying Vanta instance:", e);
            }
            vantaEffect = null;
        }

        // Get current theme AFTER it has been set on the HTML element
        const currentTheme = htmlElement.getAttribute('data-bs-theme') || 'light';

        // Vanta Configuration (NET Effect)
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
                // Theme-specific colors (using HEX NUMBERS)
                color: currentTheme === 'dark' ? 0x50e3c2 : 0x4a90e2, // Secondary for dark, Primary for light
                backgroundColor: currentTheme === 'dark' ? 0x121212 : 0xffffff, // Match CSS --color-bg-dark / --color-bg-light
                points: 11.00, // Adjust density
                maxDistance: 20.00, // Adjust connection distance
                spacing: 16.00 // Adjust spacing
            });
            console.log("Vanta.NET initialized for theme:", currentTheme);
        } catch (e) {
             console.error("Error initializing Vanta.NET:", e);
             vantaBackgroundElement.style.backgroundColor = currentTheme === 'dark' ? '#121212' : '#ffffff'; // Fallback color
        }
    };


    /**
     * Initializes the overall theme based on preferences.
     */
    const initializeTheme = () => {
        let storedTheme = null;
        try {
            storedTheme = localStorage.getItem('theme');
        } catch (e) { /* Ignore */ }
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
        // Apply theme (which will also trigger initial Vanta setup)
        applyTheme(initialTheme);
    };

    // --- Initialization Sequence ---

    // 1. Initialize Theme (this also calls initializeVantaBackground)
    initializeTheme();

    // 2. Initialize AOS
    try {
        AOS.init({
            duration: 700,
            once: true,
            offset: 80,
            easing: 'ease-out-cubic',
            disable: 'mobile'
        });
    } catch(e) { console.error("AOS Init failed:", e); }


    // 3. Initialize Bootstrap Tooltips
    try {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    } catch(e) { console.error("Bootstrap Tooltip init failed:", e); }


    // --- Event Listeners ---

    // Theme Toggle Button (Now only needs to call applyTheme)
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme); // applyTheme handles Vanta re-initialization
        });
    }

    // Back to Top Button Visibility
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

    // Achievement Modal Population (NEW)
    if (achievementModalElement) {
        achievementModalElement.addEventListener('show.bs.modal', (event) => {
             try {
                const button = event.relatedTarget; // Card that triggered the modal
                const achievementName = button.getAttribute('data-achievement-name') || 'Achievement Details';
                const achievementDetails = button.getAttribute('data-achievement-details') || 'Details about this achievement.';
                const modalTitle = achievementModalElement.querySelector('#modal-achievement-name');
                const modalBody = achievementModalElement.querySelector('#modal-achievement-details');
                if (modalTitle) modalTitle.textContent = achievementName;
                if (modalBody) modalBody.textContent = achievementDetails;
            } catch (e) { console.error("Error populating achievement modal:", e); }
        });
    }

    // Project Filtering
    if (projectFilterContainer && projectItems.length > 0 && projectGallery) {
        projectFilterContainer.addEventListener('click', (e) => {
             if (e.target && e.target.classList.contains('filter-btn')) {
                 // Deactivate previous button
                 const currentActive = projectFilterContainer.querySelector('.filter-btn.active');
                 if (currentActive) {
                     currentActive.classList.remove('active');
                     currentActive.setAttribute('aria-pressed', 'false');
                 }
                 // Activate clicked button
                 e.target.classList.add('active');
                 e.target.setAttribute('aria-pressed', 'true');

                 const filterValue = e.target.getAttribute('data-filter');
                 projectGallery.classList.add('filtering'); // Optional class for transitions

                 // Filter logic
                 projectItems.forEach(item => {
                     const tags = item.getAttribute('data-tags')?.split(',') || [];
                     const shouldShow = filterValue === 'all' || tags.includes(filterValue);
                     if (shouldShow) {
                         item.classList.remove('hide');
                     } else {
                         item.classList.add('hide');
                     }
                     // Optional: Reset AOS state if desired
                     // item.classList.remove('aos-animate');
                 });

                 // Refresh AOS after filtering
                 setTimeout(() => {
                     AOS.refresh();
                     projectGallery.classList.remove('filtering');
                 }, FILTER_TRANSITION_DELAY);
             }
        });
    }

    // Smooth Scroll for Internal Links
    document.querySelectorAll('a.nav-link[href^="#"], a.footer-link[href^="#"], a.navbar-brand[href^="#"], a.back-to-top-btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = navbar?.offsetHeight || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });

                    // Close mobile navbar
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


    // Enhanced Contact Form Submission
    if (contactForm && formStatus && submitButton) {
        contactForm.addEventListener('submit', async (e) => {
             e.preventDefault();
             e.stopPropagation();

             if (!contactForm.checkValidity()) {
                 contactForm.classList.add('was-validated');
                 formStatus.className = 'alert alert-warning alert-dismissible fade show';
                 formStatus.innerHTML = 'Please check the highlighted fields. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                 return;
             }
             contactForm.classList.add('was-validated');

             const formData = new FormData(contactForm);
             const formAction = contactForm.getAttribute('action');
             const submitButtonOriginalText = submitButton.innerHTML;
             const spinner = submitButton.querySelector('.spinner-border');

             if (!formAction || formAction === "YOUR_FORM_ENDPOINT" || !formAction.includes("formspree") ) { // Basic check
                 console.error("Form submission endpoint is not configured correctly in HTML 'action' attribute.");
                 formStatus.className = 'alert alert-danger show';
                 formStatus.textContent = 'Form submission configuration error.';
                 setTimeout(() => bootstrap.Alert.getOrCreateInstance(formStatus)?.close(), FORM_STATUS_DISMISS_DELAY);
                 return;
             }

             submitButton.disabled = true;
             if(spinner) spinner.classList.remove('d-none');
             submitButton.childNodes[spinner ? 1 : 0].textContent = ' Sending... ';
             formStatus.className = 'alert alert-info show';
             formStatus.textContent = 'Sending your message...';

             try {
                 const response = await fetch(formAction, {
                     method: 'POST',
                     body: formData,
                     headers: { 'Accept': 'application/json' }
                 });

                 if (response.ok) {
                     formStatus.className = 'alert alert-success show';
                     formStatus.textContent = 'Message sent successfully! Thank you.';
                     contactForm.reset();
                     contactForm.classList.remove('was-validated');
                 } else {
                     let errorMessage = 'An error occurred during submission.';
                     try {
                         const errorData = await response.json();
                         errorMessage = errorData.error || errorData.message || `Server Error: ${response.status} ${response.statusText}`;
                     } catch (parseError) {
                         errorMessage = `Server Error: ${response.status} ${response.statusText}`;
                     }
                     throw new Error(errorMessage);
                 }

             } catch (error) {
                 console.error('Form submission error:', error);
                 formStatus.className = 'alert alert-danger show';
                 formStatus.textContent = `Oops! ${error.message || 'A network error occurred.'}`;
             } finally {
                 submitButton.disabled = false;
                 submitButton.innerHTML = submitButtonOriginalText;
                 setTimeout(() => bootstrap.Alert.getOrCreateInstance(formStatus)?.close(), FORM_STATUS_DISMISS_DELAY);
             }
        });
    }

    // Update Footer Year
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded
