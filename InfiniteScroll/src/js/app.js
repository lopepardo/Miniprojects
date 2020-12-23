"use strict";

/**
 * Función principal que establece el limite y la página de los posts a solicitar
 * @param {Number} limit limite de posts
 * @param {Number} page numero de la página de los posts
 * @returns {Function}
 */
const loadPosts = (limit, page) => async () => {
  const posts = await getPost(limit, page);
  if (posts.length) {
    createCards(posts, page);
    const loader = document.getElementById("loader");
    loader.classList.add("show");
    page++;
  }
};
const loadPostsLimitAndPage = loadPosts(5, 1);

/**
 * Obtiene los posts de la API JSONPlaceholder mediante fetch
 * @param {Number} limit limite de posts
 * @param {Number} page numero de la página de los posts
 * @returns {Array} array de posts
 */
const getPost = async (limit, page) => {
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
    );
    return await res.json();
  } catch (err) {
    console.log(err.message);
  }
};

/**
 * Crea las cards con la información de los posts y los muestra en la UI
 * @param {Array} posts array de posts
 * @param {Number} page numero de la página de los posts
 * @returns {void}
 */
const createCards = (posts, page) => {
  let html = `<div class="posts__group-${page}">`;
  posts.forEach((post) => {
    html += `<div class="card">
                <div class="card__id">${post.id}</div>
                <h3 class="card__title">${post.title}</h3>
                <p class="card__text">${post.body}</p>
              </div>`;
  });
  html += "</div>";
  const postGroup = htmlToElement(html);
  const postContainer = document.getElementById("postContainer");
  postContainer.append(postGroup);
};

// Implementación del intersection observer API, en el loader.
// Cada vez que el loader aparecen en pantalla se genera nuevos posts en la UI
const loadIntersectionObserver = () => {
  const handleIntersection = (entries) => {
    entries.some((entry) => {
      if (entry.intersectionRatio > 0) {
        setTimeout(() => {
          loadPostsLimitAndPage();
        }, 1000);
      }
    });
  };
  const observer = new IntersectionObserver(handleIntersection);
  const loader = document.getElementById("loader");
  observer.observe(loader);
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
 * Evento que se ejecuta cuando el DOM es cargado
 * */
addEventListener("DOMContentLoaded", () => {
  loadPostsLimitAndPage();
  loadIntersectionObserver();
});
