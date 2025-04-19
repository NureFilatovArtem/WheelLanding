export function hasSpunRecently() {
    const data = JSON.parse(localStorage.getItem("hasSpun"));
    if (!data || !data.time) return false;
  
    const now = Date.now();
    const diff = now - data.time;
  
    // Автоочистка после 2 минут
    if (diff >= 2 * 60 * 1000) {
      localStorage.removeItem("hasSpun");
      return false;
    }
  
    return true;
  }
  
  