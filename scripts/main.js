import { spinWheel } from "./wheel.js";
import { showConfetti, showPrizeModal } from "./interface.js";
import { translations } from "./localisation.js";
import { hasSpunRecently } from "./utils.js";

// Language dropdown
const toggle = document.getElementById("languageToggle");
const menu = document.getElementById("languageMenu");

// Toggle dropdown
toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add("hidden");
    }
});

// Handle language selection
document.querySelectorAll("#languageMenu li").forEach((item) => {
    item.addEventListener("click", (e) => {
        e.stopPropagation();
        const lang = item.querySelector("img").alt.toLowerCase();
        applyLanguage(lang);
        menu.classList.add("hidden");
    });
});

function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Update modal texts if it's open
    const modal = document.getElementById("prizeModal");
    if (modal && !modal.classList.contains("hidden")) {
        modal.querySelector("h2").textContent = t.prizeTitle;
        modal.querySelector("p").textContent = t.prizeText;
        modal.querySelector("button").textContent = t.btnText;
    }

    // Update language toggle
    const toggleImg = toggle.querySelector("img");
    const toggleText = toggle.querySelector("span");
    
    toggleImg.src = `assets/icons/${t.flag}`;
    toggleImg.alt = lang.toUpperCase();
    toggleText.textContent = t.displayName;

    // Save selected language
    localStorage.setItem("selectedLang", lang);
}

// Initialize language on page load
document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("selectedLang") || "ru";
    applyLanguage(lang);
});

// Modal close handler
document.getElementById("closeModal").addEventListener("click", () => {
    const hasSpunData = JSON.parse(localStorage.getItem("hasSpun"));
    const now = Date.now();
    const spunRecently = hasSpunData && now - hasSpunData.time < 2 * 60 * 1000;

    if (spunRecently) {
        window.location.href = "https://charlie-winner.xyz/registration";
    } else {
        document.getElementById("prizeModal").classList.add("hidden");
    }
});

// Закрытие модального окна при нажатии в пустое место экрана
document.addEventListener("click", (event) => {
    const modal = document.getElementById("prizeModal");
    const modalContent = modal.querySelector(".modal-content");
  
    if (!modal.classList.contains("hidden") && !modalContent.contains(event.target)) {
      modal.classList.add("hidden");
    }
  });

// ---------- Заготовка для изменения колеса при изменении языка ---------

//   function applyLanguage(lang) {
//     const t = translations[lang];
  
//     document.querySelector(".logo").innerText = t.logo;
//     document.getElementById("spinButton").innerText = t.spin;
  
//     //  Изменить флаг и название
//     const toggle = document.getElementById("languageToggle");
//     toggle.querySelector("img").src = `assets/icons/${t.flag}`;
//     toggle.querySelector("span").innerText = t.displayName;
  
//     //  Изменить колесо (только если элемент есть)
//     const wheelImg = document.querySelector(".wheel-bg");
//     if (wheelImg) {
//       wheelImg.src = `assets/images/${t.wheel}`;
//     }
  
//     localStorage.setItem("selectedLang", lang);
//   }