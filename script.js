/* --- CYBER CORE SYSTEMS --- */

// 1. Detect Device Type
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// 2. Init Visual Cursor
const cursorDot = document.createElement("div");
const cursorOutline = document.createElement("div");

// Only show custom cursor on Desktop
if (!isTouchDevice) {
    cursorDot.className = "cursor-dot";
    cursorOutline.className = "cursor-outline";
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
}

// 3. Boot Sequence
window.addEventListener('load', () => {
    const reactor = document.getElementById('reactor-container');
    const cyberLayer = document.getElementById('cyber-layer');

    setTimeout(() => {
        if(reactor) reactor.classList.add('hidden');
        if(cyberLayer) cyberLayer.classList.remove('hidden');

        document.querySelectorAll('.mech-part').forEach((part, index) => {
            setTimeout(() => part.classList.add('active'), index * 150);
        });
    }, 2500);
});

// 4. Input Tracking
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;

// Desktop: Track Mouse
if (!isTouchDevice) {
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

// Mobile: Tap Override (JARVIS pauses for user)
if (isTouchDevice) {
    window.addEventListener("touchstart", (e) => {
        if(e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            // Immediate visual feedback on tap
            outlineX = mouseX;
            outlineY = mouseY;
        }
    }, { passive: true });
}

// 5. Main Physics Loop (The Brain)
function animate() {
    
    // --- JARVIS AUTO-PILOT (Mobile Only) ---
    if (isTouchDevice) {
        const time = Date.now() * 0.001;
        // Creates a smooth "Infinity Symbol" movement pattern
        const scanRangeX = window.innerWidth * 0.4;
        const scanRangeY = window.innerHeight * 0.3;
        
        // We gently move the target coordinates automatically
        // This simulates the "Scanner" looking around the page
        mouseX = (window.innerWidth / 2) + Math.sin(time) * scanRangeX;
        mouseY = (window.innerHeight / 2) + Math.cos(time * 1.5) * scanRangeY;
    }

    // --- PHYSICS ENGINE ---
    // Smooth trail for visual effects
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    // Update Desktop Cursor (if exists)
    if (!isTouchDevice) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
    }

    // Update Scanner Light (The Void Effect)
    document.documentElement.style.setProperty('--mouse-x', `${outlineX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${outlineY}px`);

    // Run Interactions
    handleMagnet();
    handleGlitch();

    requestAnimationFrame(animate);
}
animate(); 

/* --- EFFECT 1: GRAVITY MAGNET --- */
function handleMagnet() {
    // Only run magnet physics on Desktop to save mobile battery
    if (isTouchDevice) return; 

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

/* --- EFFECT 2: PROXIMITY GLITCH --- */
function checkProximity() {
    // Glitch works on both, triggered by Auto-Pilot or Mouse
    const glitchTargets = document.querySelectorAll('.highlight');

    glitchTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
        
        target.classList.remove('glitch-active');
        if (dist < 150) {
            target.classList.add('glitch-active');
        }
    });
}