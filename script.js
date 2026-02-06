'use strict';

/**
 * RacketPro Web - Interactive Features
 * Handles: Mobile Menu, Smooth Scroll, Form Submission, and Testimonial Rotation
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initContactForm();
    initTestimonialCarousel();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu button for small screens
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
    menuBtn.setAttribute('aria-label', 'Toggle Navigation');

    if (window.innerWidth <= 768) {
        navbar.querySelector('.container').appendChild(menuBtn);
    }

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('open');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('open');
        });
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 80; // Navbar height
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Contact Form Validation & Leads Submission Logic
 */
function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Basic Validation
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }

        // UI Feedback
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';

        try {
            /**
             * Supabase Integration Logic
             * Note: In a real Next.js environment, this would call an API route.
             */
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                form.innerHTML = `
                    <div class="success-message">
                        <h3>Inquiry Received!</h3>
                        <p>Thanks ${data.name}, our professional stringing team will contact you within 24 hours.</p>
                    </div>
                `;
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            console.error('Lead submission error:', err);
            alert('Something went wrong. Please try calling us directly.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

/**
 * Simple Testimonials Carousel (P1 Feature)
 */
function initTestimonialCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length < 2) return;

    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide +