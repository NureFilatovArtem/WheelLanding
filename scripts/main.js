import { spinWheel } from "./wheel.js";
import { showConfetti, showPrizeModal } from "./interface.js";
import { translations } from "./localisation.js";
import { hasSpunRecently } from "./utils.js";

// Language dropdown
const toggle = document.getElementById("languageToggle");
const menu = document.getElementById("languageMenu");

toggle.addEventListener("click", () => menu.classList.toggle("hidden"));
document.addEventListener("click", (e) => {
  if (!toggle.contains(e.target)) menu.classList.add("hidden");
});


document.getElementById("closeModal").addEventListener("click", () => {
    const hasSpunData = JSON.parse(localStorage.getItem("hasSpun"));
    const now = Date.now();
    const spunRecently = hasSpunData && now - hasSpunData.time < 2 * 60 * 1000;
  
    if (spunRecently) {
      window.location.href = "https://google.com";
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




// Обработка выбора языка

document.querySelectorAll("#languageMenu li").forEach((item) => {
    item.addEventListener("click", () => {
      const lang = item.querySelector("img").alt.toLowerCase(); // ru, ua, etc
      applyLanguage(lang);
      menu.classList.add("hidden");
    });
  });
  
  function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;
  
    // Перевод текста на странице
    document.querySelector(".logo").innerText = t.logo;
  
    const spinBtn = document.getElementById("spinButton");
    spinBtn.innerText = hasSpunRecently() ? t.btnText : t.spin;
  
    // Перевод в модалке (если уже открыта)
    const modal = document.getElementById("prizeModal");
    if (modal && !modal.classList.contains("hidden")) {
      modal.querySelector("h2").innerText = t.prizeTitle;
      modal.querySelector("p").innerText = t.prizeText;
      modal.querySelector("button").innerText = t.btnText;
    }
  
    // Обновление языка в dropdown toggle
    const toggleImg = document.querySelector("#languageToggle img");
    const toggleText = document.querySelector("#languageToggle span");
  
    toggleImg.src = `assets/icons/${t.flag}`;
    toggleText.innerText = t.displayName;
  
    // Сохраняем язык
    localStorage.setItem("selectedLang", lang);
  }
  
  
  document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("selectedLang") || "ru";
    applyLanguage(lang);
  
    const spinBtn = document.getElementById("spinButton");
    const t = translations[lang];
  
    const hasSpunData = JSON.parse(localStorage.getItem("hasSpun"));
    const now = Date.now();
    const spunRecently = hasSpunData && now - hasSpunData.time < 2 * 60 * 1000;
  
    // 👇 Меняем текст, если уже крутил
    spinBtn.innerText = spunRecently ? t.btnText : t.spin;
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