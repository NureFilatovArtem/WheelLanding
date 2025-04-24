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
    
    // Базовые настройки конфетти
    const confettiSettings = {
        particleCount: 80,
        spread: 100,
        startVelocity: 45,
        gravity: 0.9,
        scalar: 1.2,
        ticks: 400,
        zIndex: 100,
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
    };

    // Функция для запуска конфетти из определенной точки
    function launchConfettiFrom(x, y) {
        confetti({
            ...confettiSettings,
            origin: { x, y },
            angle: 90 + (Math.random() - 0.5) * 30, // Случайный угол вверх ±15 градусов
            drift: (Math.random() - 0.5) * 2 // Случайное боковое смещение
        });
    }

    // Запускаем конфетти со всех сторон экрана
    function createConfettiWave() {
        // Нижняя часть экрана
        for (let i = 0; i < 6; i++) {
            launchConfettiFrom(i * 0.2, 1);
        }
        
        // Левая сторона
        for (let i = 1; i <= 3; i++) {
            launchConfettiFrom(0, i * 0.25);
        }
        
        // Правая сторона
        for (let i = 1; i <= 3; i++) {
            launchConfettiFrom(1, i * 0.25);
        }

        // Центральный взрыв
        confetti({
            particleCount: 150,
            spread: 360,
            startVelocity: 45,
            gravity: 0.8,
            scalar: 1.2,
            origin: { x: 0.5, y: 0.5 }
        });
    }

    // Создаем несколько волн конфетти с интервалом
    createConfettiWave();
    setTimeout(createConfettiWave, 250);
    setTimeout(createConfettiWave, 500);
}

export function showPrizeModal() {
    const modal = document.getElementById("prizeModal");
    const content = modal.querySelector(".modal-content");
    const lang = localStorage.getItem("selectedLang") || "ru";
    const t = translations[lang];

    // Обновляем тексты в модальном окне согласно выбранному языку
    modal.querySelector("h2").textContent = t.prizeTitle;
    modal.querySelector("p").textContent = t.prizeText;
    modal.querySelector("button").textContent = t.btnText;

    modal.classList.remove("hidden");
    content.classList.add("show");
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
            showPrizeModal();

            localStorage.setItem("hasSpun", JSON.stringify({
                time: Date.now()
            }));
        }, 5200);
    });
});