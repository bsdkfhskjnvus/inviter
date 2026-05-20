/* 
   ==========================================================================
   ✨ LUXURY WEDDING INVITATION - GUESTBOOK ENGINE (guestbook.js) ✨
   Allows guests to submit wedding wishes, stores in LocalStorage,
   and renders beautiful floating stylized wish cards.
   ========================================================================== 
*/

const DEFAULT_WISHES = [
    {
        author: "Улан & Мээрим",
        text: "Канатыңар бекем, махабатыңар түбөлүктүү болсун! Кармашкан колуңар эч качан ажырабай, бактылуу өмүр сүргүлө!",
        date: "2026-05-20 10:30"
    },
    {
        author: "Ата-энелерден бата",
        text: "Алтындарым, эки дүйнө бактылуу болгула. Бири-бириңерди сыйлап, түшүнүп жашагыла. Үйүңөрдөн береке, кут жана бала үнү үзүлбөсүн!",
        date: "2026-05-20 11:15"
    },
    {
        author: "Калыс & Бегимай",
        text: "Достор, тойго чакыруу сайтын аябай сонун жасапсыңар! Чыдамсыздык менен күтөбүз, аябай чоң салтанат болсун!",
        date: "2026-05-20 12:45"
    }
];

let weddingWishes = [];

document.addEventListener("DOMContentLoaded", () => {
    initGuestbook();
});

function initGuestbook() {
    const savedWishes = localStorage.getItem("wedding_wishes_list");
    if (savedWishes) {
        try {
            weddingWishes = JSON.parse(savedWishes);
        } catch (e) {
            console.error("Failed to parse wishes from cache, resetting with defaults...", e);
            weddingWishes = [...DEFAULT_WISHES];
        }
    } else {
        weddingWishes = [...DEFAULT_WISHES];
        localStorage.setItem("wedding_wishes_list", JSON.stringify(weddingWishes));
    }
    
    // Bind Submission
    const gbForm = document.getElementById("guestbook-form");
    if (gbForm) {
        gbForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleWishSubmission();
        });
    }
    
    renderWishesWall();
}

function renderWishesWall() {
    const wishesGrid = document.getElementById("guestbook-wishes-grid");
    if (!wishesGrid) return;
    
    wishesGrid.innerHTML = "";
    
    // Render wishes in reverse order (newest first)
    const reversed = [...weddingWishes].reverse();
    
    reversed.forEach((wish) => {
        const card = document.createElement("div");
        card.className = "wish-card";
        
        card.innerHTML = `
            <span class="wish-author">${escapeWishHTML(wish.author)}</span>
            <p class="wish-text">« ${escapeWishHTML(wish.text)} »</p>
            <span class="wish-date">${wish.date}</span>
        `;
        
        wishesGrid.appendChild(card);
    });
}

function handleWishSubmission() {
    const nameInput = document.getElementById("wish-author-name");
    const textInput = document.getElementById("wish-text-content");
    
    if (!nameInput || !textInput) return;
    
    const authorVal = nameInput.value.trim();
    const textVal = textInput.value.trim();
    
    if (!authorVal || !textVal) return;
    
    const now = new Date();
    const formattedDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newWish = {
        author: authorVal,
        text: textVal,
        date: formattedDateTime
    };
    
    weddingWishes.push(newWish);
    localStorage.setItem("wedding_wishes_list", JSON.stringify(weddingWishes));
    
    // Reset Form fields
    nameInput.value = "";
    textInput.value = "";
    
    // Audio trigger feedback
    if (typeof playClickSoundEffect === "function") {
        playClickSoundEffect();
    }
    
    // Re-render and toast success
    renderWishesWall();
    if (typeof showPremiumToast === "function") {
        showPremiumToast("Каалоо-тилегиңиз ийгиликтүү жарыяланды!");
    }
}

function escapeWishHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
