const max_pokemon = 10;
const listDisplay = document.querySelector(".list-display");
const main = document.querySelector(".main");
const modal_cont = document.querySelector(".data-modal");

let pokemons = [];

async function fetchData() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${max_pokemon}&offset=0`
    );

    const data = await response.json();
    pokemons = data.results;
    displayPokemons(pokemons);
  } catch (error) {
    console.error("error:", error);
  }
}

async function fetchDataAbilities(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    pokemons = {
      abilities: data.abilities,
      height: data.height,
      base_experience: data.base_experience,
      forms: data.forms,
      Spicies: data.genera
    };
console.log(pokemons.Spicies)
    return pokemons;
    // displayPokemons(pokemon)
  } catch (error) {
    console.error("error:", error);
  }
}

fetchData();

function displayPokemons(pokemon_data) {
  main.innerHTML = "";
  pokemon_data.forEach(async (pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const dataPokemon = await fetchDataAbilities(pokemon.url);

    let card = document.createElement("div");
    card.className = "responsive";
    card.innerHTML = `
            <div class="card">
             <!-- favorities -->
              <input
                type="checkbox"
                id="favorite"
                class="checkbox-heart"
                name="favorite-checkbox"
                value="favorite-button"
              />
              <label for="favorite" class="containerHeart">
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
              <button id="myBtn" class="modal-btn">
                <img
                  src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
                  alt="Cinque Terre"
                />
              </button>
              <div class="desc">${pokemon.name}</div>
            </div>
         `;
    card.addEventListener("click", () => {
      showModal(
        pokemonID,
        pokemon.name,
        dataPokemon.height,
        dataPokemon.abilities[0].ability.name
      );
    });
    main.appendChild(card);
  });
}

function showModal(id, pokemon, height, abilities) {
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
              <ul>
                <li class="li-data">
                  <span class="info-class">Spicies</span>
                  <span class="data-class">test</span>
                </li>
                <li class="li-data">
                  <span class="info-class">Height</span>
                  <span class="data-class">${height}</span>
                </li>
                <li class="li-data">
                  <span class="info-class">Ability</span>
                  <span class="data-class">${abilities}</span>
                </li>
                <li class="li-data">
                  <span class="info-class">Weakness</span>
                  <button id="btn-info"><h2>Test</h2></button>
                </li>
                <li class="li-data">
                  <span class="info-class">ability</span>
                  <span class="data-class">test</span>
                </li>
              </ul>
            </div>
  `;
  modal_cont.appendChild(modalCard);
  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none ";
}

const span = document.getElementsByClassName("close")[0];
span.onclick = closeModal;

var modal = document.getElementById("myModal");
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
