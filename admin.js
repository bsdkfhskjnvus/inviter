/* 
   ==========================================================================
   ✨ LUXURY WEDDING INVITATION - ORGANIZER ADMIN PANEL (admin.js) ✨
   Manages RSVP form submission, statistics aggregates, tables rendering,
   wishes moderation table, and CSV UTF-8 spreadsheet downloads.
   ========================================================================== 
*/

const DEFAULT_MOCK_RSVPS = [
    {
        name: "Нурбек уулу Азамат",
        attendance: "Ооба",
        guests: "Жолдошум/Жарым менен (+1)",
        food: "Халал гана",
        transfer: "Жок, өз унаам менен барам",
        date: "2026-05-20 10:15"
    },
    {
        name: "Айсулуу Таалайбекова",
        attendance: "Ооба",
        guests: "Жалгыз өзүм",
        food: "Кадимки меню",
        transfer: "Ооба, автобус керек",
        date: "2026-05-20 11:30"
    },
    {
        name: "Канатбек Токтосунов",
        attendance: "Тилекке каршы, бара албайм",
        guests: "Жалгыз өзүм",
        food: "Кадимки меню",
        transfer: "Жок, өз унаам менен барам",
        date: "2026-05-20 12:05"
    },
    {
        name: "Канышай Мамытова",
        attendance: "Белгисиз",
        guests: "Үй-бүлөм менен (+2 же андан көп)",
        food: "Эт жебейм (Вегетариандык)",
        transfer: "Ооба, автобус керек",
        date: "2026-05-20 12:45"
    }
];

let weddingRSVPList = [];

document.addEventListener("DOMContentLoaded", () => {
    initAdminEngine();
});

function initAdminEngine() {
    const savedRSVPs = localStorage.getItem("wedding_rsvp_list");
    if (savedRSVPs) {
        try {
            weddingRSVPList = JSON.parse(savedRSVPs);
        } catch (e) {
            console.error("Failed to load RSVPs, restoring defaults...", e);
            weddingRSVPList = [...DEFAULT_MOCK_RSVPS];
        }
    } else {
        weddingRSVPList = [...DEFAULT_MOCK_RSVPS];
        localStorage.setItem("wedding_rsvp_list", JSON.stringify(weddingRSVPList));
    }
    
    setupAdminControls();
    renderAdminDashboardData();
}

function setupAdminControls() {
    const trigger = document.getElementById("btn-trigger-organizer");
    const overlay = document.getElementById("modal-admin-overlay");
    const closeBtn = document.getElementById("btn-close-admin-dashboard");
    const resetBtn = document.getElementById("btn-reset-data");
    const clearDashboardBtn = document.getElementById("btn-reset-dashboard-data");
    const exportBtn = document.getElementById("btn-export-dashboard-csv");
    const rsvpForm = document.getElementById("rsvp-form");
    
    // Toggle Admin Panel overlay
    if (trigger && overlay) {
        trigger.addEventListener("click", () => {
            overlay.classList.add("active");
            renderAdminDashboardData();
            
            if (typeof playClickSoundEffect === "function") {
                playClickSoundEffect();
            }
        });
    }
    
    if (closeBtn && overlay) {
        closeBtn.addEventListener("click", () => {
            overlay.classList.remove("active");
            
            if (typeof playClickSoundEffect === "function") {
                playClickSoundEffect();
            }
        });
    }
    
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.classList.remove("active");
        });
    }
    
    // Handle RSVP Form Submission
    if (rsvpForm) {
        rsvpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            submitNewRSVPResponse();
        });
    }
    
    // Reset Data Dashboard Action
    if (clearDashboardBtn) {
        clearDashboardBtn.addEventListener("click", () => {
            if (confirm("Чын эле бардык коноктордун жоопторун жана каалоо-тилектерин тазалоону каалайсызбы? Аларды кайра калыбына келтирүү мүмкүн эмес!")) {
                weddingRSVPList = [];
                localStorage.setItem("wedding_rsvp_list", JSON.stringify(weddingRSVPList));
                
                // Also clear wishes guestbook
                localStorage.removeItem("wedding_wishes_list");
                if (typeof initGuestbook === "function") {
                    initGuestbook();
                }
                
                renderAdminDashboardData();
                if (typeof showPremiumToast === "function") {
                    showPremiumToast("Бардык маалыматтар тазаланды!");
                }
            }
        });
    }
    
    // Export Excel CSV
    if (exportBtn) {
        exportBtn.addEventListener("click", exportDashboardRSVPToCSV);
    }
}

function submitNewRSVPResponse() {
    const nameEl = document.getElementById("rsvp-name");
    const attendanceEl = document.querySelector('input[name="rsvp-attendance"]:checked');
    const guestsEl = document.getElementById("rsvp-guests");
    const foodEl = document.getElementById("rsvp-food");
    const transferEl = document.querySelector('input[name="rsvp-transfer"]:checked');
    
    if (!nameEl || !attendanceEl) return;
    
    const guestName = nameEl.value.trim();
    if (!guestName) return;
    
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const rsvpResponse = {
        name: guestName,
        attendance: attendanceEl.value,
        guests: guestsEl ? guestsEl.value : "Жалгыз өзүм",
        food: foodEl ? foodEl.value : "Баары жарайт",
        transfer: transferEl ? transferEl.value : "Жок, өз унаам менен барам",
        date: formattedDate
    };
    
    weddingRSVPList.push(rsvpResponse);
    localStorage.setItem("wedding_rsvp_list", JSON.stringify(weddingRSVPList));
    
    // Clear Form inputs
    nameEl.value = "";
    document.getElementById("attend-yes").checked = true;
    if (guestsEl) guestsEl.selectedIndex = 0;
    if (foodEl) foodEl.selectedIndex = 0;
    document.getElementById("transfer-no").checked = true;
    
    if (typeof playClickSoundEffect === "function") {
        playClickSoundEffect();
    }
    
    if (typeof showPremiumToast === "function") {
        showPremiumToast("Чоң рахмат! Сиздин жообуңуз кабыл алынды.");
    }
    
    renderAdminDashboardData();
}

