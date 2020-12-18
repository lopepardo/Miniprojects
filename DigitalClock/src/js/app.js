/**
 * Inicializa el reloj y lo actualiza cada segundo usando la
 * función setInterval
 */
const initClock = () => {
  tick();
  setInterval(tick, 1000);
};

/**
 * Simula el tick del reloj
 */
const tick = () => {
  const now = getTimeNow();
  const newTime = getTimeFormat(now);
  updateClockUI(newTime);
};

/**
 * Obtiene una hora actual mediante el objeto nativo Date()
 * @returns {Array<Number>} Array de números con hora, minutos y segundos
 */
const getTimeNow = () => {
  const date = new Date();
  return [date.getHours(), date.getMinutes(), date.getSeconds()];
};

/**
 * Formatea una hora a string concatenando un 0 a números individuales
 * @param {Array<Number>} time Array de números con hora, minutos y segundos
 * @returns {Array<String>} Array de strings con hora, minutos y segundos
 */
const getTimeFormat = (time) => {
  const newTime = [];
  time[0] >= 10 ? newTime.push("" + time[0]) : newTime.push("0" + time[0]);
  time[1] >= 10 ? newTime.push("" + time[1]) : newTime.push("0" + time[1]);
  time[2] >= 10 ? newTime.push("" + time[2]) : newTime.push("0" + time[2]);
  return newTime;
};

/**
 * Muestra una hora en la interfaz
 * @param {Array<String>} time Array de strings con hora, minutos y segundos
 */
function updateClockUI(time) {
  document.querySelector(".clock__hour").textContent = time[0];
  document.querySelector(".clock__minute").textContent = time[1];
  document.querySelector(".clock__seconds").textContent = time[2];
}

/**
 * Ejecuta la función initClock cuando en contenido esta cargado completamente
 */
document.addEventListener("DOMContentLoaded", initClock);
