/* 
   ==========================================================================
   ✨ LUXURY WEDDING INVITATION - CORE ENGINE (app.js) ✨
   Manages Countdown, Theme Toggling, Sound Player, Canvas Petals Rain,
   Copy Clipboard, and Scroll Reveal Animations
   ========================================================================== 
*/

// Configuration
const WEDDING_TARGET_TIME = new Date("2026-07-25T17:00:00").getTime();
// Chopin Nocturne Op. 9 No. 2 - beautiful, gentle, copyright-free classical wedding background music
const WEDDING_MUSIC_SOURCE = "https://upload.wikimedia.org/wikipedia/commons/3/30/Chopin_-_Nocturne_op.9_No.2.ogg";

// Audio instance
let weddingAudio = null;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Countdown Timer
    initCountdownClock();
    
    // 2. Initialize Background Music Player
    initAudioController();
    
    // 3. Initialize organic Canvas flower petals rain
    initCanvasFlowerRain();
    
    // 4. Initialize Clipboard copy action
    initClipboardSupport();
    
    // 5. Initialize Intersection Scroll entrance animations
    initScrollRevealEffects();
    
    // 6. Check saved theme selection in LocalStorage
    restoreUserSelectedTheme();
});

/* ==========================================
   1. Live Countdown Timer
   ========================================== */
function initCountdownClock() {
    const daysEl = document.getElementById("days-val");
    const hoursEl = document.getElementById("hours-val");
    const minutesEl = document.getElementById("minutes-val");
    const secondsEl = document.getElementById("seconds-val");
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    
    function updateClock() {
        const currentTime = new Date().getTime();
        const difference = WEDDING_TARGET_TIME - currentTime;
        
        if (difference < 0) {
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            clearInterval(clockInterval);
            return;
        }
        
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        
        daysEl.textContent = String(d).padStart(2, '0');
        hoursEl.textContent = String(h).padStart(2, '0');
        minutesEl.textContent = String(m).padStart(2, '0');
        secondsEl.textContent = String(s).padStart(2, '0');
    }
    
    updateClock(); // Initial boot call
    const clockInterval = setInterval(updateClock, 1000);
}

/* ==========================================
   2. Floating Premium Classical Audio Player
   ========================================== */
function initAudioController() {
    weddingAudio = new Audio(WEDDING_MUSIC_SOURCE);
    weddingAudio.loop = true;
    weddingAudio.volume = 0.4; // Default volume set to 40%
    
    const playToggleBtn = document.getElementById("btn-music-play-toggle");
    const volumeSlider = document.getElementById("music-vol-control");
    
    if (!playToggleBtn) return;
    
    let isPlaying = false;
    
    // Action handler
    playToggleBtn.addEventListener("click", () => {
        if (isPlaying) {
            weddingAudio.pause();
            playToggleBtn.classList.remove("playing");
            playToggleBtn.innerHTML = `
                <svg id="music-icon-play" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            `;
            showPremiumToast("Музыка убактылуу токтотулду");
            isPlaying = false;
        } else {
            // Autoplay safety handling
            weddingAudio.play().then(() => {
                playToggleBtn.classList.add("playing");
                playToggleBtn.innerHTML = `
                    <svg id="music-icon-pause" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                `;
                showPremiumToast("Музыка жаңырды...");
                isPlaying = true;
            }).catch(err => {
                console.error("Audio playback gesture safety block:", err);
                showPremiumToast("Музыканы ойнотуу үчүн кайра басыңыз");
            });
        }
    });
    
    // Volume adjustments
    if (volumeSlider) {
        volumeSlider.addEventListener("input", (e) => {
            if (weddingAudio) {
                weddingAudio.volume = e.target.value;
            }
        });
    }
}

/* ==========================================
   3. Custom Canvas falling rose petals rain
   ========================================== */
function initCanvasFlowerRain() {
    const canvas = document.getElementById("petal-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    
    // Handle responsive resize updates
    window.addEventListener("resize", () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });
    
    const petalLimit = 32; // Optimized count for lightweight luxury experience
    const petalPool = [];
    
    class PetalParticle {
        constructor() {
            this.reset();
            this.y = Math.random() * h; // Start at random screen heights initially
        }
        
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * -60 - 20;
            this.size = Math.random() * 11 + 6;
            this.speedY = Math.random() * 1.3 + 0.7;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.angle = Math.random() * 360;
            this.spinSpeed = Math.random() * 1.5 - 0.75;
            this.opacity = Math.random() * 0.42 + 0.25;
            
            // Generate soft pastel colors matching general theme (reds/cream/golds)
            const themeColor = document.body.className;
            let r, g, b;
            if (themeColor.includes("ruby")) {
                r = Math.floor(Math.random() * 30 + 200); // 200-230
                g = Math.floor(Math.random() * 20 + 30);  // 30-50
                b = Math.floor(Math.random() * 20 + 50);  // 50-70
            } else if (themeColor.includes("emerald")) {
                r = Math.floor(Math.random() * 20 + 30);
                g = Math.floor(Math.random() * 30 + 120);
                b = Math.floor(Math.random() * 20 + 90);
            } else {
                // Gold theme rose petals / gold leaf sparks
                r = Math.floor(Math.random() * 20 + 235);
                g = Math.floor(Math.random() * 20 + 200);
                b = Math.floor(Math.random() * 30 + 130);
            }
            this.color = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.beginPath();
            
            // Draw curved organic leaf petal path
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y / 40) * 0.35; // Sway side-to-side
            this.angle += this.spinSpeed;
            
            if (this.y > h + 30) {
                this.reset();
            }
        }
    }
    
    // Fill particle pool
    for (let i = 0; i < petalLimit; i++) {
        petalPool.push(new PetalParticle());
    }
    
    // Run animation frames
    function run() {
        ctx.clearRect(0, 0, w, h);
        petalPool.forEach((p) => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(run);
    }
    run();
}

