const max_pokemon = 20;
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
  } catch (error) {
    console.error("error:", error);
  }
}

fetchData();

function displayPokemons(pokemon) {
  main.innerHTML = "";

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const card = document.createElement("div");
    card.className = "responsive";
    card.innerHTML = `
            <div class="card">
              <button id="myBtn">
                <img
                  src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
                  alt="Cinque Terre"
                />
              </button>
              <div class="desc">${pokemon.name}</div>
            </div>
         `;
    card.addEventListener("click", () => {
      showModal();
    });
    main.appendChild(card);
  });
}

//  for test
// showModal();

function showModal() {
  const modal = document.getElementById("myModal");
  const btn = document.getElementById("myBtn");
  const modalText = document.getElementById("modal-text");
  modalText.textContent = "test";

  btn.onclick = function () {
    modal.style.display = "block";
  };
}

function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

var span = document.getElementsByClassName("close")[0];
span.onclick = closeModal;

const modal = document.getElementById("myModal");
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
