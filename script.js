/* --- UNIVERSAL CYBER CORE --- */

// 1. Always Init Cursor (CSS handles visibility based on screen size)
const cursorDot = document.createElement("div");
const cursorOutline = document.createElement("div");
cursorDot.className = "cursor-dot";
cursorOutline.className = "cursor-outline";
document.body.appendChild(cursorDot);
document.body.appendChild(cursorOutline);

// 2. Boot Sequence
window.addEventListener('load', () => {
    const reactor = document.getElementById('reactor-container');
    const cyberLayer = document.getElementById('cyber-layer');

    // Safety check to prevent errors if elements are missing
    if (!reactor || !cyberLayer) return;

    setTimeout(() => {
        reactor.classList.add('hidden');
        cyberLayer.classList.remove('hidden');

        // Trigger Animations (Parts fly in)
        document.querySelectorAll('.mech-part').forEach((part, index) => {
            setTimeout(() => part.classList.add('active'), index * 150);
        });
    }, 2500);
});

// 3. Universal Input Tracking (The Fix)
// Start at center of screen
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;

// Unified Input Handler
function handleInput(e) {
    if (e.type === 'touchmove' || e.type === 'touchstart') {
        // Touch Input: Track the first finger
        if(e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    } else {
        // Mouse Input: Standard tracking
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
}

// Listen to ALL Input Types simultaneously
window.addEventListener("mousemove", handleInput);
window.addEventListener("touchmove", handleInput, { passive: true });
window.addEventListener("touchstart", handleInput, { passive: true });

// 4. Main Physics Loop
function animate() {
    // Smooth Physics Trail
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    // Update Visual Cursor Position
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    // Update Scanner Light (The Void Effect)
    document.documentElement.style.setProperty('--mouse-x', `${outlineX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${outlineY}px`);

    // Run Physics Effects
    handleMagnet();
    handleGlitch();

    requestAnimationFrame(animate);
}
animate(); 

/* --- EFFECT 1: GRAVITY MAGNET --- */
function handleMagnet() {
    const gravityFields = document.querySelectorAll('.highlight, .cta-btn, .nav-links a, .project-card, h1, .contact-btn');
    
    gravityFields.forEach(field => {
        const rect = field.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
        const range = 400; // Magnetic Range

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