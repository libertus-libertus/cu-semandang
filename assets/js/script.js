// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Mobile menu toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Mobile accordion
const accordionButtons = document.querySelectorAll('.accordion-button');

accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const accordionContent = button.nextElementSibling;
        const icon = button.querySelector('i');

        accordionContent.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
    });
});

// Mobile sub-accordion
const subAccordionButtons = document.querySelectorAll('.sub-accordion-button');

subAccordionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const subAccordionContent = button.nextElementSibling;
        const icon = button.querySelector('i');

        subAccordionContent.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
    });
});

// Desktop Dropdown Functionality (Click to toggle)
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('.dropdown-button');
    const content = dropdown.querySelector('.dropdown-content');
    const icon = button.querySelector('i');

    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent document click from closing immediately

        // Close other open dropdowns
        dropdowns.forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
                const otherContent = otherDropdown.querySelector('.dropdown-content');
                const otherIcon = otherDropdown.querySelector('i');
                otherContent.classList.remove('active');
                if (otherIcon) otherIcon.classList.remove('rotate-180');
                // Close nested dropdowns if any
                const nestedContents = otherDropdown.querySelectorAll('.nested-dropdown-content');
                nestedContents.forEach(nc => nc.classList.remove('active'));
                const nestedIcons = otherDropdown.querySelectorAll('.nested-dropdown-button i');
                nestedIcons.forEach(ni => ni.classList.remove('rotate-180'));
            }
        });

        // Toggle current dropdown
        content.classList.toggle('active');
        if (icon) icon.classList.toggle('rotate-180');

        // If a nested dropdown, ensure parent doesn't close on nested button click
        if (dropdown.classList.contains('nested-dropdown')) {
            event.stopPropagation();
        }
    });

    // Handle nested dropdowns
    const nestedDropdown = dropdown.querySelector('.nested-dropdown');
    if (nestedDropdown) {
        const nestedButton = nestedDropdown.querySelector('.nested-dropdown-button');
        const nestedContent = nestedDropdown.querySelector('.nested-dropdown-content');
        const nestedIcon = nestedButton.querySelector('i');

        nestedButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Crucial to prevent parent dropdown from closing
            nestedContent.classList.toggle('active');
            if (nestedIcon) nestedIcon.classList.toggle('rotate-180');
        });
    }
});

// Close dropdowns when clicking anywhere else on the document
document.addEventListener('click', (event) => {
    dropdowns.forEach(dropdown => {
        const content = dropdown.querySelector('.dropdown-content');
        const icon = dropdown.querySelector('.dropdown-button i');
        if (content.classList.contains('active') && !dropdown.contains(event.target)) {
            content.classList.remove('active');
            if (icon) icon.classList.remove('rotate-180');
            // Close any open nested dropdowns too
            const nestedContents = dropdown.querySelectorAll('.nested-dropdown-content');
            nestedContents.forEach(nc => nc.classList.remove('active'));
            const nestedIcons = dropdown.querySelectorAll('.nested-dropdown-button i');
            nestedIcons.forEach(ni => ni.classList.remove('rotate-180'));
        }
    });
});


// Carousel functionality
const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const indicators = document.querySelectorAll('.carousel-indicator');

let currentIndex = 0;

function updateCarousel() {
    slides.forEach((slide, index) => {
        if (index === currentIndex) {
            slide.classList.add('active'); // Add active class
            AOS.refreshHard(); // Re-initialize AOS animations for the active slide
        } else {
            slide.classList.remove('active'); // Remove active class
        }
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('bg-opacity-100', index === currentIndex);
        indicator.classList.toggle('bg-opacity-50', index !== currentIndex);
    });

    // Re-initialize AOS specifically for elements within the current slide
    const activeSlideElements = slides[currentIndex].querySelectorAll('[data-aos]');
    activeSlideElements.forEach(el => {
        // Check if element is hidden by AOS and if it should be animated
        if (!el.classList.contains('aos-animate') && el.dataset.aos) {
            el.classList.remove('aos-animate', 'aos-init'); // Reset AOS classes
            void el.offsetWidth; // Trigger reflow
            AOS.init({
                once: true
            }); // Re-init AOS for this element
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
    });
});

// Initialize carousel on load
updateCarousel();

// Auto slide
let slideInterval = setInterval(nextSlide, 5000);

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

carousel.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

carousel.addEventListener('mouseleave', resetInterval);

// Back to top button
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
    } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});