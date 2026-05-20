/* 
   ==========================================================================
   ✨ LUXURY WEDDING INVITATION - PHOTO GALLERY ENGINE (gallery.js) ✨
   Handles dynamic gallery generation, premium lightboxes, and downscaling
   of dragged images using Canvas before storing in LocalStorage.
   ========================================================================== 
*/

const DEFAULT_GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600"
];

let galleryImageUrls = [];
let activeLightboxIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    initWeddingGallery();
});

function initWeddingGallery() {
    const cachedImages = localStorage.getItem("wedding_gallery_photos");
    if (cachedImages) {
        try {
            galleryImageUrls = JSON.parse(cachedImages);
        } catch (e) {
            console.error("Gallery cache parsing failed, restoring defaults...", e);
            galleryImageUrls = [...DEFAULT_GALLERY_IMAGES];
        }
    } else {
        galleryImageUrls = [...DEFAULT_GALLERY_IMAGES];
    }
    
    renderWeddingGallery();
    setupGalleryUploaderEvents();
    setupLightboxControlEvents();
}

function renderWeddingGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    galleryImageUrls.forEach((url, index) => {
        const card = document.createElement("div");
        card.className = "gallery-card";
        
        // Image element
        const img = document.createElement("img");
        img.src = url;
        img.loading = "lazy";
        img.alt = `Үйлөнүү тоюнун сүрөтү ${index + 1}`;
        
        // Hover overlay magnifying glass
        const overlay = document.createElement("div");
        overlay.className = "gallery-hover-overlay";
        overlay.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
        `;
        
        // Deletion close button
        const delBtn = document.createElement("button");
        delBtn.className = "gallery-delete-btn";
        delBtn.innerHTML = "&times;";
        delBtn.title = "Сүрөттү өчүрүү";
        
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Avoid triggering lightbox open
            deleteGalleryImage(index);
        });
        
        // Lightbox open event
        card.addEventListener("click", () => {
            openLightboxModal(index);
        });
        
        card.appendChild(img);
        card.appendChild(overlay);
        card.appendChild(delBtn);
        grid.appendChild(card);
    });
}

function deleteGalleryImage(index) {
    if (confirm("Чын эле бул сүрөттү өчүрүүнү каалайсызбы?")) {
        galleryImageUrls.splice(index, 1);
        localStorage.setItem("wedding_gallery_photos", JSON.stringify(galleryImageUrls));
        renderWeddingGallery();
        
        if (typeof showPremiumToast === "function") {
            showPremiumToast("Сүрөт галереядан өчүрүлдү");
        }
    }
}

/* ==========================================
   Gallery Lightbox Logic
   ========================================== */
function setupLightboxControlEvents() {
    const modal = document.getElementById("lightbox-modal-element");
    const closeBtn = document.getElementById("btn-lightbox-close");
    const prevBtn = document.getElementById("btn-lightbox-prev");
    const nextBtn = document.getElementById("btn-lightbox-next");
    
    if (!modal) return;
    
    if (closeBtn) closeBtn.addEventListener("click", closeLightboxModal);
    if (prevBtn) prevBtn.addEventListener("click", navigateLightboxPrev);
    if (nextBtn) nextBtn.addEventListener("click", navigateLightboxNext);
    
    // Close on backdrop click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeLightboxModal();
    });
    
    // Keyboard navigations
    window.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("active")) return;
        if (e.key === "Escape") closeLightboxModal();
        if (e.key === "ArrowLeft") navigateLightboxPrev();
        if (e.key === "ArrowRight") navigateLightboxNext();
    });
}

function openLightboxModal(index) {
    activeLightboxIndex = index;
    const modal = document.getElementById("lightbox-modal-element");
    const img = document.getElementById("lightbox-element-img");
    
    if (!modal || !img) return;
    
    img.src = galleryImageUrls[activeLightboxIndex];
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent page scrolling
}

function closeLightboxModal() {
    const modal = document.getElementById("lightbox-modal-element");
    if (modal) {
        modal.classList.remove("active");
    }
    document.body.style.overflow = ""; // Unlock scrolling
}

function navigateLightboxPrev() {
    activeLightboxIndex = (activeLightboxIndex - 1 + galleryImageUrls.length) % galleryImageUrls.length;
    const img = document.getElementById("lightbox-element-img");
    if (img) img.src = galleryImageUrls[activeLightboxIndex];
}

function navigateLightboxNext() {
    activeLightboxIndex = (activeLightboxIndex + 1) % galleryImageUrls.length;
    const img = document.getElementById("lightbox-element-img");
    if (img) img.src = galleryImageUrls[activeLightboxIndex];
}

/* ==========================================
   Image Downscaler & Dropzone Upload Logic
   ========================================== */
function setupGalleryUploaderEvents() {
    const modal = document.getElementById("modal-gallery-uploader");
    const openBtn = document.getElementById("btn-open-gallery-uploader");
    const closeBtn = document.getElementById("btn-close-gallery-uploader");
    const dropzone = document.getElementById("uploader-dropzone-element");
    const fileInput = document.getElementById("file-uploader-input");
    
    if (!modal) return;
    
    if (openBtn) {
        openBtn.addEventListener("click", () => modal.classList.add("active"));
    }
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });
    
    // File inputs open
    if (dropzone && fileInput) {
        dropzone.addEventListener("click", () => fileInput.click());
        
        // Dragover highlights
        dropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropzone.classList.add("dragover");
        });
        
        dropzone.addEventListener("dragleave", () => {
            dropzone.classList.remove("dragover");
        });
        
        dropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropzone.classList.remove("dragover");
            const files = e.dataTransfer.files;
            processDroppedImageFiles(files);
        });
        
        fileInput.addEventListener("change", () => {
            processDroppedImageFiles(fileInput.files);
        });
    }
}

function processDroppedImageFiles(files) {
    if (!files || !files.length) return;
    
    let processCount = 0;
    const maxFiles = Math.min(files.length, 6); // Max 6 images uploaded at once
    
    for (let i = 0; i < maxFiles; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const tempImg = new Image();
            tempImg.src = event.target.result;
            
            tempImg.onload = function() {
                // Downscale image using canvas to prevent exceeding localStorage memory constraints
                const canvas = document.createElement("canvas");
                const BOUND_WIDTH = 750;
                const BOUND_HEIGHT = 900;
                let actualW = tempImg.width;
                let actualH = tempImg.height;
                
                if (actualW > actualH) {
                    if (actualW > BOUND_WIDTH) {
                        actualH *= BOUND_WIDTH / actualW;
                        actualW = BOUND_WIDTH;
                    }
                } else {
                    if (actualH > BOUND_HEIGHT) {
                        actualW *= BOUND_HEIGHT / actualH;
                        actualH = BOUND_HEIGHT;
                    }
                }
                
                canvas.width = actualW;
                canvas.height = actualH;
                
                const canvasCtx = canvas.getContext("2d");
                canvasCtx.drawImage(tempImg, 0, 0, actualW, actualH);
                
                // Compress photo heavily to high quality JPG (75%)
                const base64JpgData = canvas.toDataURL("image/jpeg", 0.75);
                
                galleryImageUrls.push(base64JpgData);
                processCount++;
                
                if (processCount === maxFiles || i === maxFiles - 1) {
                    try {
                        localStorage.setItem("wedding_gallery_photos", JSON.stringify(galleryImageUrls));
                        renderWeddingGallery();
                        
                        const uploaderModal = document.getElementById("modal-gallery-uploader");
                        if (uploaderModal) uploaderModal.classList.remove("active");
                        
                        if (typeof showPremiumToast === "function") {
                            showPremiumToast("Сүрөттөр ийгиликтүү кошулду!");
                        }
                    } catch (err) {
                        console.error("Local storage quota crash:", err);
                        if (typeof showPremiumToast === "function") {
                            showPremiumToast("Сактагыч толду. Сүрөттүн өлчөмүн кичирейтиңиз.");
                        }
                    }
                }
            };
        };
        reader.readAsDataURL(file);
    }
}
