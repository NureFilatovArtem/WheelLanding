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
    const wheelButton = document.querySelector(".wheel-button-container");
    const lang = localStorage.getItem("selectedLang") || "ru";
    const t = translations[lang];

    wheelButton.addEventListener("click", () => {
        if (hasSpunRecently()) {
            window.location.href = "https://google.com";
            return;
        }

        const wheelInside = document.querySelector(".wheel-inside");
        
        // Сбрасываем текущее вращение
        wheelInside.style.transition = 'none';
        wheelInside.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        wheelInside.offsetHeight; // Форсируем reflow
        wheelInside.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
        
        // Запускаем вращение
        requestAnimationFrame(() => {
            const spins = 5 * 360; // 5 полных оборотов
            const stopAt = 270; // 7-й сектор (6 * 45 = 270 градусов)
            const finalRotation = spins + stopAt;
            wheelInside.style.transform = `translate(-50%, -50%) rotate(${finalRotation}deg)`;
        });

        // Ждем окончания анимации
        setTimeout(() => {
            showConfetti();
            showPrizeModal();

            localStorage.setItem("hasSpun", JSON.stringify({
                time: Date.now()
            }));
        }, 5200);
    });
});