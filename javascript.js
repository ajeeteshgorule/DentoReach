// Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');

        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
            }
        });

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        // Observe all elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        // Counter animation for stats
        const animateCounters = () => {
            const counters = document.querySelectorAll('.stat-number');

            counters.forEach(counter => {
                const target = counter.textContent;
                const isPercentage = target.includes('%');
                const isMultiplier = target.includes('x');
                const numericValue = parseInt(target.replace(/[^\d]/g, ''));

                let current = 0;
                const increment = numericValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        current = numericValue;
                        clearInterval(timer);
                    }

                    if (isPercentage) {
                        counter.textContent = Math.floor(current) + '%';
                    } else if (isMultiplier) {
                        counter.textContent = Math.floor(current) + 'x';
                    } else {
                        counter.textContent = Math.floor(current) + '+';
                    }
                }, 50);
            });
        };

        // Trigger counter animation when stats section is visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        // document.addEventListener('DOMContentLoaded', function () {
        const consultationForm = document.getElementById('consultationForm');

        consultationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get the country code and phone number, and set fullPhone hidden input
            const countryCode = document.querySelector('select[name="countryCode"]').value;
            const phone = document.querySelector('input[name="phone"]').value;
            const fullPhone = countryCode + phone;

            document.getElementById('fullPhone').value = fullPhone;

            const formData = new FormData(consultationForm);

            // Show spinner before fetch
            const formContainer = document.querySelector('.form-container');
            formContainer.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <div class="loader" style="border: 8px solid #f3f3f3; border-top: 8px solid #764ba2; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin: auto;"></div>
      <p style="margin-top: 20px; font-size: 18px;">Recording your details, please wait...</p>
    </div>
  `;

            // Send data to Google Sheet
            fetch(consultationForm.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            // After 3 seconds, show thank you message
            setTimeout(() => {
                formContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem; color: #10b981;">✓</div>
        <h3 style="margin-bottom: 1rem;">Thank You!</h3>
        <p>We've received your request and will contact you within 24 hours to schedule your free consultation.</p>
        <button onclick="location.reload()" style="margin-top: 2rem; background: #10b981; color: white; border: none; padding: 1rem 2rem; border-radius: 10px; cursor: pointer;">Submit Another Request</button>
      </div>
    `;
            }, 3000);

            // Optional: reload page automatically after 8 seconds total
            setTimeout(() => {
                location.reload();
            }, 8000);
        });


        // Add floating animation to service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) rotateY(5deg)';
                card.style.boxShadow = '0 25px 80px rgba(0, 0, 0, 0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateY(0deg)';
                card.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
            });
        });

        // Add parallax effect to hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroMockup = document.querySelector('.hero-mockup');
            if (heroMockup && scrolled < window.innerHeight) {
                heroMockup.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });

        // Testimonial cards hover effect
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Loading animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            document.body.style.transition = 'opacity 0.5s ease';
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            // Add initial loading state
            document.body.style.opacity = '0';
        });


