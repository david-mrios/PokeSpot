const MAX_POKEMON_COUNT = 649;
const listDisplay = document.querySelector(".list-display");
const mainContainer = document.querySelector(".main");
const modalContainer = document.querySelector(".data-modal");
const evolutionImage = document.querySelector(".img-evo");
const favoriteContainer = document.querySelector(".wrapped-favorite");
const searchInput = document.querySelector("#input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found");
var summary = document.getElementById("details-s");
var summary2 = document.getElementById("details-2");
var radio = document.getElementById("name");
var modal = document.getElementById("myModal");
var modal_Favorites = document.getElementById("myModal-favorites");
const details = document.querySelectorAll("details");

const evolutionList = [];
let currentPokemonIDList;
let pokemonList = [];
let currentlyOpenDetail = null;

fetchPokemonData();
showModalWithFavorites();
checkFavorites();
searchInput.addEventListener("keyup", handleSearch);
notFoundMessage.style.display = "none";

async function fetchPokemonData() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON_COUNT}&offset=0`
    );

    const data = await response.json();
    pokemonList = data.results;
    let pokemonEvo = [];

    mainContainer.innerHTML = "";
    let PokemonFavorite = JSON.parse(localStorage.getItem("Pokemon")) || [];
    updateFavoriteCheckboxes(PokemonFavorite);
    for (const pokemon of pokemonList) {
      displayPokemon(pokemon);
      const pokemonID = pokemon.url.split("/")[6];
      const pokemonDetails = await fetchPokemonAbilities(pokemon.url);
      pokemon.details = pokemonDetails;
      pokemon.speciesName = await fetchPokemonEvolution(
        pokemonDetails.Spices.url
      );
      const evolutionChain = await getEvolutionChain(pokemonID);
      pokemonEvo.push(evolutionChain);
      handlePokemon(pokemon, pokemonEvo);
    }

    displayFavoritePokemon(pokemonList);
  } catch (error) {
    console.error("error:", error);
  }
}

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

function getSpeciesName(genera) {
  let speciesName;

  genera.forEach((language) => {
    if (language.language.name == "es") {
      speciesName = language.genus;
    }
  });
  return speciesName;
}

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
    currentStage = currentStage.evolves_to[0];
  } while (currentStage);

  return evolutionChain;
}
function displayPokemon(pokemonData) {
  if (!Array.isArray(pokemonData)) {
    pokemonData = [pokemonData];
  }

  pokemonData.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    let cardElement = document.createElement("div");
    cardElement.className = "responsive";
    cardElement.innerHTML = `
      <div class="card">
        <input
          type="checkbox"
          id="${pokemonID}"
          class="checkbox-heart"
          name="favorite-checkbox"
          value="favorite-button"
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
        <button class="modal-btn" id="myBtn${pokemonID}">
          <img
            src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
            alt="${pokemon.name}"
            class="modal-btn"   
            id="${pokemonID}"
          />
        </button>
        <div class="desc" id="#${pokemonID}"><br>${pokemon.name}</div>
      </div>
    `;
    mainContainer.appendChild(cardElement);
  });
}

async function handlePokemon(pokemonList, evoChain) {
  document.body.addEventListener("click", async (event) => {
    if (event.target.classList.contains("modal-btn")) {
      const pokemonID = pokemonList.url.split("/")[6];
      if (pokemonID == event.target.id) {
        if (pokemonList) {
          const pokemonAbilitiesData = pokemonList.details;
          const speciesName = pokemonList.speciesName;
          let secondAbility = "";
          if (pokemonAbilitiesData.abilities[1] != undefined) {
            secondAbility =
              ", " + pokemonAbilitiesData.abilities[1].ability.name;
          }

          showModal(
            pokemonList.url.split("/")[6],
            pokemonList.name,
            speciesName,
            pokemonAbilitiesData.height,
            pokemonAbilitiesData.abilities[0].ability.name,
            secondAbility,
            pokemonAbilitiesData.weight
          );
          showEvolutionModal(evoChain[event.target.id - 1]);
          hideFavoritesModal();
        }
      }
    }
  });
}

function showModal(
  id,
  pokemonName,
  speciesName,
  height,
  abilities1,
  abilities2,
  weight
) {
  const modal = document.getElementById("myModal");
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

function closeModal() {
  var modal = document.getElementById("myModal");
  var modalFavorites = document.getElementById("myModal-favorites");
  modal.style.display = "none";

  if (modalFavorites.style.opacity == 0) {
    modalFavorites.style.opacity = 1;
  }
}

const closeButton = document.getElementsByClassName("close")[0];
closeButton.onclick = closeModal;

function login() {
  document.location.href = "/src/index.html";
}

function favorites() {
  showModalFavorites();
  displayFavoritePokemon(pokemonList);
}

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

function showModalWithFavorites() {
  document.body.addEventListener("click", async (event) => {
    checkFavorites();
    if (event.target.classList.contains("checkbox-heart")) {
      const checkboxHeart = document.getElementsByClassName("checkbox-heart");
      var quantity = checkboxHeart.length;
      var PokemonFavorite = [];
      for (var i = 0; i < quantity; i++) {
        var id = checkboxHeart[i].getAttribute("id");

        if (id == event.target.id && event.target.checked) {
          if (localStorage.getItem("Pokemon")) {
            PokemonFavorite = JSON.parse(localStorage.getItem("Pokemon"));
            PokemonFavorite.push(id);
            localStorage.setItem("Pokemon", JSON.stringify(PokemonFavorite));
          } else {
            PokemonFavorite[0] = id;
            localStorage.setItem("Pokemon", JSON.stringify(PokemonFavorite));
          }
        }
        if (id == event.target.id && !event.target.checked) {
          PokemonFavorite = JSON.parse(localStorage.getItem("Pokemon"));
          for (let i = 0; i < PokemonFavorite.length; i++) {
            if (PokemonFavorite[i] == id) {
              delete PokemonFavorite[i];
            }
          }
          localStorage.setItem("Pokemon", JSON.stringify(PokemonFavorite));
        }
      }
    }
  });
}

function checkFavorites() {
  if (localStorage.getItem("Pokemon")) {
    var favorites = JSON.parse(localStorage.getItem("Pokemon"));
    let checked = [];
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i] != null) {
        checked.push(favorites[i]);
        localStorage.removeItem("Pokemon");
      }
    }
    localStorage.setItem("Pokemon", JSON.stringify(checked));
  }
}

function isFavoritePokemon(pokemonID, favorites) {
  return favorites.includes(pokemonID);
}

function createFavoriteCardElement(pokemon, pokemonID) {
  let favoriteCardElement = document.createElement("div");
  favoriteCardElement.className = "responsive-favorite";
  favoriteCardElement.innerHTML = `
    <div class="card-favorite">
      <input
        type="checkbox"
        id="${pokemonID}"
        class="checkbox-heart"
        name="favorite-checkbox"
        value="favorite-button"
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
    </div>
  `;
  return favoriteCardElement;
}

function updateFavoriteCheckboxes(favorites) {
  const checkForElement = () => {
    const checkbox = document.querySelectorAll(".checkbox-heart");
    if (checkbox) {
      checkbox.forEach((element) => {
        if (isFavoritePokemon(element.id, favorites)) {
          element.checked = true;
        }
      });
      clearInterval(intervalId);
    }
  };
  const intervalId = setInterval(checkForElement, 100);
}

function handleFavoriteCheckboxClick(pokemonList) {
  document.body.addEventListener("click", async (event) => {
    if (event.target.classList.contains("checkbox-heart")) {
      if (!event.target.checked) {
        displayFavoritePokemon(pokemonList);
      }
    }
  });
}

function displayFavoritePokemon(pokemonArray) {
  favoriteContainer.innerHTML = "";
  let PokemonFavorite = JSON.parse(localStorage.getItem("Pokemon")) || [];

  pokemonArray.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    if (isFavoritePokemon(pokemonID, PokemonFavorite)) {
      let favoriteCardElement = createFavoriteCardElement(pokemon, pokemonID);
      favoriteContainer.appendChild(favoriteCardElement);
    }
  });

  updateFavoriteCheckboxes(PokemonFavorite);
  handleFavoriteCheckboxClick(pokemonArray);
}
function handleSearch() {
  if (!pokemonList || pokemonList.length === 0) {
    console.error("pokemonList is undefined or empty:", pokemonList);
    return;
  }

  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemon = [];
  const main = document.getElementById("main");
  let style = "repeat(auto-fit, minmax(300px, 1fr))"; 

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
      style = "repeat(auto-fit, minmax(300px, 0fr))"; 
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
  displayPokemon(filteredPokemon);
  main.style.gridTemplateColumns = style;
}

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

function settings() {
  document.location.href = "/src/pages/User-Profile/profile.html";
}

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
