"use strict";

/**
 * Función principal que genera el pin pad en la UI y añade los eventos a cada botón
 */
const generatePad = () => {
  const numpadContainer = document.getElementById("numpad");
  const padLayout = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "backspace",
    "0",
    "check",
  ];
  const numpad = document.createElement("DIV");
  numpad.classList.add("pin-login__numpad");
  padLayout.forEach((key) => {
    let keyContent = "";
    if (!isNaN(key)) {
      keyContent = key;
    } else {
      const iconElement = `<i class="fas fa-${key}"></i>`;
      keyContent = iconElement;
    }
    const keyElement = htmlToElement(
      `<div class="pin-login__key">${keyContent}</div>`
    );

    keyElement.addEventListener("mousedown", () => handleKeyPress(key));

    numpad.append(keyElement);
  });
  numpadContainer.prepend(numpad);
};

/**
 * Función para el evento de los botones del pin pad. Ejecuta un código diferente
 * dependiendo del argumento que se le proporcione.
 * @param {String} key Valores posibles son backspace, check o un numero
 * del 0 al 9
 * @returns {void}
 */
const handleKeyPress = (key) => {
  if (key === "backspace") {
    deleteValueInput();
  } else if (key === "check") {
    const passEntered = getValueInputs();
    attemptLogin(passEntered);
  } else {
    setValueInput(key);
  }
};

/**
 * Limpia los inputs del pin pad
 */
const deleteValueInput = () => {
  const inputs = getInputsReducer((acc, input) => {
    if (input.value !== "") {
      acc.push(input);
    }
    return acc;
  });
  inputs.forEach((input) => {
    input.value = "";
  });
  hideAlertInputs();
};

/**
 * Obtiene el valor establecido en los inputs
 * @returns {String} Valor digitado por el usuario en el pin pad
 */
const getValueInputs = () => {
  return getInputsReducer((acc, input) => {
    acc.push(input.value);
    return acc;
  }).join("");
};

/**
 * Simula la verificación, si el pin es correcto o no (Esta verificación debe
 * hacerse en el servidor realizando una petición para obtener la contraseña
 * correcta)
 * @param {String} passEntered Valor digitado por el usuario
 * @returns {void}
 */
const attemptLogin = (passEntered) => {
  setTimeout(async () => {
    const passUser = await fetch("src/js/password.json");
    const response = await passUser.json();
    if (passEntered === response.password) {
      window.location.href = "dashboard.html";
    } else {
      console.log("Acceso Denegado");
      showAlertInputs();
      setTimeout(deleteValueInput, 500);
    }
  }, 100);
};

/**
 * Establece el valor en cada uno de los inputs
 * @param {String} key Cadena de texto con numero del 0 al 9
 * @returns {void}
 */
const setValueInput = (key) => {
  const inputs = getInputsReducer((acc, input) => {
    if (input.value === "") {
      acc.push(input);
    }
    return acc;
  });
  if (inputs.length) {
    inputs[0].value = key;
  }
  hideAlertInputs();
};

/**
 * Añade la clase de alerta de cada input
 */
const showAlertInputs = () => {
  getInputsReducer((acc, input) =>
    input.classList.add("pin-login__input--error")
  );
};

/**
 * Remueve la clase de alerta de cada input
 */
const hideAlertInputs = () => {
  getInputsReducer((acc, input) =>
    input.classList.remove("pin-login__input--error")
  );
};

/**
 * Función generalizada con reduce para trabajar con los inputs del pin pad
 */
const getInputsReducer = (fn) => {
  return [...document.querySelectorAll(".pin-login__input")].reduce(fn, []);
};

/**
 * Convierte un string a un elemento HTML
 * @param {String} html String de un elemento HTML
 * @return {HTMLElement} Elemento HTML
 */
const htmlToElement = (html) => {
  const template = document.createElement("TEMPLATE");
  template.innerHTML = html.trim();
  return template.content.firstChild;
};

/**
 * Evento "DOMContentLoaded" que inicializa el pin pad
 */
document.addEventListener("DOMContentLoaded", generatePad);
