// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
        }
    });
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

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

// ========== NEW OTP FORM FUNCTIONALITY ==========
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbweKssV4e8Al6y1aPTt2BuX10KbOZouE4jXCHLywo-KAb_dSDK6bVDyMZUtII0IaoLR/exec";
let countdown;

// Email validation for specific domains
function validateEmail(email) {
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return { valid: false, message: "Please enter a valid email address" };
    }
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!allowedDomains.includes(domain)) {
        return { valid: false, message: "Please use Gmail, Yahoo, Outlook, or Hotmail email only" };
    }
    
    return { valid: true };
}

// Phone validation for 10 digits
function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return { valid: false, message: "Please enter exactly 10 digits" };
    }
    return { valid: true };
}

// Function to check if all required fields are filled for step 3
function checkFormCompletion() {
    const fullName = document.getElementById("fullName")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const practiceName = document.getElementById("practiceName")?.value.trim() || "";
    const submitBtn = document.getElementById("submitConsultationBtn");
    
    if (!submitBtn) return; // Button doesn't exist yet
    
    // Check if all required fields are filled and phone is valid
    const isNameFilled = fullName.length > 0;
    const isPhoneValid = phone.length === 10 && /^\d{10}$/.test(phone);
    const isPracticeNameFilled = practiceName.length > 0;
    
    const allFieldsValid = isNameFilled && isPhoneValid && isPracticeNameFilled;
    
    // Enable/disable button based on validation
    if (allFieldsValid) {
        submitBtn.disabled = false;
        submitBtn.style.background = "";
        submitBtn.style.opacity = "";
    } else {
        submitBtn.disabled = true;
        submitBtn.style.background = "#9ca3af";
        submitBtn.style.opacity = "0.6";
    }
}

async function sendOTP() {
    const email = document.getElementById("email")?.value.trim();
    const msg1 = document.getElementById("msg1");
    const btn = document.getElementById("sendOtpBtn");
    const timerEl = document.getElementById("timer");
    const emailError = document.getElementById("emailError");
    
    if (!email || !msg1 || !btn || !timerEl || !emailError) return;
    
    // Clear previous messages
    msg1.className = "message hidden";
    emailError.style.display = "none";

    if (!email) {
        emailError.textContent = "Please enter your email address";
        emailError.style.display = "block";
        return;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        emailError.textContent = emailValidation.message;
        emailError.style.display = "block";
        return;
    }

    // Show spinner
    btn.classList.add("loading");
    btn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("action", "send_otp");
        formData.append("email", email);

        const res = await fetch(SCRIPT_URL, { method: "POST", body: formData });
        const data = await res.json();

        // Hide spinner
        btn.classList.remove("loading");

        msg1.textContent = data.message;
        if (data.success) {
            msg1.classList.add("success");
            document.getElementById("step1")?.classList.add("hidden");
            document.getElementById("step2")?.classList.remove("hidden");
            startTimer(btn, timerEl);
        } else {
            msg1.classList.add("error");
            btn.disabled = false;
        }
        msg1.classList.remove("hidden");
    } catch (error) {
        btn.classList.remove("loading");
        btn.disabled = false;
        msg1.textContent = "Network error. Please try again.";
        msg1.classList.add("error");
        msg1.classList.remove("hidden");
    }
}

function startTimer(btn, timerEl) {
    let timeLeft = 60;
    timerEl.classList.remove("hidden");
    timerEl.textContent = `You can resend OTP in ${timeLeft}s`;

    countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerEl.textContent = "You can resend OTP now";
            btn.disabled = false;
        } else {
            timerEl.textContent = `You can resend OTP in ${timeLeft}s`;
        }
    }, 1000);
}

async function verifyOTP() {
    const email = document.getElementById("email")?.value.trim();
    const otp = document.getElementById("otp")?.value.trim();
    const msg2 = document.getElementById("msg2");
    
    if (!email || !otp || !msg2) return;
    
    msg2.className = "message hidden";

    if (!otp) {
        msg2.textContent = "Please enter the OTP";
        msg2.classList.add("error");
        msg2.classList.remove("hidden");
        return;
    }

    if (otp.length !== 6) {
        msg2.textContent = "OTP must be 6 digits";
        msg2.classList.add("error");
        msg2.classList.remove("hidden");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("action", "verify_otp");
        formData.append("email", email);
        formData.append("otp", otp);

        const res = await fetch(SCRIPT_URL, { method: "POST", body: formData });
        const data = await res.json();

        msg2.textContent = data.message;
        if (data.success) {
            msg2.classList.add("success");
            setTimeout(() => {
                document.getElementById("step2")?.classList.add("hidden");
                document.getElementById("step3")?.classList.remove("hidden");
                // Attach event listeners after step3 is shown
                attachEventListeners();
            }, 1000);
        } else {
            msg2.classList.add("error");
        }
        msg2.classList.remove("hidden");
    } catch (error) {
        msg2.textContent = "Network error. Please try again.";
        msg2.classList.add("error");
        msg2.classList.remove("hidden");
    }
}

