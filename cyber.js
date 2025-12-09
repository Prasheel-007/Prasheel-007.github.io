/* --- UNIVERSAL CYBER CORE (HYBRID PHYSICS) --- */

// 1. Init Visual Cursor
const cursorDot = document.createElement("div");
const cursorOutline = document.createElement("div");
cursorDot.className = "cursor-dot";
cursorOutline.className = "cursor-outline";
document.body.appendChild(cursorDot);
document.body.appendChild(cursorOutline);

// 2. BOOT SEQUENCE
window.addEventListener('load', () => {
    const reactor = document.getElementById('reactor-container');
    const cyberLayer = document.getElementById('cyber-layer');

    if (!reactor || !cyberLayer) return;

    // Fix Cursor Bug
    document.body.style.overflowX = "hidden"; 

    setTimeout(() => {
        reactor.classList.add('hidden');       
        cyberLayer.classList.remove('hidden'); 

        // PHASE 1: TRIGGER INTRO ANIMATIONS (CSS Transitions ON)
        // Only trigger the Top and Center parts first
        const introParts = document.querySelectorAll('.mech-part.top-part, .mech-part.center-part');
        introParts.forEach((part, index) => {
            setTimeout(() => part.classList.add('active'), 100 + (index * 200));
        });

        // PHASE 2: ENABLE MANUAL SCROLL PHYSICS (After 2 seconds)
        setTimeout(() => {
            document.body.classList.add('physics-enabled');
            // Start the scroll loop ONLY after intro is done
            scrollLoopActive = true; 
        }, 2200);

    }, 2500);
});

// 3. INPUT TRACKING
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;
let scrollLoopActive = false; // Flag to wait for intro

function handleInput(e) {
    if (e.type === 'touchmove' || e.type === 'touchstart') {
        if(e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
}

window.addEventListener("mousemove", handleInput);
window.addEventListener("touchmove", handleInput, { passive: true });
window.addEventListener("touchstart", handleInput, { passive: true });

// 4. MAIN LOOP
function animate() {
    // Cursor Physics
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    document.documentElement.style.setProperty('--mouse-x', `${outlineX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${outlineY}px`);

    handleMagnet();
    checkProximity();
    
    // Only run scroll physics if Intro is finished
    if (scrollLoopActive) {
        updateScrollPhysics();
    }

    requestAnimationFrame(animate);
}
animate(); 

/* --- CINEMATIC SCROLL ENGINE --- */
function updateScrollPhysics() {
    const parts = document.querySelectorAll('.mech-part');
    const winH = window.innerHeight;
    const assemblePoint = winH * 0.85; // Trigger earlier (85% of screen)

    parts.forEach(part => {
        // Skip the Intro parts (Nav & Hero) so they don't get messed up by scroll
        if (part.classList.contains('top-part') || part.classList.contains('center-part')) return;

        const rect = part.getBoundingClientRect();
        
        // Calculate Progress
        let progress = (winH - rect.top) / assemblePoint;
        progress = Math.min(Math.max(progress, 0), 1);
        
        // Apply Physics
        part.style.opacity = progress;
        const offset = 1 - progress; 
        
        // 3D Transforms
        if (part.classList.contains('bottom-part')) {
            part.style.transform = `perspective(1000px) translate3d(0, ${300 * offset}px, 0) rotateX(${30 * offset}deg)`; 
        } 
        else if (part.classList.contains('left-part')) {
            part.style.transform = `perspective(1000px) translate3d(${-300 * offset}px, 0, 0) rotateY(${-30 * offset}deg)`; 
        } 
        else if (part.classList.contains('right-part')) {
            part.style.transform = `perspective(1000px) translate3d(${300 * offset}px, 0, 0) rotateY(${30 * offset}deg)`; 
        } 
    });
}

/* --- OTHER PHYSICS --- */
function handleMagnet() {
    const gravityFields = document.querySelectorAll('.highlight, .cta-btn, .nav-links a, .project-card, h1, .contact-btn');
    gravityFields.forEach(field => {
        const rect = field.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
        const range = 400; 

        if (dist < range) {
            const pull = 1 - (dist / range);
            const moveX = (mouseX - centerX) * pull * 0.5; 
            const moveY = (mouseY - centerY) * pull * 0.5;
            field.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            field.style.transform = `translate(0, 0)`;
        }
    });
}

function checkProximity() {
    const glitchTargets = document.querySelectorAll('.highlight');
    glitchTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
        target.classList.remove('glitch-active');
        if (dist < 150) target.classList.add('glitch-active');
    });
}