function renderAdminDashboardData() {
    const rsvpTableBody = document.getElementById("admin-rsvp-table-rows");
    const wishesTableBody = document.getElementById("admin-wishes-table-rows");
    
    const totalEl = document.getElementById("val-stat-total");
    const yesEl = document.getElementById("val-stat-yes");
    const noEl = document.getElementById("val-stat-no");
    const maybeEl = document.getElementById("val-stat-maybe");
    
    if (!rsvpTableBody) return;
    
    rsvpTableBody.innerHTML = "";
    
    let tCount = weddingRSVPList.length;
    let yCount = 0;
    let nCount = 0;
    let mCount = 0;
    
    weddingRSVPList.forEach((rsvp) => {
        // Increment metrics
        if (rsvp.attendance === "Ооба") yCount++;
        else if (rsvp.attendance.includes("бара албайм")) nCount++;
        else mCount++;
        
        // Build table row
        const tr = document.createElement("tr");
        
        let pillClass = "badge-maybe";
        if (rsvp.attendance === "Ооба") pillClass = "badge-yes";
        else if (rsvp.attendance.includes("бара албайм")) pillClass = "badge-no";
        
        tr.innerHTML = `
            <td style="font-weight: 600; color: var(--color-text-dark);">${escapeAdminHTML(rsvp.name)}</td>
            <td><span class="rsvp-status-badge ${pillClass}">${rsvp.attendance}</span></td>
            <td>${rsvp.guests}</td>
            <td>${rsvp.food}</td>
            <td>${rsvp.transfer}</td>
            <td style="font-size: 0.8rem; opacity: 0.7;">${rsvp.date}</td>
        `;
        rsvpTableBody.appendChild(tr);
    });
    
    // Update Stats
    if (totalEl) totalEl.textContent = tCount;
    if (yesEl) yesEl.textContent = yCount;
    if (noEl) noEl.textContent = nCount;
    if (maybeEl) maybeEl.textContent = mCount;
    
    // Render Wishes Moderation Table
    if (wishesTableBody) {
        wishesTableBody.innerHTML = "";
        
        const gbWishesList = localStorage.getItem("wedding_wishes_list");
        let activeWishes = [];
        if (gbWishesList) {
            try {
                activeWishes = JSON.parse(gbWishesList);
            } catch(e) {
                activeWishes = [];
            }
        }
        
        activeWishes.forEach((w, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: 600;">${escapeAdminHTML(w.author)}</td>
                <td style="font-style: italic;">"${escapeAdminHTML(w.text)}"</td>
                <td style="font-size: 0.8rem; opacity: 0.7;">${w.date}</td>
                <td>
                    <button class="btn-clipboard-copy" style="padding: 0.3rem 0.8rem; border-color: #C62828; color: #C62828;" onclick="deleteWishFromAdmin(${index})">Өчүрүү</button>
                </td>
            `;
            wishesTableBody.appendChild(tr);
        });
    }
}

window.deleteWishFromAdmin = function(index) {
    if (confirm("Чын эле бул каалоо-тилекти өчүрүүнү каалайсызбы?")) {
        const gbWishesList = localStorage.getItem("wedding_wishes_list");
        if (gbWishesList) {
            try {
                let activeWishes = JSON.parse(gbWishesList);
                activeWishes.splice(index, 1);
                localStorage.setItem("wedding_wishes_list", JSON.stringify(activeWishes));
                
                // Refresh views
                if (typeof initGuestbook === "function") {
                    initGuestbook();
                }
                renderAdminDashboardData();
                
                if (typeof showPremiumToast === "function") {
                    showPremiumToast("Каалоо өчүрүлдү!");
                }
            } catch(e) {
                console.error(e);
            }
        }
    }
};

function exportDashboardRSVPToCSV() {
    if (weddingRSVPList.length === 0) {
        if (typeof showPremiumToast === "function") {
            showPremiumToast("Жүктөп алууга эч кандай маалымат жок!");
        }
        return;
    }
    
    // Add UTF-8 Byte Order Mark (BOM) to force Excel to correctly render Cyrillic alphabet
    let csvDataContent = "\uFEFF";
    csvDataContent += "Коноктун Аты-Жөнү,Тойго катышуусу,Конок саны,Меню каалоосу,Транспорт керекпи,Толтурулган убактысы\n";
    
    weddingRSVPList.forEach((rsvp) => {
        let cleanRow = [
            `"${rsvp.name.replace(/"/g, '""')}"`,
            `"${rsvp.attendance}"`,
            `"${rsvp.guests}"`,
            `"${rsvp.food}"`,
            `"${rsvp.transfer}"`,
            `"${rsvp.date}"`
        ];
        csvDataContent += cleanRow.join(",") + "\n";
    });
    
    const blobFile = new Blob([csvDataContent], { type: "text/csv;charset=utf-8;" });
    const localUrl = URL.createObjectURL(blobFile);
    const linkAnchor = document.createElement("a");
    linkAnchor.setAttribute("href", localUrl);
    linkAnchor.setAttribute("download", "wedding_guest_rsvp_spreadsheet.csv");
    document.body.appendChild(linkAnchor);
    linkAnchor.click();
    document.body.removeChild(linkAnchor);
    
    if (typeof showPremiumToast === "function") {
        showPremiumToast("Excel (CSV) файлы ийгиликтүү жүктөлдү!");
    }
}

function escapeAdminHTML(str) {
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
