// Importación de constantes y elementos del DOM desde const.js
import {
  MAX_POKEMON_COUNT,
  mainContainer,
  modalContainer,
  evolutionImage,
  favoriteContainer,
  searchInput,
  numberFilter,
  nameFilter,
  notFoundMessage,
  details,
  loaderContainer,
  modal,
} from './const.js';

// Inicialización de variables globales
let summary = document.getElementById("details-s");
let summary2 = document.getElementById("details-2");
let modal_Favorites = document.getElementById("myModal-favorites");
let pokemonList = [];
let pokemonListFavorite = [];
let currentlyOpenDetail = null;

// funciones iniciales
fetchPokemonData();
showModalWithFavorites();
checkFavorites();
fetchPokemonDataFavorite();

// Funciones para mostrar y ocultar el loader
function showLoader() {
  loaderContainer.style.display = "flex";
  loaderContainer.classList.add("loader-visible");
}

function hideLoader() {
  loaderContainer.style.display = "none";
  loaderContainer.classList.remove("loader-visible");
}

// Evento para manejar la búsqueda de Pokémon
searchInput.addEventListener("keyup", handleSearch);
notFoundMessage.style.display = "none";

// Función para obtener datos de Pokémon de la API
async function fetchPokemonData() {
  try {
    showLoader();

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON_COUNT}&offset=0`
    );
    const data = await response.json();
    pokemonList = data.results;
    let PokemonFavorite = JSON.parse(localStorage.getItem("Pokemon")) || [];

    // Simular un retraso de 2 segundos si se resuelve
    await new Promise((resolve) => setTimeout(resolve, 1000));

    displayPokemon(pokemonList, PokemonFavorite);
  } catch (error) {
    console.error("error:", error);
  } finally {
    hideLoader();
  }
}

// Función para obtener datos de Pokémon favoritos
async function fetchPokemonDataFavorite() {
  try {
    let PokemonFavorite = JSON.parse(localStorage.getItem("Pokemon")) || [];
    pokemonListFavorite = [];

    for (let pokemonID of PokemonFavorite) {
      let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonID}/`
      );
      const data = await response.json();
      pokemonListFavorite.push(data);
    }

    displayFavoritePokemon(pokemonListFavorite);
  } catch (error) {
    console.error("error:", error);
  }
}

// Función para obtener habilidades de un Pokémon
async function fetchPokemonAbilities(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    let pokemonData = {
      abilities: data.abilities,
      height: data.height,
      base_experience: data.base_experience,
      forms: data.forms,
      Spices: data.species,
      weight: data.weight,
    };

    return pokemonData;
  } catch (error) {
    console.error("error:", error);
  }
}

// Función para obtener evolución de un Pokémon
async function fetchPokemonEvolution(url) {
  try {
    const response = await fetch(url);

    const data = await response.json();
    let pokemonListEvo = data.evolution_chain;

    let speciesGenera = data.genera;
    return getSpeciesName(speciesGenera);
  } catch (error) {
    console.error("error:", error);
  }
}

// Función para obtener el nombre de la especie en español
function getSpeciesName(genera) {
  let speciesName;

  genera.forEach((language) => {
    if (language.language.name == "es") {
      speciesName = language.genus;
    }
  });
  return speciesName;
}

