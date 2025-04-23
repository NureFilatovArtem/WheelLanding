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
    const wheelButton = document.querySelector(".wheel-button-container");
    const lang = localStorage.getItem("selectedLang") || "ru";
    const t = translations[lang];
  
    const alreadySpun = hasSpunRecently();
  
    // 👉 Первый текст
    spinBtn.innerText = alreadySpun ? t.btnText : t.spin;
  
    // Добавляем обработчик для WheelButton
    wheelButton.addEventListener("click", () => {
        if (hasSpunRecently()) {
            window.location.href = "https://google.com";
            return;
        }

        const wheelInside = document.querySelector(".wheel-inside");
        if (!wheelInside.style.transform.includes("rotate")) {
            // 5 полных оборотов + остановка на 7-м секторе (индекс 6 из 8, угол 6 * 45 = 270)
            const spins = 5 * 360;
            const stopAt = 270; // Сектор 7
            const finalRotation = spins + stopAt;

            wheelInside.style.transform = `translate(-50%, -50%) rotate(${finalRotation}deg)`;

            // Показываем конфетти и модальное окно после вращения
            setTimeout(() => {
                showConfetti();
                showPrizeModal();

                // Обновляем localStorage с таймером
                localStorage.setItem("hasSpun", JSON.stringify({
                    time: Date.now()
                }));

                // 👉 Меняем текст на кнопке
                spinBtn.innerText = t.btnText;
            }, 5200);
        }
    });
  
    // Оставляем существующий обработчик для старой кнопки
    spinBtn.addEventListener("click", () => {
      if (hasSpunRecently()) {
        window.location.href = "https://google.com";
      } else {
        spinBtn.disabled = true;
        spinWheel(() => {
          showConfetti();
          showPrizeModal();
  
          localStorage.setItem("hasSpun", JSON.stringify({
            time: Date.now()
          }));
  
          spinBtn.innerText = t.btnText;
          spinBtn.disabled = false;
        });
      }
    });
  });