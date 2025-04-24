/**
 * script.js
 *
 * Handles interactive elements for Meet Patel's portfolio:
 * - Theme Toggling (Light/Dark)
 * - Animate on Scroll (AOS) Initialization
 * - Smooth Scrolling & Active Nav Link Highlighting (via Bootstrap Scrollspy)
 * - Project Filtering
 * - Skill Modal Interaction
 * - Contact Form Submission Handling
 * - Back to Top Button
 * - Bootstrap Component Initialization (Tooltips, Modals, etc.)
 */

document.addEventListener('DOMContentLoaded', () => {

    const htmlElement = document.documentElement;
    const themeToggleButton = document.getElementById('theme-toggle');
    const backToTopButton = document.getElementById('back-to-top');
    const skillModalElement = document.getElementById('skillModal');
    const projectFilterContainer = document.getElementById('project-filters');
    const projectItems = document.querySelectorAll('.project-gallery .project-item');
    const projectGallery = document.querySelector('.project-gallery');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');
    const currentYearSpan = document.getElementById('current-year');
    const navbar = document.getElementById('navbar-main');

    // --- Constants ---
    const SCROLL_THRESHOLD_BACK_TO_TOP = 300; // Pixels to show back-to-top
    const FORM_STATUS_DISMISS_DELAY = 7000; // Milliseconds (7 seconds)
    const FILTER_TRANSITION_DELAY = 300; // Milliseconds (match CSS transition if possible)
    const DARK_ICON = '<i class="bi bi-moon-stars-fill"></i>';
    const LIGHT_ICON = '<i class="bi bi-sun-fill"></i>';

    // --- Helper Functions ---
    /**
     * Sets the theme on the HTML element, updates the toggle button, and stores the theme.
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
    };

    /**
     * Initializes the theme based on stored preference or system preference.
     */
    const initializeTheme = () => {
        let storedTheme = null;
        try {
            storedTheme = localStorage.getItem('theme');
        } catch (e) {
            // LocalStorage might be disabled or unavailable
        }
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
        applyTheme(initialTheme);
    };

    // --- Initialization ---

    // 1. Initialize Theme
    initializeTheme();

    // 2. Initialize AOS
    AOS.init({
        duration: 700,      // Animation duration
        once: true,         // Animate only once per element
        offset: 80,         // Trigger offset (px)
        easing: 'ease-out-cubic', // Smooth easing
        disable: 'mobile' // Optional: disable animations on mobile for performance
    });

    // 3. Initialize Bootstrap Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // --- Event Listeners ---

    // Theme Toggle Button
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
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

        // Smooth scroll to top handled by HTML anchor href="#hero" and CSS scroll-behavior
        // Optional: Add JS smooth scroll if CSS method isn't sufficient or for more control
        /*
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        */
    }

    // Skill Modal Population
    if (skillModalElement) {
        skillModalElement.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget; // Button that triggered the modal
            const skillName = button.getAttribute('data-skill-name') || 'Skill Details';
            const skillDetails = button.getAttribute('data-skill-details') || 'No details provided.';

            const modalTitle = skillModalElement.querySelector('#modal-skill-name');
            const modalBody = skillModalElement.querySelector('#modal-skill-details');

            if (modalTitle) modalTitle.textContent = skillName;
            if (modalBody) modalBody.textContent = skillDetails;
        });
    }

    // Project Filtering
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

                projectGallery.classList.add('filtering'); // Optional: For CSS transition coordination

                // Filter logic
                projectItems.forEach(item => {
                    const tags = item.getAttribute('data-tags')?.split(',') || [];
                    const shouldShow = filterValue === 'all' || tags.includes(filterValue);

                    // Use classes for hide/show to leverage CSS transitions
                    if (shouldShow) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                    // Reset AOS state for potential re-animation if needed (use with caution)
                    // item.classList.remove('aos-animate');
                });

                // Refresh AOS after filter and potential layout shifts
                setTimeout(() => {
                    AOS.refresh();
                    projectGallery.classList.remove('filtering'); // Remove transition class
                    // Optional: Re-trigger AOS for newly visible items
                    // projectItems.forEach(item => {
                    //     if (!item.classList.contains('hide') && !item.classList.contains('aos-animate')) {
                    //         item.classList.add('aos-init', 'aos-animate');
                    //     }
                    // });
                }, FILTER_TRANSITION_DELAY);
            }
        });
    }

    // Smooth Scroll for Internal Links (Enhancing Bootstrap Scrollspy)
    document.querySelectorAll('a.nav-link[href^="#"], a.footer-link[href^="#"], a.navbar-brand[href^="#"], a.back-to-top-btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault(); // Prevent default only if target exists

                    const navbarHeight = navbar?.offsetHeight || 70; // Get dynamic navbar height or fallback
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // Optionally close mobile navbar if open
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarToggler && !navbarToggler.classList.contains('collapsed') && navbarCollapse?.classList.contains('show')) {
                         const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, {toggle: false});
                         bsCollapse.hide();
                    }

                    // Update focus for accessibility after scroll (optional but good)
                    // setTimeout(() => targetElement.focus(), 1000); // Delay may need adjustment
                }
            }
        });
    });


    // Enhanced Contact Form Submission
    if (contactForm && formStatus && submitButton) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Use Bootstrap's validation styles
            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                formStatus.className = 'alert alert-warning alert-dismissible fade show';
                formStatus.innerHTML = 'Please check the highlighted fields. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                return;
            }
            contactForm.classList.add('was-validated'); // Show validation styles even if technically valid on submit click

            const formData = new FormData(contactForm);
            const formAction = contactForm.getAttribute('action');
            const submitButtonOriginalText = submitButton.innerHTML;
            const spinner = submitButton.querySelector('.spinner-border');

             // --- IMPORTANT ---
             // Remind user to set their endpoint
             if (!formAction || formAction === "YOUR_FORM_ENDPOINT") {
                 console.error("Form submission endpoint is not configured. Please set the 'action' attribute on the form.");
                 formStatus.className = 'alert alert-danger show';
                 formStatus.textContent = 'Form submission is not configured.';
                 // Auto-dismiss this specific warning
                 setTimeout(() => bootstrap.Alert.getOrCreateInstance(formStatus)?.close(), FORM_STATUS_DISMISS_DELAY);
                 return;
             }

            // Disable button and show loading state
            submitButton.disabled = true;
            if(spinner) spinner.classList.remove('d-none');
            submitButton.childNodes[spinner ? 1 : 0].textContent = ' Sending... '; // Update text node
            formStatus.className = 'alert alert-info show';
            formStatus.textContent = 'Sending your message... Please wait.';

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' } // Common requirement for form services
                });

                if (response.ok) {
                    formStatus.className = 'alert alert-success show';
                    formStatus.textContent = 'Message sent successfully! Thank you for reaching out.';
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                } else {
                    // Attempt to get error message from service response
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
                formStatus.textContent = `Oops! ${error.message || 'A network error occurred. Please try again.'}`;
            } finally {
                // Restore button state
                submitButton.disabled = false;
                submitButton.innerHTML = submitButtonOriginalText; // Restore original content (including icon)

                // Auto-dismiss status message after a delay
                setTimeout(() => {
                   const currentAlertInstance = bootstrap.Alert.getOrCreateInstance(formStatus);
                   currentAlertInstance?.close(); // Gracefully close using Bootstrap's method
                }, FORM_STATUS_DISMISS_DELAY);
            }
        });
    }

    // --- Miscellaneous ---

    // Update Footer Year
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded