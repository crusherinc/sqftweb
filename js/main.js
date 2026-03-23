/* ============================================
   SQFT Contracting — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Mobile Menu ── */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const backdrop = document.querySelector('.mobile-backdrop');

    function closeMenu() {
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
        backdrop?.classList.remove('active');
        document.body.style.overflow = '';
    }

    navToggle?.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        backdrop?.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    backdrop?.addEventListener('click', closeMenu);

    // Close menu when clicking a nav link
    navMenu?.querySelectorAll('a:not(.nav-dropdown > .nav-link)').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* ── Mobile Dropdown Toggle ── */
    document.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = link.parentElement;
                dropdown.classList.toggle('open');
            }
        });
    });

    /* ── Header Scroll ── */
    const header = document.querySelector('.header');
    function handleScroll() {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ── Smooth Scroll for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerH = header?.offsetHeight || 72;
                const top = target.getBoundingClientRect().top + window.scrollY - headerH;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ── Scroll Reveal (Intersection Observer) ── */
    const revealElements = document.querySelectorAll('.reveal, .reveal-group');
    if (revealElements.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ── Counter Animation ── */
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    /* ── Testimonials Slider ── */
    const slider = document.querySelector('.testimonials-slider');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    const sliderDotsContainer = document.querySelector('.slider-dots');

    if (slider && sliderPrev && sliderNext) {
        const cards = slider.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        let cardsPerView = getCardsPerView();

        function getCardsPerView() {
            return window.innerWidth <= 768 ? 1 : 2;
        }

        function getMaxIndex() {
            return Math.max(0, cards.length - cardsPerView);
        }

        function updateSlider() {
            const gap = 24;
            const card = cards[0];
            if (!card) return;
            const cardWidth = card.offsetWidth + gap;
            slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            updateDots();
        }

        function updateDots() {
            if (!sliderDotsContainer) return;
            sliderDotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function createDots() {
            if (!sliderDotsContainer) return;
            sliderDotsContainer.innerHTML = '';
            const count = getMaxIndex() + 1;
            for (let i = 0; i < count; i++) {
                const dot = document.createElement('button');
                dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                sliderDotsContainer.appendChild(dot);
            }
        }

        sliderPrev.addEventListener('click', () => {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
            updateSlider();
        });

        sliderNext.addEventListener('click', () => {
            currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
            updateSlider();
        });

        // Touch swipe
        let touchStartX = 0;
        let touchEndX = 0;
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    currentIndex = Math.min(currentIndex + 1, getMaxIndex());
                } else {
                    currentIndex = Math.max(currentIndex - 1, 0);
                }
                updateSlider();
            }
        }, { passive: true });

        createDots();
        updateSlider();

        window.addEventListener('resize', () => {
            cardsPerView = getCardsPerView();
            currentIndex = Math.min(currentIndex, getMaxIndex());
            createDots();
            updateSlider();
        });
    }

    /* ── FAQ Accordion ── */
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    /* ── Contact Form — Telegram ── */
    const TELEGRAM_BOT_TOKEN = '8751562131:AAFLI7-XXHoPVn9P34SLKbOOVWH8O2YDhzA';
    const TELEGRAM_CHAT_ID = '-5164693652';

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // File upload with accumulation (up to 10 photos)
        const fileInput = contactForm.querySelector('input[type="file"]');
        const fileUpload = contactForm.querySelector('.file-upload');
        const MAX_FILES = 10;
        let collectedFiles = [];

        function renderPreviews() {
            let container = contactForm.querySelector('.file-preview');
            if (!container) {
                container = document.createElement('div');
                container.className = 'file-preview';
                fileUpload.after(container);
            }
            container.innerHTML = '';
            if (collectedFiles.length === 0) return;

            // Counter
            const counter = document.createElement('div');
            counter.className = 'file-preview-counter';
            counter.textContent = collectedFiles.length + '/' + MAX_FILES + ' photos';
            container.appendChild(counter);

            if (collectedFiles.length >= MAX_FILES) {
                const warn = document.createElement('div');
                warn.className = 'file-preview-warning';
                warn.textContent = 'Maximum ' + MAX_FILES + ' photos reached';
                container.appendChild(warn);
            }

            collectedFiles.forEach((file, i) => {
                const item = document.createElement('div');
                item.className = 'file-preview-item';

                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.alt = file.name;
                item.appendChild(img);

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'file-preview-remove';
                removeBtn.innerHTML = '&times;';
                removeBtn.addEventListener('click', () => {
                    collectedFiles.splice(i, 1);
                    renderPreviews();
                });
                item.appendChild(removeBtn);
                container.appendChild(item);
            });
        }

        if (fileInput && fileUpload) {
            fileInput.addEventListener('change', () => {
                const newFiles = Array.from(fileInput.files).filter(f => f.type.startsWith('image/'));
                const remaining = MAX_FILES - collectedFiles.length;
                collectedFiles = collectedFiles.concat(newFiles.slice(0, remaining));
                renderPreviews();
                fileInput.value = '';
            });

            // Drag & drop
            fileUpload.addEventListener('dragover', (e) => { e.preventDefault(); fileUpload.classList.add('dragover'); });
            fileUpload.addEventListener('dragleave', () => { fileUpload.classList.remove('dragover'); });
            fileUpload.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUpload.classList.remove('dragover');
                const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                const remaining = MAX_FILES - collectedFiles.length;
                collectedFiles = collectedFiles.concat(newFiles.slice(0, remaining));
                renderPreviews();
            });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let valid = true;

            // Clear errors
            contactForm.querySelectorAll('.form-error').forEach(el => {
                el.classList.remove('form-error');
            });

            // Validate required
            contactForm.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('form-error');
                    valid = false;
                }
            });

            // Email
            const emailInput = contactForm.querySelector('[type="email"]');
            if (emailInput && emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                emailInput.classList.add('form-error');
                valid = false;
            }

            // Phone
            const phoneInput = contactForm.querySelector('[type="tel"]');
            if (phoneInput && phoneInput.value && !/^[\d\s\-\+\(\)]{10,}$/.test(phoneInput.value)) {
                phoneInput.classList.add('form-error');
                valid = false;
            }

            if (!valid) return;

            // Collect form data
            const name = contactForm.querySelector('#contact-name')?.value || '';
            const phone = contactForm.querySelector('#contact-phone')?.value || '';
            const email = contactForm.querySelector('#contact-email')?.value || '';
            const service = contactForm.querySelector('#contact-service')?.value || 'Not specified';
            const message = contactForm.querySelector('#contact-message')?.value || '';

            // Show loading state
            const submitBtn = contactForm.querySelector('[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';

            try {
                // 1. Send text message to Telegram
                const telegramText = [
                    '📩 New Inquiry from SQFT Website',
                    '',
                    '👤 Name: ' + name,
                    '📞 Phone: ' + phone,
                    '📧 Email: ' + email,
                    '🔧 Service: ' + service,
                    '',
                    '💬 Message:',
                    message || '(no message)',
                    '',
                    '📎 Files: ' + (collectedFiles.length || 'none'),
                    '⏰ ' + new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })
                ].join('\n');

                await fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: telegramText
                    })
                });

                // 2. Send photos to Telegram
                for (let i = 0; i < collectedFiles.length; i++) {
                    const file = collectedFiles[i];
                    const formData = new FormData();
                    formData.append('chat_id', TELEGRAM_CHAT_ID);
                    formData.append('photo', file);
                    if (i === 0) formData.append('caption', '📷 From ' + name + ' (' + collectedFiles.length + ' photos)');
                    await fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendPhoto', {
                        method: 'POST',
                        body: formData
                    });
                }

                // Show success
                contactForm.innerHTML = '<div class="form-success">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                    '<circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>' +
                    '<h3>Thank You, ' + name.split(' ')[0] + '!</h3>' +
                    '<p>We\'ve received your request and will get back to you within 24 hours.</p>' +
                    '</div>';

            } catch (err) {
                console.error('Form submission error:', err);
                contactForm.innerHTML = '<div class="form-success">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                    '<circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>' +
                    '<h3>Thank You!</h3>' +
                    '<p>We\'ve received your message and will get back to you within 24 hours.</p>' +
                    '</div>';
            }
        });
    }

    /* ── Active Nav Link ── */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const linkPath = href.split('/').pop();
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    /* ── Before/After Slider ── */
    document.querySelectorAll('.ba-slider').forEach(slider => {
        const afterImg = slider.querySelector('.ba-after');
        const handle = slider.querySelector('.ba-handle');
        let isDragging = false;

        function setPosition(x) {
            const rect = slider.getBoundingClientRect();
            let pos = (x - rect.left) / rect.width * 100;
            pos = Math.max(0, Math.min(100, pos));
            afterImg.style.clipPath = `inset(0 0 0 ${pos}%)`;
            handle.style.left = pos + '%';
        }

        slider.addEventListener('mousedown', e => { isDragging = true; setPosition(e.clientX); });
        slider.addEventListener('touchstart', e => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });

        window.addEventListener('mousemove', e => { if (isDragging) setPosition(e.clientX); });
        window.addEventListener('touchmove', e => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });

        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('touchend', () => { isDragging = false; });
    });

    /* ── Gallery Filter ── */
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

});
