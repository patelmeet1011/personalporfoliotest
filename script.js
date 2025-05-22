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
 * - Achievement Modal Interaction
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
     * Initializes the Vanta.js background effect, handling theme changes.
     */
    const initializeVantaBackground = () => {
        if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
            console.error("Vanta.js or Three.js library not found.");
            if (vantaBackgroundElement) vantaBackgroundElement.style.backgroundColor = 'var(--color-bg)';
            return;
        }
        if (!vantaBackgroundElement) {
            console.error("Vanta background element (#vanta-bg) not found.");
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

        // Using the original Vanta.js parameters from your initial script
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
                color: currentTheme === 'dark' ? 0x50e3c2 : 0x4a90e2, // Secondary for dark, Primary for light
                backgroundColor: currentTheme === 'dark' ? 0x121212 : 0xffffff, // Match CSS --color-bg-dark / --color-bg-light
                points: 11.00,
                maxDistance: 20.00,
                spacing: 16.00
            });
            // console.log("Vanta.NET initialized with original parameters for theme:", currentTheme);
        } catch (e) {
             console.error("Error initializing Vanta.NET:", e);
             if (vantaBackgroundElement) vantaBackgroundElement.style.backgroundColor = currentTheme === 'dark' ? '#121212' : '#ffffff';
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
        applyTheme(initialTheme);
    };

    // --- Initialization Sequence ---

    initializeTheme(); // This also calls initializeVantaBackground

    try {
        AOS.init({
            duration: 700,
            once: true,
            offset: 80,
            easing: 'ease-out-cubic',
            disable: 'mobile'
        });
    } catch(e) { console.error("AOS Init failed:", e); }

    try {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    } catch(e) { console.error("Bootstrap Tooltip init failed:", e); }


    // --- Event Listeners ---

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    if (backToTopButton) {
        const toggleBackToTopVisibility = () => {
            if (window.pageYOffset > SCROLL_THRESHOLD_BACK_TO_TOP) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        };
        window.addEventListener('scroll', toggleBackToTopVisibility);
        toggleBackToTopVisibility();
    }

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
                 projectGallery.classList.add('filtering');

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
                     AOS.refresh();
                     projectGallery.classList.remove('filtering');
                 }, FILTER_TRANSITION_DELAY);
             }
        });
    }

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

             if (!formAction || formAction === "YOUR_FORM_ENDPOINT" || !formAction.includes("formspree") ) {
                 console.error("Form submission endpoint is not configured correctly in HTML 'action' attribute.");
                 formStatus.className = 'alert alert-danger alert-dismissible fade show';
                 formStatus.innerHTML = 'Form submission configuration error. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                 setTimeout(() => {
                    const alertInstance = bootstrap.Alert.getOrCreateInstance(formStatus);
                    if (alertInstance) alertInstance.close();
                 }, FORM_STATUS_DISMISS_DELAY);
                 return;
             }

             submitButton.disabled = true;
             if(spinner) spinner.classList.remove('d-none');
             submitButton.childNodes[spinner ? 1 : 0].textContent = ' Sending... ';
             formStatus.className = 'alert alert-info alert-dismissible fade show';
             formStatus.innerHTML = 'Sending your message... <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';


             try {
                 const response = await fetch(formAction, {
                     method: 'POST',
                     body: formData,
                     headers: { 'Accept': 'application/json' }
                 });

                 if (response.ok) {
                     formStatus.className = 'alert alert-success alert-dismissible fade show';
                     formStatus.innerHTML = 'Message sent successfully! Thank you. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
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
                 formStatus.className = 'alert alert-danger alert-dismissible fade show';
                 formStatus.innerHTML = `Oops! ${error.message || 'A network error occurred.'} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
             } finally {
                 submitButton.disabled = false;
                 submitButton.innerHTML = submitButtonOriginalText;
                 setTimeout(() => {
                    const alertInstance = bootstrap.Alert.getOrCreateInstance(formStatus);
                    if (alertInstance) alertInstance.close();
                 }, FORM_STATUS_DISMISS_DELAY);
             }
        });
    }

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded
