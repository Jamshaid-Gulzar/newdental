// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const tooth = document.getElementById('tooth-container');
    const toothImg = document.getElementById('main-tooth');
    
    // Initial reveal animation for the navbar
    gsap.from('#main-nav', {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out'
    });

    // Reveal Hero Text
    const tl = gsap.timeline();
    tl.from('.reveal-text', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out'
    });

    // Tooth Image Floating Animation
    gsap.to(toothImg, {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Scroll Animation: Move and SPIN tooth to section 2
    const isMobile = window.innerWidth <= 992;
    
    if (isMobile) {
        // Mobile specific: Land and STAY
        gsap.to(tooth, {
            x: "0", 
            y: "-120px",     
            scale: 0.6,  
            rotation: 360, 
            scrollTrigger: {
                trigger: "#details",
                start: "top center",
                end: "top center",
                scrub: true,
                onEnter: () => {
                    const targetSec = document.getElementById('details');
                    // land perfectly in the "empty-side" blank space
                    const emptySide = targetSec.querySelector('.empty-side');
                    gsap.set(tooth, { 
                        position: 'absolute', 
                        top: emptySide.offsetTop + (emptySide.offsetHeight / 2), 
                        yPercent: -50,
                        y: 0,
                        left: "50%",
                        xPercent: -50,
                        x: 0,
                        zIndex: 100 
                    });
                },
                onLeaveBack: () => {
                    gsap.set(tooth, { 
                        position: 'fixed', 
                        top: '50%',
                        left: '50%',
                        y: "-50%",
                        xPercent: -50, 
                        x: 0,
                        scale: 1,
                        rotation: 0,
                        zIndex: 1
                    });
                }
            }
        });
    } else {
        // Desktop behavior
        gsap.to(tooth, {
            x: "-25vw", 
            y: "0",     
            scale: 1.1,  
            rotation: 360, 
            scrollTrigger: {
                trigger: "#details",
                start: "top bottom",
                end: "bottom bottom",
                scrub: 1,
                onLeave: () => {
                    const targetSec = document.getElementById('details');
                    const offsetTop = targetSec.offsetTop + targetSec.offsetHeight - (window.innerHeight / 2);
                    gsap.set(tooth, { 
                        position: 'absolute', 
                        top: offsetTop,
                        y: "0%" 
                    });
                },
                onEnterBack: () => {
                    gsap.set(tooth, { 
                        position: 'fixed', 
                        top: '50%',
                        y: "-50%"
                    });
                }
            }
        });
    }

    // Mouse Interaction for Tilt
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const xPos = (clientX - centerX) / centerX;
        const yPos = (clientY - centerY) / centerY;

        // Subtle Tilt Effect (Active only in hero)
        if (window.scrollY < 200) {
            gsap.to(toothImg, {
                rotationY: xPos * 25,
                rotationX: -yPos * 25,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    });

    // Parallax Sliding Panels Logic
    const parallaxSection = document.getElementById('parallax-features');
    const textPanel = document.getElementById('text-panel');
    const imagePanel = document.getElementById('image-panel');

    // Set initial position for image panel (offset upwards)
    gsap.set(imagePanel, { y: "-160vh" });

    ScrollTrigger.create({
        trigger: "#parallax-features",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
            const index = self.progress * 2;
            const textMove = index * 80;
            const imageMove = 160 - (index * 80);

            gsap.set(textPanel, { y: `-${textMove}vh` });
            gsap.set(imagePanel, { y: `-${imageMove}vh` });
        }
    });

// VIP Section Entrance Animation
    gsap.to('.vip-card', {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
            trigger: "#vip-experience",
            start: "top center",
            toggleActions: "play none none reverse"
        }
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });
    }

    // Close menu when a link is clicked
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });
});