async function saveContact() {
    const fullName = document.getElementById("fullName")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const countryCode = document.getElementById("countryCode")?.value;
    const phone = document.getElementById("phone")?.value.trim();
    const practiceName = document.getElementById("practiceName")?.value.trim();
    const message = document.getElementById("message")?.value.trim();
    const msg3 = document.getElementById("msg3");
    const phoneError = document.getElementById("phoneError");
    const btn = document.getElementById("submitConsultationBtn");
    
    if (!fullName || !email || !countryCode || !phone || !practiceName || !msg3 || !phoneError || !btn) return;
    
    // Clear previous messages
    msg3.className = "message hidden";
    phoneError.style.display = "none";

    if (!fullName || !phone || !practiceName) {
        msg3.textContent = "Please fill in all required fields (Name, Phone, Practice Name)";
        msg3.classList.add("error");
        msg3.classList.remove("hidden");
        return;
    }

    // Validate phone
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
        phoneError.textContent = phoneValidation.message;
        phoneError.style.display = "block";
        return;
    }

    // Show spinner and disable button to prevent multiple clicks
    btn.classList.add("loading");
    btn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("action", "save_contact");
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("phone", countryCode + phone);
        formData.append("practiceName", practiceName);
        formData.append("message", message || "");

        const res = await fetch(SCRIPT_URL, { method: "POST", body: formData });
        const data = await res.json();

        msg3.textContent = data.message;
        if (data.success) {
            msg3.classList.add("success");
            setTimeout(() => {
                const step3 = document.getElementById("step3");
                if (step3) {
                    step3.innerHTML = `
                        <div style="text-align: center; padding: 40px 20px;">
                            <h3 style="color: #f6f6f6ff; margin-bottom: 15px;">🎉 Thank You!</h3>
                            <p style="color: #ffffffff; margin-bottom: 20px;">We've received your consultation request and will contact you within 24 hours.</p>
                            <button type="button" class="form-submit" onclick="resetForm()" style="max-width: 200px;">Submit Another Request</button>
                        </div>
                    `;
                }
            }, 2000);
        } else {
            msg3.classList.add("error");
            btn.classList.remove("loading");
            btn.disabled = true; // Keep disabled until fields are valid again
        }
        msg3.classList.remove("hidden");
    } catch (error) {
        btn.classList.remove("loading");
        btn.disabled = true; // Keep disabled until fields are valid again
        msg3.textContent = "Network error. Please try again.";
        msg3.classList.add("error");
        msg3.classList.remove("hidden");
    }
}

function goBackToStep1() {
    document.getElementById("step2")?.classList.add("hidden");
    document.getElementById("step1")?.classList.remove("hidden");
    const otpInput = document.getElementById("otp");
    const msg2 = document.getElementById("msg2");
    if (otpInput) otpInput.value = "";
    if (msg2) msg2.classList.add("hidden");
}

function resetForm() {
    // Clear all form fields
    const fields = ["email", "otp", "fullName", "phone", "practiceName", "message"];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = "";
    });
    
    // Reset to step 1
    document.getElementById("step3")?.classList.add("hidden");
    document.getElementById("step2")?.classList.add("hidden");
    document.getElementById("step1")?.classList.remove("hidden");
    
    // Clear all messages
    document.querySelectorAll(".message").forEach(msg => msg.classList.add("hidden"));
    document.querySelectorAll(".email-error, .phone-error").forEach(error => error.style.display = "none");
    
    // Reset button states
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    if (sendOtpBtn) {
        sendOtpBtn.disabled = false;
        sendOtpBtn.classList.remove("loading");
    }
    
    // Clear timer
    if (countdown) {
        clearInterval(countdown);
        document.getElementById("timer")?.classList.add("hidden");
    }
    
    // Restore original step 3 content
    const step3 = document.getElementById("step3");
    if (step3) {
        step3.innerHTML = `
            <form id="consultationForm">
                <div class="form-group">
                    <input type="text" id="fullName" placeholder="Full Name" required />
                </div>
                <div class="form-group phone-row">
                    <select id="countryCode" required>
                        <option value="+91">India (+91)</option>
                        <option value="+1">USA (+1)</option>
                        <option value="+44">UK (+44)</option>
                        <option value="+61">Australia (+61)</option>
                        <option value="+971">UAE (+971)</option>
                        <option value="+49">Germany (+49)</option>
                        <option value="+81">Japan (+81)</option>
                        <option value="+33">France (+33)</option>
                        <option value="+39">Italy (+39)</option>
                        <option value="+86">China (+86)</option>
                    </select>
                    <input type="tel" id="phone" placeholder="Phone Number" required />
                </div>
                <div class="phone-error" id="phoneError" style="display: none; color: #dc2626; font-size: 14px; margin-top: 5px;"></div>
                <div class="form-group">
                    <input type="text" id="practiceName" placeholder="Your Dental Practice Name" required />
                </div>
                <div class="form-group">
                    <textarea id="message" placeholder="Tell us about your marketing challenges. What would you like to achieve?" rows="4"></textarea>
                </div>
                <button type="button" id="submitConsultationBtn" class="form-submit" onclick="saveContact()" disabled>
                    <span>Get My Free Consultation</span>
                    <div class="spinner"></div>
                </button>
            </form>
            <div id="msg3" class="message hidden"></div>
        `;
        
        // Re-attach event listeners
        attachEventListeners();
    }
}

function attachEventListeners() {
    // Phone input formatting and validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
            checkFormCompletion();
        });
    }
    
    // Full name validation
    const nameInput = document.getElementById('fullName');
    if (nameInput) {
        nameInput.addEventListener('input', checkFormCompletion);
    }
    
    // Practice name validation
    const practiceInput = document.getElementById('practiceName');
    if (practiceInput) {
        practiceInput.addEventListener('input', checkFormCompletion);
    }
    
    // Initial check
    checkFormCompletion();
}

// ========== EXISTING ANIMATIONS AND EFFECTS ==========

// Add floating animation to service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card) => {
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

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add initial loading state
    document.body.style.opacity = '0';
    
    // Initialize OTP form event listeners
    attachEventListeners();
});
