"use strict";
/**
 * Añade o remueve una clase a un elemento del DOM, según su ID
 * @param {String} elementID Id del elemento
 * @param {String} className Nombre de la clase
 * @returns {Function} Función anónima
 */
const toggleClass = (elementID, className) => () => {
  const elementSelect = document.getElementById(elementID);
  if (elementSelect) {
    elementSelect.classList.toggle(className);
  }
};

/**
 * Añade una evento click a un elemento del DOM, según su ID
 * @param {Funtion} functionEvent Fución manejadora del evento
 * @returns {Function} Función anonima a espera del ID de una elemento para añadir evento
 */
const addClickEvent = (functionEvent) => (elementID) => {
  const elementEvent = document.getElementById(elementID);
  if (elementEvent) {
    elementEvent.addEventListener("click", functionEvent);
  }
};

/**
 *  Crea un elemento article, para crear una tarea con un título y una descripción
 * @param {*} title Título de la tarea
 * @param {*} description Descripción de la tarea
 * @returns {HTMLElement} Elemento DOM article
 */
const createNodeArticle = (title, description) => {
  const article = document.createElement("ARTICLE");
  article.classList.add("task");
  article.innerHTML = `<h2 class="task__title">${title}</h2>
                       <p class="task__description">${description}
                       <span class="task__time">Creado: <span> ${getNowDateFormat()} </span></span>
                       </p>
                       <button id="deleteBtn" class="btn btn--warning task__btn">Eliminar</button>`;

  return article;
};

/**
 *  @returns {string} fecha actual en el formato "DD-MM-AA HH:MM:SS"
 */
const getNowDateFormat = () => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const today = new Date();
  const date =
    today.getDate() +
    "-" +
    months[today.getMonth()] +
    "-" +
    today.getFullYear();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

/**
 * Formulario para crear tareas y añadirlas a la lista de tareas
 * @param {HTMLElement} modalForm
 * @returns {void}
 */
const addEventSubmitForm = (modalForm) => {
  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let title = document.getElementById("title");
    let description = document.getElementById("description");

    if (title.value && description.value) {
      const board = document.getElementById("board");
      const articleTask = createNodeArticle(title.value, description.value);
      board.prepend(articleTask);

      const clickDeleteBtn = addClickEvent(removeParentElement);
      clickDeleteBtn("deleteBtn");

      title.value = "";
      description.value = "";

      toggleClass("modal", "show")();
    } else {
      [title, description].forEach((input) => {
        if (!input.value && !input.nextElementSibling) {
          showMessageAlert(input);
        }
      });
    }
    hasTask();
  });
};

/**
 * Añade evento input, y comprueba que no esten vacios
 */
const addEventInputAlert = () => {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  [title, description].forEach((input) => {
    input.addEventListener("input", (e) => {
      if (e.target.value === "") {
        showMessageAlert(input);
      } else {
        input.classList.remove("modal__task-input--alert");
        if (input.nextElementSibling) {
          input.nextElementSibling.remove();
        }
      }
    });
  });
};

/**
 * Muestra un mensaje de alerta en los inputs del formulario
 * @param {HTMLElement} input Elemento DOM input
 * @returns {void}
 */
const showMessageAlert = (input) => {
  input.classList.add("modal__task-input--alert");
  const messageAlert = `<span class="modal__alert">Este campo es requerido</span>`;
  input.insertAdjacentHTML("afterend", messageAlert);
};

/**
 *  Remueve el padre de un elemento en el DOM
 */
const removeParentElement = (e) => {
  const parentElement = e.target.parentElement;
  parentElement.remove();
  hasTask();
};

/**
 * Comprueba si hay tareas en la lista de tares
 */
const hasTask = () => {
  const board = document.getElementById("board");
  if (!board.childNodes.length) {
    board.innerHTML = `<div class="tasklist__message">No hay tareas pendientes</div>`;
  } else {
    const message = document.querySelector(".tasklist__message");
    if (message) {
      message.remove();
    }
  }
};

/**
 * Evento que se activa cuando todo el contenido del DOM esta cargado
 */
addEventListener("DOMContentLoaded", () => {
  hasTask();

  const toggleModal = toggleClass("modal", "show");
  const clickToggleModal = addClickEvent(toggleModal);
  clickToggleModal("addTask");
  clickToggleModal("closeModal");

  const modalForm = document.getElementById("modalForm");
  addEventSubmitForm(modalForm);

  addEventInputAlert();
});
