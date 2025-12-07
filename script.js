/* --- SYSTEM INITIALIZATION --- */
const cursorDot = document.createElement("div");
const cursorOutline = document.createElement("div");

cursorDot.className = "cursor-dot";
cursorOutline.className = "cursor-outline";

document.body.appendChild(cursorDot);
document.body.appendChild(cursorOutline);

// Select the "Magic" and "Logic" text elements
const glitchTargets = document.querySelectorAll('.highlight');
const magnets = document.querySelectorAll('.highlight, .cta-btn, .nav-links a');

// Global Mouse Position
let mouseX = 0;
let mouseY = 0;

/* --- MOUSE TRACKING --- */
window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 1. Cursor Dot follows instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    // 2. Cursor Outline follows with lag (Smooth physics)
    cursorOutline.animate({
        left: `${mouseX}px`,
        top: `${mouseY}px`
    }, { duration: 500, fill: "forwards" });

    // 3. RUN PROXIMITY CHECKS
    checkProximity();
    handleMagnetism(e);
});

/* --- FEATURE 1: PROXIMITY GLITCH --- */
function checkProximity() {
    glitchTargets.forEach(target => {
        // Get the center of the text
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance using Pythagoras theorem
        const distance = Math.hypot(mouseX - centerX, mouseY - centerY);

        // RESET STATES
        target.classList.remove('glitch-active');
        target.classList.remove('tremble');

        // LOGIC: Distance Thresholds
        if (distance < 50) {
            // Very Close: FULL CHAOS
            target.classList.add('glitch-active');
        } else if (distance < 150) {
            // Nearby: MILD TREMBLE
            target.classList.add('tremble');
        }
    });
}

/* --- FEATURE 2: MAGNETIC PULL --- */
function handleMagnetism(e) {
    magnets.forEach(magnet => {
        const rect = magnet.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance
        const distance = Math.hypot(mouseX - centerX, mouseY - centerY);
        
        // If within "Magnetic Field" (100px radius)
        if (distance < 100) {
            magnet.classList.add('magnet-active');
            
            // Calculate pull strength (closer = stronger)
            const pullStrength = 0.3; // 30% movement
            const moveX = (mouseX - centerX) * pullStrength;
            const moveY = (mouseY - centerY) * pullStrength;

            // Move the element TOWARDS the mouse
            magnet.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            // Expand Cursor to show "Lock On"
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.borderColor = 'var(--secondary-color)';
        } else {
            // Reset position when mouse leaves field
            magnet.classList.remove('magnet-active');
            magnet.style.transform = `translate(0px, 0px)`;
            
            // Reset Cursor
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'var(--accent-color)';
        }
    });
}

console.log("SYSTEM: PROXIMITY SENSORS ONLINE.");