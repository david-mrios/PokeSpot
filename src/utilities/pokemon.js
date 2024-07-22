const max_pokemon = 4;
const listDisplay = document.querySelector(".list-display");
const main = document.querySelector(".main");

let pokemons = [];

async function fetchData() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${max_pokemon}&offset=0`
    );

    const data = await response.json();
    pokemons = data.results;
    console.log(pokemons);
    displayPokemons(pokemons);
    PokemonAbilities  (pokemons);
  } catch (error) {
    console.error("error:", error);
  }
}

function PokemonAbilities(pokemon) {
  pokemon.forEach((pokemon) => {
    console.log(pokemon.url);
    fetchDataAbilities(pokemon.url);
  });
}

async function fetchDataAbilities(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("error:", error);
  }
}

fetchData();

function displayPokemons(pokemon) {
  main.innerHTML = "";

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
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
      showModal(pokemonID, pokemon.name);
    });
    main.appendChild(card);
  });
}

function showModal(id, pokemon) {
  const modal = document.getElementById("myModal");
  var btn = document.getElementById("myBtn");
  var modalText = document.getElementById("modal-text");
  // modalText.textContent = id + "and name " + pokemon;

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
