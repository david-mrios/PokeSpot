const max_pokemon = 10;
const listDisplay = document.querySelector(".list-display");
const main = document.querySelector(".main");
const modal_fav = document.querySelector(".data-modal-favorites");
const modal_cont = document.querySelector(".data-modal");
const img_evo = document.querySelector(".img-evo");
const fav = document.querySelector(".rwapped-favorite");

let list = [];
let pokemonIDlist;

let pokemons = [];

async function fetchData() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${max_pokemon}&offset=0`
    );

    const data = await response.json();
    pokemons = data.results;
    displayPokemonsFavoritos(pokemons);
    displayPokemons(pokemons);
  } catch (error) {
    console.error("error:", error);
  }
}

fetchData();

async function fetchDataAbilities(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    dATApokemons = {
      abilities: data.abilities,
      height: data.height,
      base_experience: data.base_experience,
      forms: data.forms,
      Spicies: data.species,
      weight: data.weight,
    };

    return dATApokemons;
  } catch (error) {
    console.error("error:", error);
  }
}

async function fetchDataEvolution(url) {
  try {
    const response = await fetch(url);

    const data = await response.json();
    // evoultion
    pokemons = data.evolution_chain;
    Spicies = data.genera;
    fetchDataEvolutionChain(pokemons.url);
    return SpecieName(Spicies);
  } catch (error) {
    console.error("error:", error);
  }
}

function SpecieName(genera) {
  let species;
  genera.forEach((lenguage) => {
    if (lenguage.language.name == "es") {
      species = lenguage.genus;
    }
  });
  return species;
}

async function fetchDataEvolutionChain(url) {
  try {
    const response = await fetch(url);

    const data = await response.json();
    // evoultion
    pokemons = data;
    forToEvolution(pokemons);
  } catch (error) {
    console.error("error:", error);
  }
}

function forToEvolution(pokemon) {
  let evolves_to = pokemon.chain;
  while (list.length > 0) list.pop();
  let array = recall(evolves_to);
  evolution_modal(array);
}

function recall(evo) {
  if (evo != undefined) {
    pokemonIDlist = evo.species.url.split("/")[6];
    list.push([pokemonIDlist, evo.species.name]);
    recall(evo.evolves_to[0]);
    return list;
  }
}

function displayPokemons(pokemon_data) {
  main.innerHTML = "";
  pokemon_data.forEach(async (pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    let card = document.createElement("div");
    card.className = "responsive";
    card.innerHTML = `
            <div class="card">
             <!-- favorities -->
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
                  stroke-lineca p="round"
                  stroke-linejoin="round"
                  class="feather feather-heart"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  ></path>
                </svg>
              </label>
              <button   class="modal-btn" id="myBtn${pokemonID}">
                <img
                  src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
                  alt="Cinque Terre"
                  class="modal-btn"   
                  id="${pokemonID}"
                />
              </button>
              <div class="desc" id="#${pokemonID}"><br>${pokemon.name}</div>
            </div>
         `;
    main.appendChild(card);
    let dataPokemon = await fetchDataAbilities(pokemon.url);

    actiontest(pokemon, dataPokemon);
  });
}

function showModal(
  id,
  pokemon,
  species,
  height,
  abilities1,
  abilities2,
  weight
) {
  const modal = document.getElementById("myModal");
  var btn = document.getElementById("myBtn");
  modal_cont.innerHTML = "";
  let modalCard = document.createElement("div");
  modalCard.className = "row";
  // let img = document.createElement("img");
  modalCard.innerHTML = `
  <div class="column-modal-img">
                 <div class="desc-modal">${pokemon}</div>
              <img
                src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id}.svg"
                alt=""
              />
            </div>
            <div class="column-modal-text">
              <h2 id="info-modal">Intelligence</h2>
              <ul class="">
                <li class="li-data">
                  <span class="info-class">Spicies</span>
                  <span class="data-class">${species}</span>
                  </li>
                <li class="li-data">
                  <span class="info-class">Height</span>
                  <span class="data-class">${height}</span>
                </li>
                  <li class="li-data">
                  <span class="info-class">weight</span>
                  <span class="data-class">${weight}</span>
                </li>
          
                 <li class="li-data center">
                  <span class="info-class">Ability</span>
                  
                </li>
                <div class="div-data">
                <span class="data-class-abilties">${abilities1}  ${abilities2} </span>                
                </div>

              </ul>
            </div>


  `;
  modal_cont.appendChild(modalCard);

  modal.style.display = "block";
}

function evolution_modal(pokemon) {
  img_evo.innerHTML = "";
  pokemon.forEach((element) => {
    let imgEvo = document.createElement("div");
    imgEvo.className = "container-evo";
    imgEvo.innerHTML = `

                          <img
                            src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${element[0]}.svg"
                            alt="Avatar"
                            class="image"
                          />
                          <div class="middle">
                            <div class="text">${element[1]}</div>
                          </div>
             `;
    img_evo.appendChild(imgEvo);
  });
}

function actiontest(pokemons, dataPokemon) {
  document.body.addEventListener("click", async (event) => {
    if (event.target.classList.contains("modal-btn")) {
      const pokemonID = pokemons.url.split("/")[6];
      if (event.target.id == pokemonID) {
        const species = await fetchDataEvolution(dataPokemon.Spicies.url);

        let abilities2 = "";
        if (dataPokemon.abilities[1] != undefined) {
          abilities2 = ", " + dataPokemon.abilities[1].ability.name;
        }
        showModal(
          pokemonID,
          pokemons.name,
          species,
          dataPokemon.height,
          dataPokemon.abilities[0].ability.name,
          abilities2,
          dataPokemon.weight
        );
        FavoritesDisplau();

        /////
      }
    }
  });
}

function closeModal() {
  var modal = document.getElementById("myModal");
  var modal_Favorites = document.getElementById("myModal-favorites");
  modal.style.display = "none ";

  if (modal_Favorites.style.opacity == 0) {
    modal_Favorites.style.opacity = 1;
  }
}

const span = document.getElementsByClassName("close")[0];
span.onclick = closeModal;

function login() {
  document.location.href = "pages/Register/season.html";
}

function favorites() {
  showModalFavorites();
  fetchData();
}

function showModalFavorites() {
  const modal = document.getElementById("myModal-favorites");

  modal.style.display = "block";
}

function closeModalFavorites() {
  var modal = document.getElementById("myModal-favorites");
  modal.style.display = "none";
}

function FavoritesDisplau() {
  var modal = document.getElementById("myModal-favorites");
  modal.style.zIndex = 0;
  modal.style.opacity = 0;
}

const span_Favorites = document.getElementsByClassName("close_favorite")[0];
span_Favorites.onclick = closeModalFavorites;

function favoritos_id() {
  document.body.addEventListener("click", async (event) => {
    verificarFavoritos();
    if (event.target.classList.contains("checkbox-heart")) {
      const elemento = document.getElementsByClassName("checkbox-heart");
      var cantidad = elemento.length;
      var test = [];
      for (var i = 0; i < cantidad; i++) {
        var id = elemento[i].getAttribute("id");

        if (id == event.target.id && event.target.checked) {
          if (localStorage.getItem("Pokemon")) {
            test = JSON.parse(localStorage.getItem("Pokemon"));
            test.push(id);
            localStorage.setItem("Pokemon", JSON.stringify(test));
          } else {
            test[0] = id;
            localStorage.setItem("Pokemon", JSON.stringify(test));
          }
        }
        if (id == event.target.id && !event.target.checked) {
          test = JSON.parse(localStorage.getItem("Pokemon"));
          for (let i = 0; i < test.length; i++) {
            if (test[i] == id) {
              delete test[i];
            }
          }
          localStorage.setItem("Pokemon", JSON.stringify(test));
        }
      }
    }
  });
}

favoritos_id();
verificarFavoritos();

function verificarFavoritos() {
  if (localStorage.getItem("Pokemon")) {
    var test = JSON.parse(localStorage.getItem("Pokemon"));
    let verdaderos = [];
    for (let i = 0; i < test.length; i++) {
      if (test[i] != null) {
        verdaderos.push(test[i]);
        localStorage.removeItem("Pokemon");
      }
    }
    // console.log(verdaderos);
    localStorage.setItem("Pokemon", JSON.stringify(verdaderos));
  }
}

function displayPokemonsFavoritos(pokemon_data) {
  fav.innerHTML = "";
  let test = [];
  pokemon_data.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];

    if (localStorage.getItem("Pokemon")) {
      test = JSON.parse(localStorage.getItem("Pokemon"));
      for (let i = 0; i < test.length; i++) {
        if (test[i] == pokemonID) {
          let card = document.createElement("div");
          card.className = "responsive-favorite";
          card.innerHTML = `
                     <div class="card-favorite">
                              <!-- favorities -->
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
                                  stroke-lineca
                                  p="round"
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
          fav.appendChild(card);
          const checkForElement = () => {
            const element = document.querySelectorAll(".checkbox-heart");
            if (element) {
              element.forEach((element) => {
                if (localStorage.getItem("Pokemon")) {
                  test = JSON.parse(localStorage.getItem("Pokemon"));
                  for (let i = 0; i < test.length; i++) {
                    if (test[i] == element.id) {
                      element.checked = true;
                    }
                  }
                }
              });
              clearInterval(intervalId);
            }
          };

          const intervalId = setInterval(checkForElement, 100);

          document.body.addEventListener("click", async (event) => {
            if (event.target.classList.contains("checkbox-heart")) {
              if (!event.target.checked) {
                fetchData();
              }
            }
          });
        } else {
          //
        }
      }
    }
  });
}

