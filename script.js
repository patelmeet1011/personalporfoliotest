/**
 * script.js
 *
 * Handles interactive elements for Meet Patel's portfolio:
 * - Loading Screen
 * - Page Transitions (Fade In/Out)
 * - Theme Toggling (Light/Dark)
 * - Vanta.js Background Initialization & Theme Update
 * - Animate on Scroll (AOS) Initialization
 * - Smooth Scrolling & Active Nav Link Highlighting (Basic - can be enhanced)
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

    const loadingScreen = document.getElementById('loading-screen');
    const pageWrapper = document.getElementById('page-wrapper');
    const transitionLinks = document.querySelectorAll('.transition-link'); // Links that trigger page transitions

    // --- State & Constants ---
    const SCROLL_THRESHOLD_BACK_TO_TOP = 300;
    const FORM_STATUS_DISMISS_DELAY = 7000;
    const FILTER_TRANSITION_DELAY = 350; // Adjusted to feel right with CSS
    const PAGE_TRANSITION_DELAY = 500; // Corresponds to CSS transition duration
    const DARK_ICON_CLASS = 'bi-moon-stars-fill';
    const LIGHT_ICON_CLASS = 'bi-sun-fill';
    let vantaEffect = null;
    let loadFallbackTimeout = null;

    // --- Helper: Get computed style for Vanta fallback
    const getCssVariable = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

    // --- Loading Screen & Page Load Animation ---
    const hideLoadingScreen = () => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    };

    const showPageContent = () => {
        if (pageWrapper) {
            pageWrapper.classList.add('fade-in');
        }
    };

    const handlePageLoadAnimations = () => {
        if (loadFallbackTimeout) {
            clearTimeout(loadFallbackTimeout);
        }
        hideLoadingScreen();
        // Delay slightly to ensure loading screen is gone and content is ready
        setTimeout(showPageContent, 50); // Short delay
    };

    // Prefer window.onload for ensuring all assets are ready
    window.addEventListener('load', handlePageLoadAnimations);
    // Fallback if onload is too slow or doesn't fire reliably
    loadFallbackTimeout = setTimeout(handlePageLoadAnimations, 2500); // Max wait time

    // --- Basic Page "Leaving" Animation ---
    if (transitionLinks.length > 0 && pageWrapper) {
        transitionLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                const href = this.href;
                const isExternal = this.hostname !== window.location.hostname || this.protocol !== window.location.protocol;
                const isMailto = this.protocol === 'mailto:';
                const isDownload = this.hasAttribute('download');
                // Check if it's a same-page anchor link (e.g. href="#about" or href="index.html#about" on index.html)
                const isSamePageAnchor = href.startsWith(window.location.origin + window.location.pathname + '#') || href.startsWith('#');

                // Only apply to actual page navigations, not same-page anchors, external, mailto, or download links
                if (href && !isExternal && !isMailto && !isDownload && !isSamePageAnchor) {
                    // If it's an internal link to a different page
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


    // --- Theme Management ---
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-bs-theme', theme);
        if (themeToggleButton) {
            const iconElement = themeToggleButton.querySelector('i');
            if (iconElement) {
                iconElement.classList.remove(theme === 'dark' ? LIGHT_ICON_CLASS : DARK_ICON_CLASS);
                iconElement.classList.add(theme === 'dark' ? LIGHT_ICON_CLASS : DARK_ICON_CLASS);
            }
            themeToggleButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('LocalStorage is not available. Theme preference will not be saved.');
        }
        initializeVantaBackground(); // Re-initialize Vanta with new theme colors
    };

    const initializeVantaBackground = () => {
        if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
            if (vantaBackgroundElement) {
                const currentTheme = htmlElement.getAttribute('data-bs-theme') || 'light';
                vantaBackgroundElement.style.backgroundColor = currentTheme === 'dark' ? getCssVariable('--color-bg-dark') : '#001f3f'; // Dark blue for light theme Vanta BG
            }
            console.warn("Vanta.js or Three.js not loaded. Vanta background disabled.");
            return;
        }
        if (!vantaBackgroundElement) return;

        if (vantaEffect) {
            try { vantaEffect.destroy(); } catch (e) { console.error("Error destroying Vanta instance:", e); }
            vantaEffect = null;
        }

        const currentTheme = htmlElement.getAttribute('data-bs-theme') || 'light';
        let vantaColor, vantaBgColor;

        if (currentTheme === 'dark') {
            vantaColor = parseInt(getCssVariable('--color-secondary').replace('#', '0x'), 16); // Teal for dark
            vantaBgColor = parseInt(getCssVariable('--color-bg-dark').replace('#', '0x'), 16); // Vanta BG matches page BG
        } else {
            vantaColor = parseInt(getCssVariable('--color-primary').replace('#', '0x'), 16); // Blue for light
            vantaBgColor = 0x001f3f; // Dark blue for light theme Vanta BG for contrast
        }

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
                color: vantaColor,
                backgroundColor: vantaBgColor,
                points: 11.00,
                maxDistance: 20.00,
                spacing: 16.00,
                showDots: true // Or false, depending on preference
            });
        } catch (e) {
             console.error("Error initializing Vanta.NET:", e);
             if (vantaBackgroundElement) {
                vantaBackgroundElement.style.backgroundColor = currentTheme === 'dark' ? getCssVariable('--color-bg-dark') : '#001f3f';
             }
        }
    };

    const initializeTheme = () => {
        let storedTheme = null;
        try { storedTheme = localStorage.getItem('theme'); } catch (e) { /* Ignore */ }
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
        applyTheme(initialTheme); // This will also call Vanta init
    };

    // --- Initializations ---
    initializeTheme(); // Sets theme and calls Vanta

    try {
        AOS.init({
            duration: 700,
            once: true,
            offset: 80, // Adjusted for better trigger timing
            easing: 'ease-out-cubic',
            disable: 'mobile' // Or specific conditions like window.innerWidth < 768
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
            if (window.scrollY > SCROLL_THRESHOLD_BACK_TO_TOP) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        };
        window.addEventListener('scroll', toggleBackToTopVisibility);
        toggleBackToTopVisibility(); // Initial check
        backToTopButton.addEventListener('click', (e) => { // Smooth scroll for back to top
            e.preventDefault();
            const targetId = backToTopButton.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const setupModal = (modalElement, nameAttr, detailsAttr, nameId, detailsId) => {
        if (modalElement) {
            modalElement.addEventListener('show.bs.modal', (event) => {
                try {
                    const button = event.relatedTarget;
                    const itemName = button.getAttribute(nameAttr) || 'Details';
                    const itemDetails = button.getAttribute(detailsAttr) || 'No details provided.';
                    const modalTitle = modalElement.querySelector(nameId);
                    const modalBody = modalElement.querySelector(detailsId);
                    if (modalTitle) modalTitle.textContent = itemName;
                    if (modalBody) modalBody.innerHTML = itemDetails; // Use innerHTML if details can contain HTML
                } catch (e) { console.error(`Error populating modal (${nameId}):`, e); }
            });
        }
    };

    setupModal(skillModalElement, 'data-skill-name', 'data-skill-details', '#modal-skill-name', '#modal-skill-details');
    setupModal(achievementModalElement, 'data-achievement-name', 'data-achievement-details', '#modal-achievement-name', '#modal-achievement-details');


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
                 projectGallery.classList.add('filtering'); // For potential global styling during filter

                 projectItems.forEach(item => {
                     const tags = item.getAttribute('data-tags')?.split(',') || [];
                     const shouldShow = filterValue === 'all' || tags.includes(filterValue);
                     if (shouldShow) {
                         item.classList.remove('hide');
                     } else {
                         item.classList.add('hide');
                     }
                 });
                 // Refresh AOS after filtering animations complete
                 setTimeout(() => {
                    AOS.refresh();
                    projectGallery.classList.remove('filtering');
                 }, FILTER_TRANSITION_DELAY);
             }
        });
    }

    // Smooth Scroll for Internal Links & Active Nav Link Highlighting
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    const changeNavActiveState = (targetId) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            }
        });
    };

    // Intersection Observer for active section highlighting
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: `-${(navbar?.offsetHeight || 70) + 20}px 0px 0px 0px`, // Adjust top margin for navbar height
        threshold: 0.4 // 40% of section visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                changeNavActiveState(entry.target.id);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    document.querySelectorAll('a.nav-link[href^="#"], a.footer-link[href^="#"], a.navbar-brand[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Check if it's a same-page anchor link
            if (href && href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = navbar?.offsetHeight || parseInt(getCssVariable('--navbar-height')) || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - navbarHeight;

                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });

                    // Close mobile navbar if open
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarToggler && !navbarToggler.classList.contains('collapsed') && navbarCollapse?.classList.contains('show')) {
                         const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, {toggle: false});
                         if (bsCollapse) bsCollapse.hide();
                    }
                    // Manually set active state on click for immediate feedback
                    changeNavActiveState(targetElement.id);
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
                 // Ensure alert can be dismissed
                 bootstrap.Alert.getOrCreateInstance(formStatus);
                 return;
             }
             contactForm.classList.add('was-validated');

             const formData = new FormData(contactForm);
             const formAction = contactForm.getAttribute('action');
             const submitButtonOriginalText = submitButton.innerHTML;
             const spinner = submitButton.querySelector('.spinner-border');

             if (!formAction || formAction.trim() === "YOUR_FORM_ENDPOINT" || (formAction && !formAction.includes("formspree.io/f/"))) {
                 console.error("Form submission endpoint not configured or invalid.");
                 formStatus.className = 'alert alert-danger alert-dismissible fade show';
                 formStatus.innerHTML = 'Form submission is currently unavailable. Please try again later or contact me directly. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                 bootstrap.Alert.getOrCreateInstance(formStatus);
                 setTimeout(() => { bootstrap.Alert.getOrCreateInstance(formStatus)?.close(); }, FORM_STATUS_DISMISS_DELAY);
                 return;
             }

             submitButton.disabled = true;
             if(spinner) spinner.classList.remove('d-none');
             // Keep icon if present, just change text part
             const textNode = Array.from(submitButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '');
             if(textNode) textNode.textContent = ' Sending... ';


             formStatus.className = 'alert alert-info alert-dismissible fade show';
             formStatus.innerHTML = 'Sending your message... <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
             bootstrap.Alert.getOrCreateInstance(formStatus);

             try {
                 const response = await fetch(formAction, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' }});
                 if (response.ok) {
                     formStatus.className = 'alert alert-success alert-dismissible fade show';
                     formStatus.innerHTML = 'Message sent successfully! Thank you. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                     contactForm.reset();
                     contactForm.classList.remove('was-validated');
                 } else {
                     let errorMessage = 'An error occurred while sending the message.';
                     try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorData.errors?.map(err => err.message).join(', ') || `Server Error: ${response.status} ${response.statusText}`;
                    } catch (parseError) {
                        errorMessage = `Server Error: ${response.status} ${response.statusText}. Please try again.`;
                    }
                     throw new Error(errorMessage);
                 }
             } catch (error) {
                 console.error('Form submission error:', error);
                 formStatus.className = 'alert alert-danger alert-dismissible fade show';
                 formStatus.innerHTML = `Oops! ${error.message || 'A network error occurred.'} Please try again. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
             } finally {
                 submitButton.disabled = false;
                 submitButton.innerHTML = submitButtonOriginalText; // Restore original button text and icon
                 bootstrap.Alert.getOrCreateInstance(formStatus); // Ensure it's re-initialized for auto-dismiss
                 setTimeout(() => { bootstrap.Alert.getOrCreateInstance(formStatus)?.close(); }, FORM_STATUS_DISMISS_DELAY);
             }
        });
    }

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Re-initialize AOS on window resize (debounced for performance)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            AOS.refresh();
        }, 250);
    });

}); // End DOMContentLoaded
