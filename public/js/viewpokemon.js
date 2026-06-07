const hiddenP = document.getElementById("hiddenP");

document.addEventListener("DOMContentLoaded", async function () {
    urlParams = new URLSearchParams(window.location.search);
    let pokemonId = urlParams.get('id');

    if (pokemonId) {
        pokemonId = parseInt(pokemonId, 10).toString();
        await fetchPokemonData(Number(pokemonId));
    }
});

const typeColors = {
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

async function fetchPokemonData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const pokemonData = await response.json();

    const getAllPokemonResponse = await fetch("/api/getallpokemon");
    if (!getAllPokemonResponse.ok) {
        throw new Error('Network response was not ok');
    }
    const dataAllPokemon = await getAllPokemonResponse.json();
    const allPokemonIds = dataAllPokemon.actualIDAllPokemon;
    const allCustomIDPokemon = dataAllPokemon.allCustomIDPokemon;

    let indexOf = allPokemonIds.indexOf(id);

    const profileInfo = await fetch("/api/profileinfo");
    const profileInfoJson = await profileInfo.json();
    const buddyId = profileInfoJson.buddyId;

    if (indexOf != -1) {
        const customId = allCustomIDPokemon[allPokemonIds.indexOf(id)];

        hiddenP.textContent = customId;

        if (buddyId != customId) {
            addPokemonButton.style.display = 'block';
        }

        releasebutton.style.display = 'block';

        const customPokemon = await (await fetch('/api/customidinfo/' + customId)).json();

        displayPokemonData(pokemonData, customPokemon);
    } else {
        displayPokemonData(pokemonData);
    }
}

async function displayPokemonData(pokemonData, customData = null) {
    const type = [pokemonData.types[0].type.name];
    const typeColor = typeColors[type[0]];

    let pokemonId = customData ? customData.actualId : pokemonData.id;

    while (pokemonId.toString().length < 3) {
        pokemonId = '0' + pokemonId;
    }

    document.getElementById('vptitle').textContent = capitalize(pokemonData.name);
    document.getElementById('vpimage').src = pokemonData.sprites.other['official-artwork'].front_default;
    document.getElementById('vpnumber').textContent = `#${pokemonId}`;
    document.getElementById('vpname').textContent = customData ? capitalize(customData.name) : capitalize(pokemonData.name);
    document.getElementById('vptype').textContent = pokemonData.types.map(typeInfo => capitalize(typeInfo.type.name)).join(', ');
    document.getElementById('vpdate').textContent = customData ? new Date(customData.dateCaught).toLocaleDateString() : "N/A";
    document.getElementById('vphealth').textContent = customData ? customData.health : pokemonData.stats[0].base_stat;
    document.getElementById('vpattack').textContent = customData ? customData.attack : pokemonData.stats[1].base_stat;
    document.getElementById('vpdefence').textContent = customData ? customData.defence : pokemonData.stats[2].base_stat;
    document.getElementById('vpamountwin').textContent = customData ? customData.amountBattlesWin : "N/A";
    document.getElementById('vpamountloss').textContent = customData ? customData.amountBattlesLose : "N/A";

    document.querySelectorAll('.infopokemon section:nth-child(even)').forEach(section => {
        section.style.backgroundColor = 'lightgray';
    });
    document.querySelectorAll('.infopokemon section:nth-child(odd)').forEach(section => {
        section.style.backgroundColor = 'white';
    });
    document.querySelectorAll('.statspokemon section:nth-child(even)').forEach(section => {
        section.style.backgroundColor = 'lightgray';
    });
    document.querySelectorAll('.statspokemon section:nth-child(odd)').forEach(section => {
        section.style.backgroundColor = 'white';
    });

    document.querySelector('.viewpokemon').style.border = `10px solid ${typeColor}`;
    document.querySelector('.statspokemon').style.border = `4px solid ${typeColor}`;
    document.querySelector('.infopokemon').style.border = `4px solid ${typeColor}`;

    const movesList = document.getElementById('vpmoves');
    movesList.innerHTML = '';
    pokemonData.moves.slice(0, 4).forEach(moveInfo => {
        const moveItem = document.createElement('li');
        moveItem.textContent = moveInfo.move.name;
        movesList.appendChild(moveItem);
    });

    const evolutionSection = document.getElementById('evolutionsection');
    evolutionSection.innerHTML = '';

    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`);
    const speciesData = await speciesResponse.json();
    if (speciesData.evolution_chain) {
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        displayEvolutionLine(evolutionData.chain);
    }
}
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function displayEvolutionLine(evolutionChain) {
    const evolutionSection = document.getElementById('evolutionsection');
    if (evolutionChain) {
        let currentEvolution = evolutionChain;
        let isFirst = true;

        while (currentEvolution) {
            if (!isFirst) {
                const arrow = document.createElement('p');
                arrow.className = 'evolutionarrow';
                arrow.innerHTML = '&rarr;';
                evolutionSection.appendChild(arrow);
            }

            const article = document.createElement('article');
            const link = document.createElement('a');
            const pokemonId = getIdFromUrl(currentEvolution.species.url);
            link.href = `view?id=${pokemonId}`;

            const img = document.createElement('img');
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
            img.alt = currentEvolution.species.name;

            const section = document.createElement('section');
            const idP = document.createElement('p');
            idP.className = 'idpokemon';
            idP.textContent = `#${pokemonId}`;

            const nameP = document.createElement('p');
            nameP.className = 'namepokemon';
            nameP.textContent = currentEvolution.species.name.charAt(0).toUpperCase() + currentEvolution.species.name.slice(1);

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const evolutionPokemonData = await response.json();

            const evolutionTypeColor = typeColors[evolutionPokemonData.types[0].type.name];
            article.style.border = `10px solid ${evolutionTypeColor}`;

            section.appendChild(idP);
            section.appendChild(nameP);
            link.appendChild(img);
            link.appendChild(section);
            article.appendChild(link);
            evolutionSection.appendChild(article);

            currentEvolution = currentEvolution.evolves_to[0];
            isFirst = false;
        }
    }
}

function getIdFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}

document.getElementById('vpbackbutton').addEventListener('click', (event) => {
    event.preventDefault();
    const currentPokemonId = parseInt(urlParams.get('id'), 10);
    const previousPokemonId = currentPokemonId - 1;
    if (previousPokemonId > 0) {
        window.location.href = `view?id=${previousPokemonId}`;
    }
});

document.getElementById('vpnextbutton').addEventListener('click', (event) => {
    event.preventDefault();
    const currentPokemonId = parseInt(urlParams.get('id'), 10);
    const nextPokemonId = currentPokemonId + 1;
    if (nextPokemonId <= 1000) {
        window.location.href = `view?id=${nextPokemonId}`;
    }
});

const addPokemonButton = document.getElementById('addpokemonbutton');
const releasebutton = document.getElementById('releasebutton');

addPokemonButton.addEventListener('click', async function () {
    const vpNumber = document.getElementById('vpnumber').textContent.replace('#', '');
    if (vpNumber) {

        const id = hiddenP.textContent;

        await fetch("/api/changebuddy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ buddyId: id }),
        });

        addPokemonButton.style.display = 'none';
        updateYourPokemonSection(id);
    } else {
        alert('Geen Pokémon geselecteerd.');
    }
});

releasebutton.addEventListener('click', async (event) => {
    if (confirm("Ben je zeker dat je deze Pokémon wilt vrijlaten?")) {
        const getProfileFetch = await fetch("/api/profileinfo");
        const dataJson = await getProfileFetch.json();
        if (dataJson.buddyId == hiddenP.textContent) {
            alert("Je kan niet je buddy vrijlaten.");
            return;
        }

        const responseFetch = await fetch("/api/getallpokemon");
        const data = await responseFetch.json();
        if (data.totalCaught == 1) {
            alert("Je kan niet je laatste Pokémon vrijlaten.");
            return;
        }

        document.getElementById('addpokemonbutton').style.display = 'none';
        releasebutton.style.display = 'none';
        const id = hiddenP.textContent;
        fetch("/api/releasepokemon", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pokemonId: id })
        });
    }
});

