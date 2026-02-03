// SQFT Contracting - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // Header Scroll Effect (Transparent to Solid)
    // ============================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    // Run on load in case page is already scrolled
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll);

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.service-showcase-card, .why-feature, .process-card, .project-item, .testimonial-card, .trust-badge, .hero-tab'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // Form Validation
    // ============================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            let isValid = true;
            let errorMessages = [];

            // Validate required fields
            const requiredFields = contactForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    errorMessages.push(`${field.name || 'Field'} is required`);
                } else {
                    field.classList.remove('error');
                }
            });

            // Email validation
            const emailField = contactForm.querySelector('[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                    errorMessages.push('Please enter a valid email address');
                }
            }

            // Phone validation
            const phoneField = contactForm.querySelector('[type="tel"]');
            if (phoneField && phoneField.value) {
                const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
                if (!phoneRegex.test(phoneField.value)) {
                    isValid = false;
                    phoneField.classList.add('error');
                    errorMessages.push('Please enter a valid phone number');
                }
            }

            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <h3>Thank You!</h3>
                    <p>We've received your message and will get back to you within 24 hours.</p>
                `;
                contactForm.innerHTML = '';
                contactForm.appendChild(successMessage);
            } else {
                alert(errorMessages.join('\n'));
            }
        });
    }

    // ============================================
    // Counter Animation
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }

        updateCounter();
    }

    // Observe stat numbers for animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                if (!isNaN(number) && number > 0) {
                    entry.target.textContent = '0+';
                    animateCounter(entry.target, number);
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));

    // ============================================
    // Mobile Dropdown Toggle
    // ============================================
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');

        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('open');
            }
        });
    });

    // ============================================
    // Lazy Loading Images
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Active Navigation Link
    // ============================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ============================================
    // Testimonials Slider
    // ============================================
    const slider = document.getElementById('testimonials-slider');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');

    if (slider && prevBtn && nextBtn && dotsContainer) {
        const cards = slider.querySelectorAll('.testimonial-card');
        const dots = dotsContainer.querySelectorAll('.dot');
        let currentIndex = 0;

        function getCardWidth() {
            const card = cards[0];
            const style = window.getComputedStyle(card);
            const width = card.offsetWidth;
            const gap = parseInt(window.getComputedStyle(slider).gap) || 20;
            return width + gap;
        }

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function scrollToIndex(index) {
            const cardWidth = getCardWidth();
            slider.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
            currentIndex = index;
            updateDots();
        }

        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                scrollToIndex(currentIndex - 1);
            } else {
                scrollToIndex(cards.length - 1);
            }
        });

        nextBtn.addEventListener('click', function() {
            if (currentIndex < cards.length - 1) {
                scrollToIndex(currentIndex + 1);
            } else {
                scrollToIndex(0);
            }
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                scrollToIndex(index);
            });
        });

        // Update current index on manual scroll
        slider.addEventListener('scroll', function() {
            const cardWidth = getCardWidth();
            const newIndex = Math.round(slider.scrollLeft / cardWidth);
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
                currentIndex = newIndex;
                updateDots();
            }
        });
    }

});

// ============================================
// Preloader (optional)
// ============================================
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});
