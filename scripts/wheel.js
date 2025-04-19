
let isSpinning = false;

export function spinWheel(onComplete) {
  if (isSpinning) return;

  isSpinning = true;

  const wheel = document.getElementById("wheel");

  // 5 полных оборотов + остановка на 7-м секторе (индекс 6 из 8, угол 6 * 45 = 270)
  const spins = 5 * 360;
  const stopAt = 270; // Сектор 7
  const finalRotation = spins + stopAt;

  wheel.style.transition = "transform 5s cubic-bezier(0.33, 1, 0.68, 1)";
  wheel.style.transform = `rotate(${finalRotation}deg)`;

  setTimeout(() => {
    isSpinning = false;
    if (onComplete) onComplete();
  }, 5200);
}
