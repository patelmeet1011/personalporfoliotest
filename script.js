/**
 * script.js
 *
 * Handles interactive elements for Meet Patel's portfolio:
 * - Loading Screen
 * - Basic Page Transitions (Fade In/Out)
 * - Theme Toggling (Light/Dark)
 * - Vanta.js Background Initialization & Theme Update
 * - Animate on Scroll (AOS) Initialization
 * - Smooth Scrolling & Active Nav Link Highlighting
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

    // New Elements for Loading Screen & Page Transitions
    const loadingScreen = document.getElementById('loading-screen');
    const pageWrapper = document.getElementById('page-wrapper');
    const transitionLinks = document.querySelectorAll('.transition-link');

    // --- State & Constants ---
    const SCROLL_THRESHOLD_BACK_TO_TOP = 300;
    const FORM_STATUS_DISMISS_DELAY = 7000;
    const FILTER_TRANSITION_DELAY = 300;
    const PAGE_TRANSITION_DELAY = 500; // Corresponds to CSS transition duration
    const DARK_ICON = '<i class="bi bi-moon-stars-fill"></i>';
    const LIGHT_ICON = '<i class="bi bi-sun-fill"></i>';
    let vantaEffect = null;

    // --- Loading Screen & Page Load Animation ---
    const handlePageLoadAnimations = () => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        if (pageWrapper) {
            // Delay slightly to ensure loading screen is gone and content is ready
            setTimeout(() => {
                pageWrapper.classList.add('fade-in');
            }, 100); // Short delay
        }
    };

    // Prefer window.onload for ensuring all assets (like Vanta) are ready
    window.addEventListener('load', handlePageLoadAnimations);
    // Fallback if onload is too slow or doesn't fire reliably for some reason
    // setTimeout(handlePageLoadAnimations, 2000); // Max wait time


    // --- Basic Page "Leaving" Animation ---
    if (transitionLinks.length > 0 && pageWrapper) {
        transitionLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                const href = this.href;
                const isExternal = this.hostname !== window.location.hostname || this.protocol !== window.location.protocol;
                const isAnchorLink = href.includes('#') && href.startsWith(window.location.origin + window.location.pathname);
                const isSamePageAnchor = href.startsWith(window.location.href.split('#')[0] + '#');


                // Only apply to actual page navigations, not same-page anchors handled by smooth scroll or external links
                if (href && !isExternal && !isSamePageAnchor) {
                    // If it's an internal link to a different page (not just a new hash on current page)
                    if (this.pathname !== window.location.pathname || (this.pathname === window.location.pathname && this.search !== window.location.search && !this.hash) ) {
                        event.preventDefault();
                        pageWrapper.classList.add('is-leaving');
                        pageWrapper.classList.remove('fade-in'); // Ensure it fades out

                        setTimeout(() => {
                            window.location.href = href;
                        }, PAGE_TRANSITION_DELAY);
                    }
                }
            });
        });
    }


    // --- Helper Functions (Theme, Vanta) ---
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
        initializeVantaBackground();
    };

    const initializeVantaBackground = () => {
        if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
            if (vantaBackgroundElement) vantaBackgroundElement.style.backgroundColor = 'var(--color-bg-dark)'; // Fallback
            return;
        }
        if (!vantaBackgroundElement) return;

        if (vantaEffect) {
            try { vantaEffect.destroy(); } catch (e) { console.error("Error destroying Vanta instance:", e); }
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
                color: currentTheme === 'dark' ? 0x50e3c2 : 0x4a90e2,
                backgroundColor: currentTheme === 'dark' ? 0x121212 : 0x001f3f, // Dark blue for light theme Vanta BG
                points: 11.00,
                maxDistance: 20.00,
                spacing: 16.00
            });
        } catch (e) {
             console.error("Error initializing Vanta.NET:", e);
             if (vantaBackgroundElement) vantaBackgroundElement.style.backgroundColor = currentTheme === 'dark' ? '#121212' : '#001f3f';
        }
    };

    const initializeTheme = () => {
        let storedTheme = null;
        try { storedTheme = localStorage.getItem('theme'); } catch (e) { /* Ignore */ }
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
        applyTheme(initialTheme);
    };

    // --- Initialization Sequence ---
    initializeTheme(); // Also calls Vanta init

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


    // --- Event Listeners (Existing) ---
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
                     if (shouldShow) { item.classList.remove('hide'); } else { item.classList.add('hide'); }
                 });
                 setTimeout(() => { AOS.refresh(); projectGallery.classList.remove('filtering'); }, FILTER_TRANSITION_DELAY);
             }
        });
    }

    // Smooth Scroll for Internal Links (modified to not interfere with page transitions for different pages)
    document.querySelectorAll('a.nav-link[href^="#"], a.footer-link[href^="#"], a.navbar-brand[href^="#"], a.back-to-top-btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Check if it's a same-page anchor link
            if (href && href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault(); // Prevent default for smooth scroll
                    const navbarHeight = navbar?.offsetHeight || parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 70;
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
                 console.error("Form submission endpoint not configured.");
                 formStatus.className = 'alert alert-danger alert-dismissible fade show';
                 formStatus.innerHTML = 'Form submission configuration error. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                 setTimeout(() => { const alertInstance = bootstrap.Alert.getOrCreateInstance(formStatus); if (alertInstance) alertInstance.close();}, FORM_STATUS_DISMISS_DELAY);
                 return;
             }
             submitButton.disabled = true;
             if(spinner) spinner.classList.remove('d-none');
             submitButton.childNodes[spinner ? 1 : 0].textContent = ' Sending... ';
             formStatus.className = 'alert alert-info alert-dismissible fade show';
             formStatus.innerHTML = 'Sending your message... <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
             try {
                 const response = await fetch(formAction, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' }});
                 if (response.ok) {
                     formStatus.className = 'alert alert-success alert-dismissible fade show';
                     formStatus.innerHTML = 'Message sent successfully! Thank you. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                     contactForm.reset();
                     contactForm.classList.remove('was-validated');
                 } else {
                     let errorMessage = 'An error occurred.';
                     try { const errorData = await response.json(); errorMessage = errorData.error || errorData.message || `Server Error: ${response.status} ${response.statusText}`; } catch (parseError) { errorMessage = `Server Error: ${response.status} ${response.statusText}`; }
                     throw new Error(errorMessage);
                 }
             } catch (error) {
                 console.error('Form submission error:', error);
                 formStatus.className = 'alert alert-danger alert-dismissible fade show';
                 formStatus.innerHTML = `Oops! ${error.message || 'A network error.'} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
             } finally {
                 submitButton.disabled = false;
                 submitButton.innerHTML = submitButtonOriginalText;
                 setTimeout(() => { const alertInstance = bootstrap.Alert.getOrCreateInstance(formStatus); if (alertInstance) alertInstance.close();}, FORM_STATUS_DISMISS_DELAY);
             }
        });
    }

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded
