/**
 * MeritLee Law - Website Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll behavior
    var nav = document.getElementById('nav');
    var navToggle = document.getElementById('nav-toggle');
    var navMenu = document.getElementById('nav-menu');

    // Scroll detection for navbar
    function handleScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link (but not dropdown trigger on mobile)
    navMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            // On mobile, don't close if it's the dropdown trigger
            if (window.innerWidth <= 768 && link.classList.contains('nav-dropdown-trigger')) {
                return;
            }
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                var headerOffset = 80;
                var elementPosition = target.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    var observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    var fadeElements = document.querySelectorAll('.section-header, .about-text, .about-sidebar, .about-stats, .service-card, .service-main, .contract-intro, .contract-services, .contract-arrangements, .why-card, .cta-card, .hero-card, .contact-info-section, .contact-form-wrapper');

    var fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    // Stagger animation for grid items
    var gridContainers = document.querySelectorAll('.services-grid, .why-grid, .contract-grid, .services-intro');

    gridContainers.forEach(function(container) {
        var items = container.children;
        Array.from(items).forEach(function(item, index) {
            item.style.transitionDelay = (index * 0.1) + 's';
        });
    });

    // Counter animation for stats
    var stats = document.querySelectorAll('.stat-number');

    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var stat = entry.target;
                var finalValue = stat.textContent;

                // Only animate if it's a number
                if (!isNaN(parseInt(finalValue))) {
                    var endValue = parseInt(finalValue);
                    var duration = 2000;
                    var startTime = performance.now();

                    function updateCounter(currentTime) {
                        var elapsed = currentTime - startTime;
                        var progress = Math.min(elapsed / duration, 1);

                        // Easing function
                        var easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        var currentValue = Math.floor(easeOutQuart * endValue);

                        stat.textContent = currentValue + (finalValue.includes('+') ? '+' : '');

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.textContent = finalValue;
                        }
                    }

                    stat.textContent = '0';
                    requestAnimationFrame(updateCounter);
                }

                counterObserver.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(function(stat) {
        counterObserver.observe(stat);
    });

    // Contact Form Submission
    var contactForm = document.getElementById('contact-form-el');
    var thankYou = document.getElementById('thank-you');
    var thankYouClose = document.getElementById('thank-you-close');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            var name = document.getElementById('form-name').value.trim();
            var email = document.getElementById('form-email').value.trim();
            var matter = document.getElementById('form-matter').value;

            if (!name || !email || !matter) {
                return;
            }

            // Submit to Formspree
            var formData = new FormData(contactForm);
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            fetch('https://formspree.io/f/mykndddq', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(function(response) {
                if (response.ok) {
                    thankYou.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    contactForm.reset();
                } else {
                    alert('Something went wrong. Please try again or email adichter@meritleelaw.com directly.');
                }
            }).catch(function() {
                alert('Something went wrong. Please try again or email adichter@meritleelaw.com directly.');
            }).finally(function() {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            });
        });
    }

    if (thankYouClose) {
        thankYouClose.addEventListener('click', function(e) {
            e.preventDefault();
            thankYou.classList.remove('active');
            document.body.style.overflow = '';
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
