const inputpokemonpokedex = document.getElementById('inputpokemonpokedex');
const allPokemonContainer = document.querySelector('.allpokemon');
const filterpokemonsection = document.getElementById('filterpokemonsection');

filterpokemonsection.style.display = "None";

const movesColors = {
    'normal': '#A8A878',
    'fire': '#F08030',
    'water': '#6890F0',
    'grass': '#78C850',
    'ice': '#98D8D8',
    'fighting': '#C03028',
    'poison': '#A040F0',
    'ground': '#E0C068',
    'flying': '#A890F0',
    'psychic': '#F85888',
    'bug': '#A8B820',
    'rock': '#B8A038',
    'ghost': '#705898',
    'dragon': '#7038F8',
    'dark': '#705848',
    'steel': '#B8B8D0',
    'electric': '#F8D030',
    'fairy': '#EE99AC'
};

let actualIDAllPokemon = [];

async function fetchCustomPokemonIds() {
    const response = await fetch("/api/getallpokemon");
    const data = await response.json();
    actualIDAllPokemon = data.actualIDAllPokemon;
}

async function fetchPokemonDataByGeneration(generation) {

    allPokemonContainer.innerHTML = '';

    const response = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
    const data = await response.json();
    const pokemonData = [];
    pokemonData.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    for (const pokemon of data.pokemon_species) {
        let id = pokemon.url.split('/').slice(-2, -1)[0];
        let pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        const pokemonContainer = document.createElement('article');
        pokemonContainer.classList.add('pokemoncontainer');

        pokemonContainer.innerHTML = `
                <a href="view?id=${id}">
                    <img src="${imageUrl}" alt="pokemonimage">
                    <h3>${id}. ${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h3>
                </a>`;

        if (actualIDAllPokemon.includes(parseInt(id))) {
            pokemonContainer.style.backgroundColor = '#c0eb78';
        }

        allPokemonContainer.appendChild(pokemonContainer);

    }
    return pokemonData;
}

async function fetchPokemonByInput(input) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    const data = await response.json();
    const filteredPokemon = data.results.filter(pokemon => pokemon.name.includes(input.toLowerCase()));

    const detailedPokemonData = await Promise.all(filteredPokemon.map(async pokemon => {
        const detailedResponse = await fetch(pokemon.url);
        const data = await detailedResponse.json();
        return {
            id: data.id,
            name: data.name,
            imageUrl: data.sprites.other['official-artwork'].front_default,
        };
    }));

    return detailedPokemonData;
}

async function fetchAllPokemon() {
    allPokemonContainer.innerHTML = '';

    try {
        const pokemonJsons = [];

        for (let index = 1; index < 9; index++) {
            const response = await fetch(`https://pokeapi.co/api/v2/generation/${index}`);
            const data = await response.json();

            for (const pokemon of data.pokemon_species) {
                let id = pokemon.url.split('/').slice(-2, -1)[0];
                let pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
                pokemonJsons.push({ id, name: pokemonName, imageUrl });
            }
        }

        pokemonJsons.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        pokemonJsons.forEach(pokemon => {
            const pokemonContainer = document.createElement('article');
            pokemonContainer.classList.add('pokemoncontainer');

            pokemonContainer.innerHTML = `
                <a href="view?id=${pokemon.id}">
                    <img src="${pokemon.imageUrl}" alt="pokemonimage">
                    <h3>${pokemon.id}. ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                </a>`;

            if (actualIDAllPokemon.includes(parseInt(pokemon.id))) {
                pokemonContainer.style.backgroundColor = '#c0eb78';
            }

            allPokemonContainer.appendChild(pokemonContainer);
        });
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
    filterpokemonsection.style.display = "flex";
}

document.getElementById('selectgeneration').addEventListener('change', async (event) => {
    if (event.target.value == "*") {
        await fetchAllPokemon();
    } else {
        const selectedGeneration = event.target.value;
        const pokemonData = await fetchPokemonDataByGeneration(selectedGeneration);

        pokemonData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    }
});

inputpokemonpokedex.addEventListener('input', async (event) => {
    const inputText = event.target.value;
    const allPokemonData = await fetchPokemonByInput(inputText);

    allPokemonContainer.innerHTML = '';

    allPokemonData.forEach(pokemon => {
        const pokemonContainer = document.createElement('article');
        pokemonContainer.classList.add('pokemoncontainer');
        pokemonContainer.innerHTML = `
            <a href="view?id=${pokemon.id}">
                <img src="${pokemon.imageUrl}" alt="pokemonimage">
                <h3>${pokemon.id}. ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            </a>`;

        if (actualIDAllPokemon.includes(pokemon.id)) {
            pokemonContainer.style.backgroundColor = '#c0eb78';
        }

        allPokemonContainer.appendChild(pokemonContainer);
    });
});

const inputcheckbox = document.getElementById("viewAll");
inputcheckbox.addEventListener('change', async (event) => {
    allPokemonContainer.innerHTML = '';

    if (event.target.checked) {
        await fetchAllPokemon();
    } else {
        await fetchAllYourPokemon();
    }
});

async function fetchAllYourPokemon() {
    allPokemonContainer.innerHTML = '';

    const response = await fetch("/api/getallpokemon");
    const data = await response.json();
    const custompokemonid = data.allCustomIDPokemon;

    const allcustompokemon = await fetch("/api/getallcustompokemon");
    const allcustompokemonJson = await allcustompokemon.json();

    let pokemonArray = []

    for (let i = 0; i < allcustompokemonJson.length; i++) {
        if (custompokemonid.includes(allcustompokemonJson[i].customId)) {
            pokemonArray.push(allcustompokemonJson[i]);
        }
    }

    try {
        const pokemonJsons = [];

        for (let index = 0; index < pokemonArray.length; index++) {
            id = parseInt(pokemonArray[index].actualPokemonId);
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            let pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            pokemonJsons.push({ id, name: pokemonName, imageUrl });
        }

        pokemonJsons.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        pokemonJsons.forEach(pokemon => {
            const pokemonContainer = document.createElement('article');
            pokemonContainer.classList.add('pokemoncontainer');
            pokemonContainer.innerHTML = `
                <a href="view?id=${pokemon.id}">
                    <img src="${pokemon.imageUrl}" alt="pokemonimage">
                    <h3>${pokemon.id}. ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                </a>`;
            pokemonContainer.style.backgroundColor = '#c0eb78';

            allPokemonContainer.appendChild(pokemonContainer);
        });
    } catch (error) {
        console.error("Error fetching Pokémon data by generation:", error);
    }
}

// domcontentloaded event
document.addEventListener('DOMContentLoaded', async () => {
    await fetchCustomPokemonIds();
    await fetchAllPokemon();
});
