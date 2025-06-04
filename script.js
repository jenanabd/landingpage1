// script.js - Handle navigation and UI behavior for landing page

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileMenu = document.getElementById('mobileMenu');
    const navbar = document.querySelector('.navbar');

    // Toggle mobile menu
    mobileMenuIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('open');
        mobileMenuIcon.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuIcon.contains(e.target)) {
            mobileMenu.classList.remove('open');
            mobileMenuIcon.setAttribute('aria-expanded', 'false');
        }
    });

    // Close mobile menu on window resize (if switching to desktop view)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
            mobileMenu.classList.remove('open');
            mobileMenuIcon.setAttribute('aria-expanded', 'false');
        }
    });

    // Language switcher functionality
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            // Store the selected language preference
            localStorage.setItem('preferredLanguage', selectedLanguage);
            // In a real implementation, this would change the page language
            console.log(`Language changed to: ${selectedLanguage}`);
            // You could reload the page with a language parameter or redirect to a localized version
            // window.location.href = `?lang=${selectedLanguage}`;
        });
        
        // Set initial value based on stored preference
        const storedLanguage = localStorage.getItem('preferredLanguage');
        if (storedLanguage) {
            languageSelect.value = storedLanguage;
        }
    }

    // Get references to navigation buttons
    const getStartedBtn = document.querySelector('.hero-buttons .btn-primary');
    const learnMoreBtn = document.querySelector('.hero-buttons .btn-secondary');
    const joinNowBtn = document.querySelector('.cta-button');
    const howItWorksSection = document.querySelector('.how-it-works');

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's a button that needs special handling
            if (this === getStartedBtn || this === joinNowBtn) {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Only scroll if the target exists
            if (targetId !== '#' && document.querySelector(targetId)) {
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }
            }
        });
    });
    
    // Handle "Learn More" button - scroll to How It Works section
    if (learnMoreBtn && howItWorksSection) {
        learnMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            howItWorksSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Function to handle authentication-dependent navigation
    function setupAuthButtons() {
        // Check if user is logged in using the global auth state variable
        const isLoggedIn = window.isUserLoggedIn === true;

        // Setup "Get Started" button
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (isLoggedIn) {
                    // If logged in, go to resources page
                    window.location.href = '/resources';
                } else {
                    // If not logged in, go to auth page
                    window.location.href = '/auth';
                }
            });
        }

        // Setup "Join Now" button (same behavior as Get Started)
        if (joinNowBtn) {
            joinNowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (isLoggedIn) {
                    window.location.href = '/resources';
                } else {
                    window.location.href = '/auth';
                }
            });
        }
    }

    // Listen for authentication state changes
    firebase.auth().onAuthStateChanged((user) => {
        setupAuthButtons();
    });

    // Initial setup
    setupAuthButtons();

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset previous error states
            contactForm.querySelectorAll('.error-message').forEach(error => error.remove());
            contactForm.querySelectorAll('input, textarea').forEach(input => {
                input.style.borderColor = '#ddd';
            });

            let isValid = true;
            
            // Validate required fields
            contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
                if (!input.value.trim()) {
                    showError(input, 'This field is required');
                    isValid = false;
                }
            });

            // Validate email
            const emailInput = contactForm.querySelector('input[type="email"]');
            if (emailInput && !isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            if (isValid) {
                // Here you would typically send the form data to your server
                const formData = {
                    name: contactForm.querySelector('#name').value,
                    email: contactForm.querySelector('#email').value,
                    subject: contactForm.querySelector('#subject').value,
                    message: contactForm.querySelector('#message').value
                };
                
                console.log('Contact form data:', formData);
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.style.color = '#83C5B3';
                successMessage.style.padding = '10px';
                successMessage.style.marginTop = '10px';
                successMessage.style.textAlign = 'center';
                successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                
                contactForm.appendChild(successMessage);
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }

    // Helper functions
    function showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ff4444';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        
        input.style.borderColor = '#ff4444';
        input.parentNode.appendChild(errorDiv);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});