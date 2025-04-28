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

    // Локализация для "Пусто"
    const emptyText = {
        ru: 'Пусто',
        ua: 'Порожньо',
        by: 'Пуста',
        kz: 'Бос'
    }[lang] || 'Пусто';

    // Обновляем тексты в модальном окне согласно выбранному языку
    modal.querySelector("h2").textContent = t.prizeTitle;
    modal.querySelector("p").textContent = t.prizeText;
    modal.querySelector("#closeModal").textContent = t.btnText;

    // Скрываем кнопку "Забрать" изначально
    modal.querySelector("#closeModal").classList.add("hidden");

    // Обработчики для билетов
    const tickets = modal.querySelectorAll(".ticket");
    tickets.forEach((ticket, idx) => {
        ticket.onclick = () => {
            // Очищаем предыдущие выигрыши, если они были
            tickets.forEach(t => {
                const reward = t.querySelector('.ticket-reward');
                reward.innerHTML = '';
            });

            // Показываем все билеты как выбранные
            tickets.forEach(t => {
                t.classList.add("selected");
            });

            // Устанавливаем выигрыш на выбранном билете
            const selectedReward = ticket.querySelector('.ticket-reward');
            selectedReward.innerHTML = '<span class="bonus-main">150</span> <span class="bonus-sub">FREE SPINS</span>';

            // Показываем "Пусто" на остальных билетах
            tickets.forEach((t, i) => {
                if (t !== ticket) {
                    const reward = t.querySelector('.ticket-reward');
                    reward.innerHTML = `<small>${emptyText}</small>`;
                }
            });

            // Показываем кнопку "Забрать" после выбора билета
            setTimeout(() => {
                modal.querySelector("#closeModal").classList.remove("hidden");
            }, 1000);
        };
    });

    // Обработчик для крестика-кнопки закрытия
    const closeButton = modal.querySelector(".close-button");
    closeButton.onclick = () => {
        modal.classList.add("hidden");
    };

    modal.classList.remove("hidden");
    content.classList.add("show");
    showConfetti();
}

// Предотвращаем закрытие модального окна при клике вне контента
document.addEventListener("click", (event) => {
    const modal = document.getElementById("prizeModal");
    const modalContent = modal.querySelector(".modal-content");
  
    if (!modal.classList.contains("hidden") && !modalContent.contains(event.target)) {
        event.stopPropagation(); // Предотвращаем закрытие
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Скрываем модалку при загрузке страницы на всякий случай
    const modal = document.getElementById("prizeModal");
    if (modal) modal.classList.add("hidden");

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