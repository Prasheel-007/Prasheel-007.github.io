/* --- SYSTEM INITIALIZATION --- */
const cursorDot = document.createElement("div");
const cursorOutline = document.createElement("div");

cursorDot.className = "cursor-dot";
cursorOutline.className = "cursor-outline";

document.body.appendChild(cursorDot);
document.body.appendChild(cursorOutline);

// Select Targets
const glitchTargets = document.querySelectorAll('.highlight');
const gravityFields = document.querySelectorAll('.highlight, .cta-btn, .nav-links a, .project-card, h1');

// Global Mouse Position
let mouseX = 0;
let mouseY = 0;

// Outline coordinates (for the "drag" physics)
let outlineX = 0;
let outlineY = 0;

/* --- PHYSICS LOOP --- */
function animate() {
    // 1. Cursor Dot follows instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    // 2. Cursor Outline follows with "Mass"
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    // 3. BACKGROUND LIGHT UPDATE
    // This connects JS to CSS Variables. 
    // It creates the "Heavy Light" effect on the background grid.
    document.documentElement.style.setProperty('--mouse-x', `${outlineX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${outlineY}px`);

    // 4. Run Physics Engines
    handleGravity();
    checkProximity();

    requestAnimationFrame(animate);
}

// Start the System
animate();

/* --- INPUT LISTENER --- */
window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

/* --- GRAVITY ENGINE (Enhanced Range) --- */
function handleGravity() {
    let isInOrbit = false;

    gravityFields.forEach(field => {
        const rect = field.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
        const orbitRadius = 600; // Wide Range
        const coreRadius = 80;   // Event Horizon
        
        if (dist < orbitRadius) {
            isInOrbit = true;
            const rawPull = 1 - (dist / orbitRadius);
            const gravityStrength = Math.pow(rawPull, 2); 

            const moveX = (mouseX - centerX) * gravityStrength * 0.6; 
            const moveY = (mouseY - centerY) * gravityStrength * 0.6;

            field.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            const size = 40 + (40 * gravityStrength); 
            cursorOutline.style.width = `${size}px`;
            cursorOutline.style.height = `${size}px`;
            
            if (dist < coreRadius) {
                cursorOutline.style.borderColor = 'var(--secondary-color)'; 
                cursorOutline.style.mixBlendMode = 'difference';
                cursorOutline.style.opacity = 1;
            } else {
                cursorOutline.style.borderColor = 'var(--accent-color)'; 
                cursorOutline.style.opacity = 0.5 + (gravityStrength * 0.5); 
            }
        } else {
            field.style.transform = `translate(0px, 0px)`;
        }
    });

    if (!isInOrbit) {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.borderColor = 'var(--accent-color)';
        cursorOutline.style.opacity = 0.5;
        cursorOutline.style.mixBlendMode = 'normal';
    }
}

/* --- GLITCH TRIGGER --- */
function checkProximity() {
    glitchTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);

        target.classList.remove('glitch-active');
        target.classList.remove('tremble');

        if (dist < 80) {
            target.classList.add('glitch-active'); 
        } else if (dist < 300) {
            target.classList.add('tremble'); 
        }
    });
}
console.log("SYSTEM: ATMOSPHERE ONLINE.");