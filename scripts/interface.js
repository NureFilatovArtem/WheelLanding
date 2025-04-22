import { translations } from "./localisation.js";
import { spinWheel } from "./wheel.js";
import { hasSpunRecently } from "./utils.js";
// export function showPrizeModal() {

//      const lang = localStorage.getItem("selectedLang") || "ru";
//   const t = translations[lang];

//     const modal = document.getElementById("prizeModal");
//     const content = modal.querySelector(".modal-content");
  
//     // Сброс анимации (чтобы она могла переиграться)
//     content.classList.remove("show");
//     void content.offsetWidth; // триггер перерисовки
//     content.classList.add("show");
  
//     modal.classList.remove("hidden");
//   }
  

export function showConfetti() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Base confetti settings
    const confettiSettings = {
        particleCount: screenWidth < 768 ? 50 : 100,
        spread: screenWidth < 768 ? 60 : 100,
        origin: { y: 0.6 },
        startVelocity: 30,
        scalar: screenWidth < 768 ? 0.7 : 1,
        ticks: 300,
        zIndex: 100,
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
    };

    // Create confetti for full screen width
    for (let i = 0; i < (screenWidth < 768 ? 2 : 4); i++) {
        confetti({
            ...confettiSettings,
            origin: { 
                x: (i + 1) / (screenWidth < 768 ? 3 : 5),
                y: 0.6
            }
        });
    }
}

export function showPrizeModal() {
    const modal = document.getElementById("prizeModal");
    modal.classList.remove("hidden");
    modal.querySelector(".modal-content").classList.add("show");
    showConfetti();
}

 
  document.addEventListener("DOMContentLoaded", () => {
    const spinBtn = document.getElementById("spinButton");
    const lang = localStorage.getItem("selectedLang") || "ru";
    const t = translations[lang];
  
    const alreadySpun = hasSpunRecently();
  
    // 👉 Первый текст
    spinBtn.innerText = alreadySpun ? t.btnText : t.spin;
  
    spinBtn.addEventListener("click", () => {
      if (hasSpunRecently()) {
        window.location.href = "https://google.com";
      } else {
        spinBtn.disabled = true;
        spinWheel(() => {
          showConfetti();
          showPrizeModal();
  
          // Обновим localStorage с таймером
          localStorage.setItem("hasSpun", JSON.stringify({
            time: Date.now()
          }));
  
          // 👉 Меняем текст на "Забрать"
          spinBtn.innerText = t.btnText;
          spinBtn.disabled = false;
        });
      }
    });
  });