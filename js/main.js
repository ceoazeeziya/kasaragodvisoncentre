/**
 * KSD Vision Centre - Main JavaScript
 * Interactive functionality for the eye clinic website
 */

// ===== DOM Elements =====
const header = document.getElementById('header');
const navMenu = document.getElementById('navMenu');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');
const appointmentForm = document.getElementById('appointmentForm');
const contactForm = document.getElementById('contactForm');

// ===== Header Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
        scrollTopBtn.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        scrollTopBtn.classList.remove('visible');
    }
});

// ===== Mobile Menu Toggle =====
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate hamburger icon
        const spans = mobileToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ===== Smooth Scroll Navigation =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        link.classList.add('active');

        // Close mobile menu if open
        navMenu.classList.remove('active');
        if (mobileToggle) {
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }

        // Smooth scroll to section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Scroll to Top Button =====
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Intersection Observer for Fade-in Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.feature-card, .service-card, .doctor-card, .stat-card, .about-feature, .contact-item');
animateElements.forEach(el => observer.observe(el));

// ===== Statistics Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    updateCounter();
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ===== Appointment Form Handling =====
if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(appointmentForm);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.date) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Phone validation (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(data.phone)) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }

        // Date validation (must be in future)
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showNotification('Please select a future date', 'error');
            return;
        }

        // Simulate form submission (in static version)
        showNotification('Appointment request submitted! We will contact you soon.', 'success');

        // Log to console (for demonstration)
        console.log('Appointment Data:', data);

        // Reset form
        appointmentForm.reset();
    });
}

// ===== Contact Form Handling =====
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        showNotification('Message sent successfully! We will get back to you soon.', 'success');

        // Log to console
        console.log('Contact Data:', data);

        // Reset form
        contactForm.reset();
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to body
    document.body.appendChild(notification);

    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            min-width: 300px;
            max-width: 500px;
        }
        
        .notification-success {
            border-left: 4px solid #10B981;
        }
        
        .notification-error {
            border-left: 4px solid #EF4444;
        }
        
        .notification-info {
            border-left: 4px solid #3B82F6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-success i {
            color: #10B981;
        }
        
        .notification-error i {
            color: #EF4444;
        }
        
        .notification-info i {
            color: #3B82F6;
        }
        
        .notification-content i {
            font-size: 1.25rem;
        }
        
        .notification-content span {
            color: #334155;
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #94A3B8;
            cursor: pointer;
            padding: 0.25rem;
            transition: color 0.2s;
        }
        
        .notification-close:hover {
            color: #334155;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @media (max-width: 640px) {
            .notification {
                right: 10px;
                left: 10px;
                min-width: auto;
            }
        }
    `;

    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Set Minimum Date for Appointment =====
const dateInput = appointmentForm?.querySelector('input[name="date"]');
if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');

    dateInput.min = `${year}-${month}-${day}`;
}

// ===== Active Navigation on Scroll =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== Real Images Loaded =====
// Professional images are now loaded directly in HTML
// No placeholder generation needed

// ===== Parallax Effect on Hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroRight = document.querySelector('.hero-right');

    if (heroRight && scrolled < 800) {
        heroRight.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===== Console Welcome Message =====
console.log('%c🏥 KSD Vision Centre', 'color: #2563EB; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to our website! 👋', 'color: #10B981; font-size: 16px;');
console.log('%cFor appointments, call: 9037022226', 'color: #334155; font-size: 14px;');