/* ==========================================
   4. Copy Card to Clipboard Action
   ========================================== */
function initClipboardSupport() {
    const copyBtn = document.getElementById("btn-copy-gift-card");
    const numEl = document.getElementById("digital-card-number");
    
    if (!copyBtn || !numEl) return;
    
    copyBtn.addEventListener("click", () => {
        // Strip out empty space tokens
        const rawDigits = numEl.textContent.replace(/\s+/g, '');
        
        navigator.clipboard.writeText(rawDigits).then(() => {
            copyBtn.textContent = "Көчүрүлдү!";
            copyBtn.style.backgroundColor = "var(--color-primary)";
            copyBtn.style.color = "var(--color-white)";
            showPremiumToast("Карт номери ийгиликтүү көчүрүлдү!");
            
            setTimeout(() => {
                copyBtn.textContent = "Номерди көчүрүү";
                copyBtn.style.backgroundColor = "transparent";
                copyBtn.style.color = "var(--color-primary)";
            }, 3000);
        }).catch(err => {
            console.error("Clipboard failure: ", err);
            showPremiumToast("Ката: Көчүрүү аткарылган жок");
        });
    });
}

/* ==========================================
   5. Interactive Theme Switcher Logic
   ========================================== */
window.switchTheme = function(themeClass, dotElement) {
    // 1. Update body class
    document.body.className = themeClass;
    
    // 2. Manage active selector state
    const dots = document.querySelectorAll(".theme-dot");
    dots.forEach((dot) => dot.classList.remove("active"));
    if (dotElement) {
        dotElement.classList.add("active");
    }
    
    // 3. Save selection to local cache
    localStorage.setItem("user_selected_wedding_theme", themeClass);
    
    // Trigger audio effect if playing
    playClickSoundEffect();
};

function restoreUserSelectedTheme() {
    const cachedTheme = localStorage.getItem("user_selected_wedding_theme");
    if (cachedTheme) {
        document.body.className = cachedTheme;
        
        // Match active selectors
        const dots = document.querySelectorAll(".theme-dot");
        dots.forEach((dot) => {
            dot.classList.remove("active");
            if (dot.classList.contains("dot-gold") && cachedTheme === "theme-gold") dot.classList.add("active");
            if (dot.classList.contains("dot-ruby") && cachedTheme === "theme-ruby") dot.classList.add("active");
            if (dot.classList.contains("dot-emerald") && cachedTheme === "theme-emerald") dot.classList.add("active");
        });
    }
}

/* ==========================================
   6. Scroll-Reveal Intersection Animations
   ========================================== */
function initScrollRevealEffects() {
    const animCards = document.querySelectorAll(".hero-card, .invitation-card, .story-content, .quiz-container, .dresscode-card, .gallery-card, .wishes-form-card, .wish-card, .rsvp-card, .gifts-card, .maps-box-wrapper");
    
    // Setup reveal styles
    const styles = document.createElement("style");
    styles.innerText = `
        .luxury-reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 1.3s cubic-bezier(0.22, 0.85, 0.44, 1), transform 1.3s cubic-bezier(0.22, 0.85, 0.44, 1);
        }
        .luxury-reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styles);
    
    const obsOptions = {
        root: null,
        rootMargin: "0px 0px -70px 0px", // Trigger slightly early
        threshold: 0.08
    };
    
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                obs.unobserve(e.target);
            }
        });
    }, obsOptions);
    
    animCards.forEach((c) => {
        c.classList.add("luxury-reveal");
        obs.observe(c);
    });
}

/* ==========================================
   7. Helper UI Interactive Utilities
   ========================================== */
window.showPremiumToast = function(msg) {
    const box = document.getElementById("toast-message-box");
    const content = document.getElementById("toast-message-content");
    if (box && content) {
        content.textContent = msg;
        box.classList.add("active");
        setTimeout(() => box.classList.remove("active"), 3500);
    }
};

// Cute sound click feedback generator using browser synth (no file dependency)
window.playClickSoundEffect = function() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // Slide up to A5
        
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15); // Fade out quick
        
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
        // Safe fail if browser audio context blocked
    }
};
