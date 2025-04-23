let isSpinning = false;

export function spinWheel(onComplete) {
  if (isSpinning) return;

  isSpinning = true;

  const wheelInside = document.querySelector(".wheel-inside");

  // 5 полных оборотов + остановка на 7-м секторе (индекс 6 из 8, угол 6 * 45 = 270)
  const spins = 5 * 360;
  const stopAt = 270; // Сектор 7
  const finalRotation = spins + stopAt;

  // Сохраняем текущее смещение translate и добавляем вращение
  wheelInside.style.transform = `translate(-50%, -50%) rotate(${finalRotation}deg)`;

  setTimeout(() => {
    isSpinning = false;
    if (onComplete) onComplete();
  }, 5200);
}
