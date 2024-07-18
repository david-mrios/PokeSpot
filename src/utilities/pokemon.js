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
              <a target="_blank" href="#">
                <img
                  src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
                  alt="Cinque Terre"
                  width="600"
                  height="400"
                />
              </a>
              <div class="desc">${pokemon.name}</div>
            </div>
     `;
    main.appendChild(card);
  });
}