localStorage.removeItem("Pokemon");
const searchInput = document.querySelector("#input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found");

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = pokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = pokemons;
  }

  displayPokemons(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "flex";
  } else {
    notFoundMessage.style.display = "none";
  }
}
// Fetch all the details element.
const details = document.querySelectorAll("details");

// Add the onclick listeners.
details.forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (detail.open) setTargetDetail(detail);
  });
});

// Close all the details that are not targetDetail.
function setTargetDetail(targetDetail) {
  details.forEach((detail) => {
    if (detail !== targetDetail) {
      detail.open = false;
    }
  });
}

function settings() {
  document.location.href = "pages/User-Profile/profije.html";
}

notFoundMessage.style.display = "none";

var summary = document.getElementById("details-s");
var radio = document.getElementById("name");
var modal = document.getElementById("myModal");
var modal_Favorites = document.getElementById("myModal-favorites");

window.onclick = function (event) {
  // Handle the modal click logic
  if (event.target == modal) {
    modal.style.display = "none";
    if (modal_Favorites.style.opacity == 0) {
      modal_Favorites.style.opacity = 1;
    }
  }

  // Handle the summary open/close logic
  if (summary && !event.target.checked) {
    if (event.target.tagName !== "LABEL") {
      summary.open = false;
    }
  }

  if (event.target == modal_Favorites) {
    modal_Favorites.style.display = "none";
  }
};
