/**
 * KSD Vision Centre - Main JavaScript
 * Static eye hospital website — no backend
 */

// ===== DOM Elements =====
const header = document.getElementById('header');
const navMenu = document.getElementById('navMenu');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');
const progressBar = document.getElementById('progressBar');
const bottomNavItems = document.querySelectorAll('.bottom-nav-item[data-section]');

// ===== Create mobile overlay =====
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

// ===== Progress Bar =====
window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    if (progressBar) progressBar.style.width = scrolled + '%';
});

// ===== Header Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        header.classList.add('scrolled');
        scrollTopBtn.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        scrollTopBtn.classList.remove('visible');
    }
});

// ===== Mobile Menu Toggle =====
function closeMobileMenu() {
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (mobileToggle) {
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('active');
        if (isOpen) {
            closeMobileMenu();
        } else {
            navMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        }
    });
}

overlay.addEventListener('click', closeMobileMenu);

// ===== Smooth Scroll Navigation =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        closeMobileMenu();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            window.scrollTo({ top: targetSection.offsetTop - headerHeight, behavior: 'smooth' });
        }
    });
});

// ===== Scroll to Top =====
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Intersection Observer for Animations =====
const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            animObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => animObserver.observe(el));

// ===== Statistics Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const update = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    update();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ===== Active Navigation on Scroll =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
            });
            // Update bottom nav
            bottomNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-section') === id) item.classList.add('active');
            });
        }
    });
});

// ===== Bottom nav smooth scroll =====
bottomNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const href = item.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({ top: target.offsetTop - header.offsetHeight, behavior: 'smooth' });
        }
    });
});

// ===== Read More Toggle for Doctors =====
document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.doctor-card');
        card.classList.toggle('expanded');
        if (card.classList.contains('expanded')) {
            btn.textContent = 'Read Less';
        } else {
            btn.textContent = 'Read More';
        }
    });
});

// ===== Parallax on Hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroRight = document.querySelector('.hero-right');
    if (heroRight && scrolled < 800) {
        heroRight.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});

// ===== Console =====
console.log('%c🏥 KSD Vision Centre', 'color: #2563EB; font-size: 24px; font-weight: bold;');
console.log('%cFor appointments: 9037022226', 'color: #10B981; font-size: 14px;');