// Función para obtener la cadena de evolución de un Pokémon
async function getEvolutionChain(pokemonID) {
  // Fetch evolution chain from the API
  let response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonID}/`
  );
  let speciesData = await response.json();
  let evolutionUrl = speciesData.evolution_chain.url;

  let evoResponse = await fetch(evolutionUrl);
  let evoData = await evoResponse.json();

  let evolutionChain = [];
  let currentStage = evoData.chain;

  do {
    let pokemonId = currentStage.species.url.split("/")[6];
    let pokemonName = currentStage.species.name;
    evolutionChain.push([pokemonId, pokemonName]);
    // Habrá un momento en que currentStage arrojara un undefined y estará vacio
    currentStage = currentStage.evolves_to[0];
  } while (currentStage);

  return evolutionChain;
}

// Función para mostrar los Pokémon en la página principal
function displayPokemon(pokemonData, pokemonFavorite) {
  mainContainer.innerHTML = "";
  pokemonData.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    let cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.innerHTML = `
        <input
          type="checkbox"
          id="${pokemonID}"
          class="checkbox-heart"
          name="favorite-checkbox"
          value="favorite-button"
          ${pokemonFavorite.includes(pokemonID) ? "checked" : ""}
        />  
        <label for="${pokemonID}" class="containerHeart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-heart"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            ></path>
          </svg>
        </label>
          <img
            src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
            alt="${pokemon.name}"
            class="modal-btn"   
            id="${pokemonID}"
          />
        <div class="desc" id="#${pokemonID}"><br>${pokemon.name}</div>
    `;
    mainContainer.appendChild(cardElement);
  });
}

// Evento para mostrar detalles de un Pokémon al hacer clic
document.body.addEventListener("click", async (event) => {
  if (
    event.target.classList.contains("card") ||
    event.target.classList.contains("modal-btn") ||
    event.target.classList.contains("card-favorite")
  ) {
    const card = event.target.closest(".card, .card-favorite");
    const pokemonID = card.querySelector(".checkbox-heart").id;

    showLoader();

    // Obtener los datos del Pokémon 
    try {
      const pokemonCurrently = pokemonList[pokemonID - 1];
      const pokemonDetails = await fetchPokemonAbilities(pokemonCurrently.url);
      const pokemonSpecies = await fetchPokemonEvolution(
        pokemonDetails.Spices.url
      );
      const evoChain = await getEvolutionChain(pokemonID);
      let secondAbility = "";
      if (pokemonDetails.abilities[1] != undefined) {
        secondAbility = ", " + pokemonDetails.abilities[1].ability.name;
      }

      // Simular un retraso de 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showModal(
        pokemonID,
        pokemonCurrently.name,
        pokemonSpecies,
        pokemonDetails.height,
        pokemonDetails.abilities[0].ability.name,
        secondAbility,
        pokemonDetails.weight
      );
      showEvolutionModal(evoChain);
      hideFavoritesModal();
    } catch (error) {
      console.error("Error al cargar los datos del Pokémon:", error);
    } finally {
      hideLoader();
    }
  }
});

// Función para mostrar el modal con detalles del Pokémon
function showModal(
  id,
  pokemonName,
  speciesName,
  height,
  abilities1,
  abilities2,
  weight
) {
  modalContainer.innerHTML = "";
  let modalCardElement = document.createElement("div");
  modalCardElement.className = "row";
  modalCardElement.innerHTML = `
  <div class="column-modal-img">
                 <div class="desc-modal">${pokemonName}</div>
              <img
                src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id}.svg"
                alt=""
              />
            </div>
            <div class="column-modal-text">
              <h2 id="info-modal">Intelligence</h2>
              <ul class="">
                <li class="li-data">
                  <span class="info-class">Spices</span>
                  <span class="data-class">${speciesName}</span>
                  </li>
                <li class="li-data">
                  <span class="info-class">Height</span>
                  <span class="data-class">${height} m</span>
                </li>
                  <li class="li-data">
                  <span class="info-class">weight</span>
                  <span class="data-class">${weight} kg</span>
                </li>
                 <li class="li-data center">
                  <span class="info-class">Ability</span>
                </li>
                <div class="div-data">
                <span class="data-class-abilities">${abilities1}  ${abilities2} </span>                
                </div>

              </ul>
            </div>

  `;
  modalContainer.appendChild(modalCardElement);
  modal.style.display = "block";
}

// Función para mostrar la evolución del Pokémon en el modal
function showEvolutionModal(pokemonArray) {
  evolutionImage.innerHTML = "";

  pokemonArray.forEach((element) => {
    let evolutionImageElement = document.createElement("div");
    evolutionImageElement.className = "container-evo";
    evolutionImageElement.innerHTML = `
                              <img
                                src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${element[0]}.svg"
                                alt="Avatar"
                                class="image"
                              />
                              <div class="middle">
                                <div class="text">${element[1]}</div>
                              </div>
                 `;
    evolutionImage.appendChild(evolutionImageElement);
  });
}

// Funciones para cerrar modales
function closeModal() {
  var modal = document.getElementById("myModal");
  var modalFavorites = document.getElementById("myModal-favorites");
  modal.style.display = "none";

  // Si el modal de favoritos está cerrado, abrirlo si antes estaba abierto
  if (modalFavorites.style.opacity == 0) {
    modalFavorites.style.opacity = 1;
  }
}

const closeButton = document.getElementsByClassName("close")[0];
closeButton.onclick = closeModal;

window.login = function () {
  document.location.href = "/src/index.html";
}

// Función para mostrar favoritos
window.favorites= function () {
  showModalFavorites();
  fetchPokemonDataFavorite();
}

// Funciones para manejar el modal de favoritos
function showModalFavorites() {
  const modal = document.getElementById("myModal-favorites");
  modal.style.display = "block";
}

function closeFavoritesModal() {
  var modal = document.getElementById("myModal-favorites");
  modal.style.display = "none";
}

function hideFavoritesModal() {
  var modal = document.getElementById("myModal-favorites");
  modal.style.zIndex = 0;
  modal.style.opacity = 0;
}

const closeButtonFavorites =
  document.getElementsByClassName("close_favorite")[0];
closeButtonFavorites.onclick = closeFavoritesModal;

// Función de debounce para optimizar actualizaciones
// este si no mas lo copie XD
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Función para manejar la actualización de favoritos
function showModalWithFavorites() {
  // Set p
  const favoritesSet = new Set(
    JSON.parse(localStorage.getItem("Pokemon")) || []
  );

  const debouncedUpdateFavorites = debounce((id, isChecked) => {
    if (isChecked) {
      favoritesSet.add(id);
    } else {
      favoritesSet.delete(id);
    }
    localStorage.setItem("Pokemon", JSON.stringify([...favoritesSet]));
    fetchPokemonDataFavorite();
  }, 300);

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("checkbox-heart")) {
      const id = event.target.getAttribute("id");
      debouncedUpdateFavorites(id, event.target.checked);
    }
  });
}

// Función para verificar y limpiar favoritos
function checkFavorites() {
  if (localStorage.getItem("Pokemon")) {
    let favorites = JSON.parse(localStorage.getItem("Pokemon"));
    let checked = favorites.filter((favorite) => favorite != null);
    localStorage.setItem("Pokemon", JSON.stringify(checked));
  }
}

// Funciones auxiliares para manejar favoritos
function isFavoritePokemon(pokemonID, favorites) {
  return favorites.has(pokemonID);
}

function createFavoriteCardElement(pokemon, pokemonID) {
  let favoriteCardElement = document.createElement("div");
  favoriteCardElement.className = "card-favorite";
  favoriteCardElement.innerHTML = `
      <input
        type="checkbox"|
        id="${pokemonID}"
        class="checkbox-heart"
        name="favorite-checkbox"
        value="favorite-button"
      />
      <label for="${pokemonID}" class="containerHeartFav">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-heart"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          ></path>
        </svg>
      </label>
      <button class="modal-btn" id="myBtn${pokemonID}">
        <img
          src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
          alt="Cinque Terre"
          class="modal-btn"
          id="${pokemonID}"
        />
      </button>
      <div class="desc-favorite" id="#${pokemonID}">
        <br />${pokemon.name}
      </div>
  `;
  return favoriteCardElement;
}

function updateFavoriteCheckboxes(favorites) {
  const checkboxes = document.querySelectorAll(".checkbox-heart");
  checkboxes.forEach((element) => {
    element.checked = favorites.includes(element.id);
  });
}

function displayFavoritePokemon(pokemonArray) {
  favoriteContainer.innerHTML = "";
  let PokemonFavorite = JSON.parse(localStorage.getItem("Pokemon")) || [];

  pokemonArray.forEach((pokemon) => {
    const pokemonID = pokemon.id;
    let favoriteCardElement = createFavoriteCardElement(pokemon, pokemonID);
    favoriteContainer.appendChild(favoriteCardElement);
  });
  updateFavoriteCheckboxes(PokemonFavorite);
}

// Función para manejar la búsqueda de Pokémon
function handleSearch() {
  if (!pokemonList || pokemonList.length === 0) {
    console.error("pokemonList is undefined or empty:", pokemonList);
    return;
  }

  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemon = [];
  let PokemonFavorite = JSON.parse(localStorage.getItem("Pokemon")) || [];

  if (searchTerm !== "") {
    if (numberFilter.checked) {
      filteredPokemon = pokemonList.filter((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        return pokemonID === searchTerm;
      });
    } else if (nameFilter.checked) {
      filteredPokemon = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().startsWith(searchTerm)
      );
    } else {
      filteredPokemon = pokemonList;
    }

    if (filteredPokemon.length === 0) {
      notFoundMessage.style.display = "flex";
    } else {
      notFoundMessage.style.display = "none";
    }
  } else {
    filteredPokemon = pokemonList;
    notFoundMessage.style.display = "none";
  }

  mainContainer.innerHTML = ""; // Clear previous results
  displayPokemon(filteredPokemon, PokemonFavorite);
}

// Manejo de detalles abiertos
details.forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (detail.open) {
      setTargetDetail(detail);
    }
  });
});

function setTargetDetail(targetDetail) {
  if (currentlyOpenDetail === targetDetail) {
    targetDetail.open = false;
    currentlyOpenDetail = null;
  } else {
    if (currentlyOpenDetail !== null) {
      currentlyOpenDetail.open = false;
    }
    currentlyOpenDetail = targetDetail;
  }
}

// Función para navegar a la página de configuración
window.settings = function() {
  document.location.href = "/src/pages/User-Profile/profile.html";
}

// Manejo de clics en la ventana
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    if (modal_Favorites.style.opacity == 0) {
      modal_Favorites.style.opacity = 1;
    } else {
    }
  }

  if (summary && !event.target.checked) {
    if (event.target.tagName !== "LABEL") {
      summary.open = false;
    }
  }
  if (summary2 && !event.target.checked) {
    if (event.target.tagName !== "LABEL") {
      summary2.open = false;
    }
  }

  if (event.target == modal_Favorites) {
    modal_Favorites.style.display = "none";
  }
};
