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
    if (typeof confetti !== "undefined") {
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.6 },
        scalar: 1.1
      });
  
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 160,
          origin: { y: 0.2 },
          scalar: 1.4,
          angle: 60 + Math.random() * 60 // от 60 до 120 градусов
        });
      }, 1000);
    }
  }

  export function showPrizeModal() {
    const modal = document.getElementById("prizeModal");
    const button = modal.querySelector("button");
  
    modal.querySelector("h2").innerText = "Поздравляем!";
    modal.querySelector("p").innerText = "Заберите ваш приз!";
    button.innerText = "Забрать";
  
    // Удалим старый класс, если есть (для повторной анимации)
    button.classList.remove("focus-in-expand-fwd");
  
    // Тригерим анимацию кнопки заново
    void button.offsetWidth; // перезапуск анимации
  
    button.classList.add("focus-in-expand-fwd");
  
    modal.classList.remove("hidden");
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