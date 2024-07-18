const max_pokemon = 1;
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
    // displayPokemons(pokemons);
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
              <a target="_blank" href="#">
                <img
                  src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
                  alt="Cinque Terre"
                />
              </a>
              <div class="desc">${pokemon.name}</div>
            </div>
     `;
    main.appendChild(card);
  });
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
