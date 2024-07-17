const max_pokemon = 10;
const listDisplay = document.querySelector(".list-display");

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