// Testimonial Stacked Logic
let testimonialIndex = 0;
function setupTestimonials() {
    const stack = document.getElementById('stack');
    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll('.ka-card'));
    const testimonials = document.querySelectorAll('.ka-testimonial');
    const dots = document.querySelectorAll('.ka-dot');
    let isDragging = false;
    let startX = 0;

    function updateDisplay() {
        cards.forEach((card, i) => {
            card.classList.remove('active', 'behind', 'far-behind');
            let pos = (i - testimonialIndex + cards.length) % cards.length;
            
            let targetRotation = 0;
            let targetX = 0;
            let targetY = 0;

            if (pos === 0) {
                card.classList.add('active');
                targetRotation = -2; // Constant slight tilt for active card
            } else if (pos === 1) {
                card.classList.add('behind');
                targetRotation = 8;
                targetX = 60;
                targetY = -15;
            } else {
                card.classList.add('far-behind');
                targetRotation = 16;
                targetX = 110;
                targetY = -30;
            }
            
            // Apply tilted position with GSAP for smooth snap
            gsap.to(card, { 
                x: targetX, 
                y: targetY,
                rotation: targetRotation, 
                duration: 0.6, 
                ease: "back.out(1.7)" 
            });
        });

        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        testimonials[testimonialIndex].classList.add('active');
        dots[testimonialIndex].classList.add('active');
    }

    function swap() {
        testimonialIndex = (testimonialIndex + 1) % cards.length;
        updateDisplay();
    }

    // Dot Click Navigation
    dots.forEach((dot, i) => {
        dot.style.cursor = 'pointer';
        dot.onclick = () => {
            testimonialIndex = i;
            updateDisplay();
        };
    });

    stack.addEventListener('mousedown', (e) => { isDragging = true; startX = e.clientX; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let delta = e.clientX - startX;
        if (Math.abs(delta) > 5) {
            const activeCard = cards[testimonialIndex];
            // Allow drag tilt
            gsap.set(activeCard, { x: delta, rotation: -2 + (delta/10) });
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        let delta = e.clientX - startX;
        if (Math.abs(delta) > 100) swap();
        else updateDisplay();
    });

    stack.addEventListener('click', (e) => {
        if (Math.abs(e.clientX - startX) < 5) swap();
    });

    stack.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
    stack.addEventListener('touchend', (e) => {
        let delta = e.changedTouches[0].clientX - startX;
        if (Math.abs(delta) > 100) swap();
    });

    // Initial run to set tilted positions
    updateDisplay();

    // Auto Scroll: Change every 3 seconds
    setInterval(() => {
        swap();
    }, 3000);
}

// FAQ Accordion Logic
function setupFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            // Close other items (optional, but professional)
            document.querySelectorAll('.faq-item').forEach(other => {
                if(other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });
}

// Smooth Scroll for Nav Links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.onclick = function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#" || targetId === "#appointment") return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        };
    });
}
// Entrance Animations for all sections
function setupEntranceAnimations() {
    const triggerElements = gsap.utils.toArray('section, .ka-parallax-wrapper, footer');
    
    triggerElements.forEach(el => {
        // Sirf opacity animate karo taake transforms "position: sticky" ko destroy na karein
        gsap.fromTo(el, 
            { opacity: 0 }, 
            {
                opacity: 1, 
                duration: 1.2, 
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
}

// Team Cards Stacking Logic
function setupTeamStack() {
    const cards = gsap.utils.toArray(".dr-card");
    if(!cards.length) return;

    cards.forEach((card, i) => {
        // Initial state: Normal scale
        gsap.set(card, { scale: 0.95 });

        // ScrollTrigger to scale up when card reaches its sticky position
        ScrollTrigger.create({
            trigger: card,
            start: "top 80%", 
            end: "top 15%",   
            scrub: true,
            onUpdate: (self) => {
                const scaleValue = 0.95 + (0.05 * self.progress);
                gsap.set(card, { 
                    scale: scaleValue
                });
            }
        });

        // Stacking effect: Cards below get slightly darker/smaller as new ones come over
        if (i < cards.length - 1) {
            gsap.to(card, {
                scale: 0.9,
                opacity: 0.8, // Stay visible but slightly faded
                scrollTrigger: {
                    trigger: cards[i + 1], // Triggered by the NEXT card
                    start: "top 15%",
                    end: "top 5%", 
                    scrub: true
                }
            });
        }
    });
}

// Global scope init
setTimeout(() => {
    setupTestimonials();
    setupTeamStack();

    // Form Submission Handler
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.style.display = 'none';
            successMsg.style.display = 'block';
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    setupFAQ();
    setupSmoothScroll();
    setupEntranceAnimations();
}, 500); 

// Gallery Panel Logic
function openPanel(el) {
    const panels = document.querySelectorAll('.ba-panel');
    panels.forEach(p => p.classList.remove('active'));
    el.classList.add('active');
}