async function getPokemonDataById(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    let type = data.types[0].type.name;
    let typeColor = typeColors[type] || '#FFFFFF';
    let health = data.stats[0].base_stat;
    let attack = data.stats[1].base_stat;
    let defense = data.stats[2].base_stat;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return { id, imageUrl, name: data.name, health, attack, defense, typeColor };
}

async function updateYourPokemonSection(buddyId) {
    const actualInfoAPI = await fetch("/api/customidinfo/" + buddyId);
    const actualInfoJsonAPI = await actualInfoAPI.json();

    const yourpokemonname = document.getElementById('yourpokemonname');
    const yourpokemonhealth = document.getElementById('yourpokemonhealth');
    const yourpokemonattack = document.getElementById('yourpokemonattack');
    const yourpokemondefence = document.getElementById('yourpokemondefence');
    const yourpokemonimage = document.getElementById('yourpokemonimage');

    yourpokemonname.textContent = actualInfoJsonAPI.name;
    yourpokemonname.style.textTransform = 'capitalize';
    yourpokemonhealth.textContent = actualInfoJsonAPI.health;
    yourpokemonattack.textContent = actualInfoJsonAPI.attack;
    yourpokemondefence.textContent = actualInfoJsonAPI.defence;

    yourpokemonimage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${actualInfoJsonAPI.actualId}.png`;

    return;
}

const removewinbutton = document.getElementById('removewinbutton');
const addwinbutton = document.getElementById('addwinbutton');
const removelossbutton = document.getElementById('removelossbutton');
const addlossbutton = document.getElementById('addlossbutton');

const vpamountwin = document.getElementById('vpamountwin');
const vpamountloss = document.getElementById('vpamountloss');

async function getPokemonStats(id) {
    return (await fetch("/api/customidinfo/" + id)).json();
}

removewinbutton.addEventListener('click', async function () {
    const id = hiddenP.textContent;

    const pokemonStatsFetch = await getPokemonStats(id);
    if (pokemonStatsFetch.amountBattlesWin == 0) {
        return alert("Je kan niet onder de 0 gaan.")
    }

    await fetch("/api/changestats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ customId: id, stat: "amountWon", plusOrMinus: "minus" })
    });

    vpamountwin.textContent = pokemonStatsFetch.amountBattlesWin - 1;
});

addwinbutton.addEventListener('click', async function () {
    const id = hiddenP.textContent;
    const pokemonStatsFetch = await getPokemonStats(id);

    await fetch("/api/changestats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ customId: id, stat: "amountWon", plusOrMinus: "plus" })
    });

    vpamountwin.textContent = pokemonStatsFetch.amountBattlesWin + 1;
});

removelossbutton.addEventListener('click', async function () {
    const id = hiddenP.textContent;

    const pokemonStatsFetch = await getPokemonStats(id);
    if (pokemonStatsFetch.amountBattlesLose == 0) {
        return alert("Je kan niet onder de 0 gaan.")
    }

    await fetch("/api/changestats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ customId: id, stat: "amountLost", plusOrMinus: "minus" })
    });

    vpamountloss.textContent = pokemonStatsFetch.amountBattlesLose - 1;
});

addlossbutton.addEventListener('click', async function () {
    const id = hiddenP.textContent;

    const pokemonStatsFetch = await getPokemonStats(id);

    await fetch("/api/changestats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ customId: id, stat: "amountLost", plusOrMinus: "plus" })
    });

    vpamountloss.textContent = pokemonStatsFetch.amountBattlesLose + 1;
});