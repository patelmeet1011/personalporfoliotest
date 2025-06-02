/**
 * @file script.js
 * @description Handles all interactive elements and dynamic functionality for Meet Patel's portfolio.
 * This includes theme toggling, Vanta.js background, AOS animations, smooth scrolling,
 * project filtering, modal interactions, contact form submission, and more, all designed
 * to contribute to an exceptional user experience (Guide Section V).
 * @author Meet Patel
 * @see {@link https://patelmeet1011.github.io/personalporfoliotest/|Live Portfolio}
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors (Cached for performance and clarity) ---
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
    /** @const {number} Scroll threshold in pixels to show the 'Back to Top' button (UX Enhancement - Guide Section V). */
    const SCROLL_THRESHOLD_BACK_TO_TOP = 300;
    /** @const {number} Delay in milliseconds before dismissing contact form status messages. */
    const FORM_STATUS_DISMISS_DELAY = 7000;
    /** @const {number} Transition delay in milliseconds for project filtering animations (UX Enhancement - Guide Section V.B). */
    const FILTER_TRANSITION_DELAY = 300;
    /** @const {string} HTML for the dark mode icon (moon). */
    const DARK_ICON = '<i class="bi bi-moon-stars-fill"></i>';
    /** @const {string} HTML for the light mode icon (sun). */
    const LIGHT_ICON = '<i class="bi bi-sun-fill"></i>';
    
    /** * @type {object|null} Holds the Vanta.js instance. This allows for destruction and recreation 
     * if needed, for example, when themes change or if the effect needs to be dynamically altered.
     * @see {@link https://www.vantajs.com/|Vanta.js}
     */
    let vantaEffect = null;

    // --- Core Functions ---

    /**
     * Applies the selected theme ('light' or 'dark') to the HTML element.
     * Updates the theme toggle button's icon and ARIA label accordingly.
     * Stores the selected theme in localStorage for persistence across sessions.
     * Re-initializes the Vanta.js background to match the new theme.
     * (Supports Guide Section IV.A - Consistency, IV.B - Color Palette, IV.D - Dark Themes)
     * @param {string} theme - The theme to apply (e.g., 'light', 'dark').
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
        initializeVantaBackground(); // Ensure Vanta background updates with theme
    };

    /**
     * Initializes or re-initializes the Vanta.js animated background effect.
     * This function checks for the existence of VANTA and THREE libraries.
     * If an old Vanta effect exists, it's destroyed before creating a new one.
     * The parameters for the Vanta effect (color, backgroundColor) are chosen based on the current theme.
     * (Supports Guide Section IV.D - Backgrounds, V.B - Interactive Elements)
     */
    const initializeVantaBackground = () => {
        if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
            console.error("Vanta.js or Three.js library not found. Animated background will not load.");
            if (vantaBackgroundElement) vantaBackgroundElement.style.backgroundColor = 'var(--color-bg-dark)'; // Fallback static color
            return;
        }
        if (!vantaBackgroundElement) {
            // console.warn("Vanta background element (#vanta-bg) not found in the DOM."); // Optional: for debugging
            return;
        }

        if (vantaEffect) { // If an instance already exists, destroy it first
            try {
                vantaEffect.destroy();
            } catch (e) {
                console.error("Error destroying existing Vanta instance:", e);
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
                scaleMobile: 1.00, // Maintain scale on mobile
                color: currentTheme === 'dark' ? 0x50e3c2 : 0x4a90e2, // Theme-dependent line color
                backgroundColor: currentTheme === 'dark' ? 0x121212 : 0x001f3f, // Theme-dependent background color
                points: 11.00,
                maxDistance: 20.00,
                spacing: 16.00
            });
        } catch (e) {
             console.error("Error initializing Vanta.NET:", e);
             // Fallback if Vanta fails to initialize
             if (vantaBackgroundElement) vantaBackgroundElement.style.backgroundColor = currentTheme === 'dark' ? '#121212' : '#001f3f';
        }
    };

    /**
     * Sets the initial theme of the website on page load.
     * It prioritizes a theme stored in localStorage. If no preference is found,
     * it defaults to the user's system preference (dark or light mode).
     */
    const initializeTheme = () => {
        let storedTheme = null;
        try {
            storedTheme = localStorage.getItem('theme');
        } catch (e) { /* LocalStorage might be disabled or unavailable, proceed with defaults */ }
        
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
        applyTheme(initialTheme); // This will also call initializeVantaBackground
    };

    // --- Initialization Sequence on DOMContentLoaded ---
    initializeTheme(); // Set theme and Vanta background first

    // Initialize Animate on Scroll (AOS) library for subtle reveal animations
    // (Supports Guide Section V.B - Meaningful Interactions)
    try {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 700,       // Animation duration
                once: true,          // Whether animation should happen only once - while scrolling down
                offset: 80,          // Offset (in px) from the original trigger point
                easing: 'ease-out-cubic', // Default easing for AOS animations
                disable: 'mobile'    // Disables AOS on mobile devices if desired (can be 'phone', 'tablet', 'mobile')
            });
        } else {
            console.warn('AOS library not found.');
        }
    } catch(e) { console.error("AOS Initialization failed:", e); }

    // Initialize Bootstrap Tooltips for all elements with data-bs-toggle="tooltip"
    try {
        if (typeof bootstrap !== 'undefined' && typeof bootstrap.Tooltip !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        } else {
            console.warn('Bootstrap Tooltip component not found.');
        }
    } catch(e) { console.error("Bootstrap Tooltip initialization failed:", e); }


    // --- Event Listeners Setup ---

    // Theme Toggle Button Click Handler
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Back to Top Button Scroll Handler: Shows/hides button based on scroll position
    if (backToTopButton) {
        const toggleBackToTopVisibility = () => {
            if (window.pageYOffset > SCROLL_THRESHOLD_BACK_TO_TOP) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        };
        window.addEventListener('scroll', toggleBackToTopVisibility);
        toggleBackToTopVisibility(); // Initial check on page load
    }

    // Skill Modal Population: Dynamically sets content when a skill modal is shown
    if (skillModalElement) {
        skillModalElement.addEventListener('show.bs.modal', (event) => {
            try {
                const button = event.relatedTarget; // The element that triggered the modal (the skill card)
                const skillName = button.getAttribute('data-skill-name') || 'Skill Details';
                const skillDetails = button.getAttribute('data-skill-details') || 'No details provided for this skill.';
                
                const modalTitle = skillModalElement.querySelector('#modal-skill-name'); // Span for the name
                const modalBody = skillModalElement.querySelector('#modal-skill-details'); // Paragraph for details
                
                if (modalTitle) modalTitle.textContent = skillName;
                if (modalBody) modalBody.textContent = skillDetails;
            } catch (e) { 
                console.error("Error populating skill modal:", e);
                const modalBody = skillModalElement.querySelector('#modal-skill-details');
                if (modalBody) modalBody.textContent = 'Could not load skill details.';
            }
        });
    }

    // Achievement Modal Population: Dynamically sets content for achievement modals
    if (achievementModalElement) {
        achievementModalElement.addEventListener('show.bs.modal', (event) => {
             try {
                const button = event.relatedTarget;
                const achievementName = button.getAttribute('data-achievement-name') || 'Achievement Details';
                const achievementDetails = button.getAttribute('data-achievement-details') || 'Details about this achievement are not available.';
                
                const modalTitle = achievementModalElement.querySelector('#modal-achievement-name');
                const modalBody = achievementModalElement.querySelector('#modal-achievement-details');

                if (modalTitle) modalTitle.textContent = achievementName;
                if (modalBody) modalBody.textContent = achievementDetails;
            } catch (e) { 
                console.error("Error populating achievement modal:", e);
                const modalBody = achievementModalElement.querySelector('#modal-achievement-details');
                if (modalBody) modalBody.textContent = 'Could not load achievement details.';
            }
        });
    }

    // Project Filtering Logic (Guide Section V.B - Interactive Elements)
    if (projectFilterContainer && projectItems.length > 0 && projectGallery) {
        projectFilterContainer.addEventListener('click', (e) => {
             if (e.target && e.target.classList.contains('filter-btn')) {
                 // Update active button state
                 const currentActive = projectFilterContainer.querySelector('.filter-btn.active');
                 if (currentActive) {
                     currentActive.classList.remove('active');
                     currentActive.setAttribute('aria-pressed', 'false');
                 }
                 e.target.classList.add('active');
                 e.target.setAttribute('aria-pressed', 'true');

                 const filterValue = e.target.getAttribute('data-filter');
                 projectGallery.classList.add('filtering'); // Add class for CSS transition

                 // Filter items
                 projectItems.forEach(item => {
                     const tags = item.getAttribute('data-tags')?.split(',') || [];
                     const shouldShow = filterValue === 'all' || tags.includes(filterValue);
                     
                     item.classList.toggle('hide', !shouldShow); // 'hide' class handles the visual hiding via CSS
                 });

                 // Refresh AOS after filtering and transition to ensure animations work on newly shown items
                 setTimeout(() => {
                     if (typeof AOS !== 'undefined') AOS.refresh();
                     projectGallery.classList.remove('filtering');
                 }, FILTER_TRANSITION_DELAY);
             }
        });
    }

    // Smooth Scrolling for Internal Page Links (Guide Section V.A - Intuitive Navigation)
    document.querySelectorAll('a.nav-link[href^="#"], a.footer-link[href^="#"], a.navbar-brand[href^="#"], a.back-to-top-btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) { 
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    // Calculate offset considering the fixed navbar height
                    const navbarActualHeight = navbar?.offsetHeight || parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').replace('px', '')) || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarActualHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // If on mobile and navbar is open, close it after clicking a nav link
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarToggler && !navbarToggler.classList.contains('collapsed') && navbarCollapse?.classList.contains('show')) {
                         // Use Bootstrap's Collapse instance to properly hide
                         const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, {toggle: false});
                         bsCollapse.hide();
                    }
                }
            }
        });
    });

    // Contact Form Submission Handler (Guide Section V.D - Contact Form)
    if (contactForm && formStatus && submitButton) {
        contactForm.addEventListener('submit', async (e) => {
             e.preventDefault(); // Prevent default form submission
             e.stopPropagation(); // Stop event bubbling

             // Perform Bootstrap client-side validation first
             if (!contactForm.checkValidity()) {
                 contactForm.classList.add('was-validated'); // Show Bootstrap validation styles
                 formStatus.className = 'alert alert-warning alert-dismissible fade show mt-3'; // Use Bootstrap alert classes
                 formStatus.innerHTML = 'Please fill out all required fields correctly. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                 formStatus.style.display = 'block'; // Ensure it's visible
                 return;
             }
             contactForm.classList.add('was-validated');

             const formData = new FormData(contactForm);
             const formAction = contactForm.getAttribute('action'); // Endpoint from HTML
             const submitButtonOriginalText = submitButton.innerHTML; // Save original button content
             const spinner = submitButton.querySelector('.spinner-border');

             // IMPORTANT: Ensure the formAction is correctly set in index.html for services like Formspree
             if (!formAction || formAction === "YOUR_FORM_ENDPOINT" || !formAction.includes("formspree.io")) { // Be more specific for Formspree
                 console.error("Contact form 'action' attribute is not configured for a service like Formspree.");
                 formStatus.className = 'alert alert-danger alert-dismissible fade show mt-3';
                 formStatus.innerHTML = 'Form submission is currently unavailable. Please contact me directly via email. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                 formStatus.style.display = 'block';
                 setTimeout(() => { if(formStatus.style.display !== 'none') bootstrap.Alert.getOrCreateInstance(formStatus)?.close(); }, FORM_STATUS_DISMISS_DELAY);
                 return;
             }

             // Update UI to indicate submission is in progress
             submitButton.disabled = true;
             if(spinner) spinner.classList.remove('d-none');
             // Preserve icon if present, only change text node
             const textNode = Array.from(submitButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
             if(textNode) textNode.textContent = ' Sending... ';
             
             formStatus.className = 'alert alert-info alert-dismissible fade show mt-3';
             formStatus.innerHTML = 'Sending your message... <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
             formStatus.style.display = 'block';

             try {
                 const response = await fetch(formAction, {
                     method: 'POST',
                     body: formData,
                     headers: { 'Accept': 'application/json' } // Required by Formspree
                 });

                 if (response.ok) {
                     formStatus.className = 'alert alert-success alert-dismissible fade show mt-3';
                     formStatus.innerHTML = 'Message sent successfully! Thank you for reaching out. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                     contactForm.reset(); // Clear the form
                     contactForm.classList.remove('was-validated'); // Reset validation state
                 } else {
                     // Try to get a more specific error message from Formspree
                     let errorMessage = 'An error occurred. Please try again.';
                     try {
                         const errorData = await response.json();
                         if (errorData && errorData.errors && errorData.errors.length > 0) {
                            errorMessage = errorData.errors.map(err => err.message).join(', ');
                         } else if (errorData && errorData.error) {
                            errorMessage = errorData.error;
                         } else {
                            errorMessage = `Server responded with status: ${response.status}`;
                         }
                     } catch (parseError) { /* Stick with generic server error if parsing fails */ }
                     throw new Error(errorMessage);
                 }

             } catch (error) {
                 console.error('Contact form submission error:', error);
                 formStatus.className = 'alert alert-danger alert-dismissible fade show mt-3';
                 formStatus.innerHTML = `Oops! ${error.message || 'A network error occurred.'} Please try again or contact me directly. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
             } finally {
                 submitButton.disabled = false;
                 submitButton.innerHTML = submitButtonOriginalText; // Restore original button content (including icon)
                 // Auto-dismiss the status message
                 setTimeout(() => {
                    if(formStatus.style.display !== 'none') {
                        const alertInstance = bootstrap.Alert.getOrCreateInstance(formStatus);
                        if (alertInstance) alertInstance.close();
                    }
                 }, FORM_STATUS_DISMISS_DELAY);
             }
        });
    }

    // Update current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded
