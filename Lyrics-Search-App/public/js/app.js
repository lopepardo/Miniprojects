const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

/**
 * Función asincróna que obtiene los datos de las canciones o artistas
 * mediante fecth
 *
 * @param {string} term
 */
async function getData(term) {
  const urlAPI = "https://api.lyrics.ovh";
  try {
    const res = await fetch(`${urlAPI}/suggest/${term}`);
    if (!res.ok) throw Error("Error en la solicitud");
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getMoreSongs(url) {
  try {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    if (!res.ok) throw Error("Error en la solicitud");
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function showData(lyrics) {
  result.innerHTML = `
          <ul class="songs">
              ${lyrics.data
                .map(
                  (song) => `<li>
                              <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                              <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Obtener Canción</button>
                            </li>`
                )
                .join("")}
          </ul>`;

  if (lyrics.prev || lyrics.next) {
    more.innerHTML = "";
    if (lyrics.prev) {
      const btnPrev = document.createElement("BUTTON");
      btnPrev.classList.add("btn");
      btnPrev.textContent = "Prev";
      btnPrev.addEventListener("click", () => {
        getMoreSongs(lyrics.prev).then((result) => {
          showData(result);
        });
      });
      more.append(btnPrev);
    }
    if (lyrics.next) {
      const btnNext = document.createElement("BUTTON");
      btnNext.classList.add("btn");
      btnNext.textContent = "Next";
      btnNext.addEventListener("click", () => {
        getMoreSongs(lyrics.next).then((result) => {
          showData(result);
        });
      });
      more.append(btnNext);
    }
  }
}

// Evento
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim("");
  if (!searchTerm) {
    alert("Por favor, llena el campo de búsqueda");
  } else {
    getData(searchTerm).then((result) => {
      showData(result);
    });
  }
});
