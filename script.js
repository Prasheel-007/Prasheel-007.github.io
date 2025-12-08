/* --- CYBER CORE SYSTEMS --- */

// 1. Detect Touch Device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// 2. Init Cursor (ONLY if NOT on mobile)
const cursorDot = document.createElement("div");
const cursorOutline = document.createElement("div");

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

    // Wait 2.5s for reactor spin-up
    setTimeout(() => {
        reactor.classList.add('hidden');
        cyberLayer.classList.remove('hidden');

        // Trigger Animations
        document.querySelectorAll('.mech-part').forEach((part, index) => {
            setTimeout(() => part.classList.add('active'), index * 150);
        });
    }, 2500);
});

// 4. Main Physics Loop
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

function animate() {
    // IF MOBILE: STOP HERE. Do not run physics.
    // This saves battery and prevents glitches.
    if (isTouchDevice) return; 

    // Cursor Physics
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    // Scanner Light
    document.documentElement.style.setProperty('--mouse-x', `${outlineX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${outlineY}px`);

    handleGravity();
    checkProximity();

    requestAnimationFrame(animate);
}
animate(); // Start Loop

// Track Mouse only on Desktop
if (!isTouchDevice) {
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

/* --- EFFECT 1: GRAVITY MAGNET --- */
function handleGravity() {
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