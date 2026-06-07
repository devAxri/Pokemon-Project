const userInput = document.getElementById('inputpokemonbattleruser');
const aiInput = document.getElementById('inputpokemonbattlerai');
const hiddenP = document.getElementById('hiddenP');

const battlerlogtext = document.getElementById('battlerlogtext');
const typeIcons = {
    'normal': './assets/icon/svgtopng/normal.png',
    'fire': './assets/icon/svgtopng/fire.png',
    'water': './assets/icon/svgtopng/water.png',
    'grass': './assets/icon/svgtopng/grass.png',
    'ice': './assets/icon/svgtopng/ice.png',
    'fighting': './assets/icon/svgtopng/fighting.png',
    'poison': './assets/icon/svgtopng/poison.png',
    'ground': './assets/icon/svgtopng/ground.png',
    'flying': './assets/icon/svgtopng/flying.png',
    'psychic': './assets/icon/svgtopng/psychic.png',
    'bug': './assets/icon/svgtopng/bug.png',
    'rock': './assets/icon/svgtopng/rock.png',
    'ghost': './assets/icon/svgtopng/ghost.png',
    'dragon': './assets/icon/svgtopng/dragon.png',
    'dark': './assets/icon/svgtopng/dark.png',
    'steel': './assets/icon/svgtopng/steel.png',
    'electric': './assets/icon/svgtopng/electric.png',
    'fairy': './assets/icon/svgtopng/fairy.png'
}
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

async function populateAutocomplete(input, autocompleteContainer) {
    const inputValue = input.value.toLowerCase();
    autocompleteContainer.innerHTML = '';
    autocompleteContainer.style.backgroundColor = 'white';
    autocompleteContainer.style.display = 'flex';
    autocompleteContainer.style.flexDirection = 'column';
    autocompleteContainer.style.flexwrap = 'wrap';
    autocompleteContainer.style.width = '410px';
    autocompleteContainer.style.zIndex = '1';
    autocompleteContainer.style.position = 'absolute';
    autocompleteContainer.style.height = 'auto';
    autocompleteContainer.style.border = 'solid black 1px';
    autocompleteContainer.style.borderRadius = '15px';
    autocompleteContainer.style.boxShadow = '0px 8px 16px 0px rgba(0, 0, 0, 0.2)';

    if (inputValue.length === 0) {
        autocompleteContainer.style.display = 'none';
        return;
    }

    const getallpokemon = await fetch("/api/getallpokemon");
    const dataallpokemon = await getallpokemon.json();
    const allpokemonid = dataallpokemon.allCustomIDPokemon;

    const allcustompokemon = await fetch("/api/getallcustompokemon");
    const allcustompokemonJson = await allcustompokemon.json();

    let pokemonArray = []

    for (let i = 0; i < allcustompokemonJson.length; i++) {

        if (allpokemonid.includes(allcustompokemonJson[i].customId)) {
            pokemonArray.push(allcustompokemonJson[i]);
        }
    }

    autocompleteContainer.innerHTML = '';
    pokemonArray.forEach(name => {
        if (name.name.includes("-")) return;

        if (!name.name.startsWith(inputValue)) return;


        const option = document.createElement('option');
        option.textContent = name.name;
        option.classList.add('autocomplete-option');
        option.style.backgroundColor = 'white';
        option.style.padding = '5px';
        option.style.borderBottom = 'solid black 1px';
        option.style.fontSize = '25px';
        option.style.textTransform = 'capitalize';
        option.addEventListener('click', async function () {
            const pokemonimageyp = document.getElementById('innerpokemondisplayuser');

            const namepokemonuser = document.getElementById('battlernamepokemonuser');
            const yourpokemonmaxhealth = document.getElementById('maxhealthuser');
            const yourpokemoncurrenthealth = document.getElementById('currenthealthuser');
            const yourpokemonattack = document.getElementById('battlerattackpokemonuser');
            const yourpokemondefence = document.getElementById('battlerdefensepokemonuser');
            const typeicon1user = document.getElementById('typeicon1user');
            const typeicon2user = document.getElementById('typeicon2user');
            input.value = name.name;
            autocompleteContainer.innerHTML = '';
            autocompleteContainer.style.display = 'none';

            pokemonArray.forEach(async nametwo => {
                if (nametwo == name) {
                    console.log(nametwo);
                    const actualId = nametwo.actualPokemonId;
                    document.getElementById('viewlink').href = 'view?id=' + actualId;
                    const pokeAPIInformation = await fetch(`https://pokeapi.co/api/v2/pokemon/${actualId}`);
                    const pokeAPIInformationJson = await pokeAPIInformation.json();

                    namepokemonuser.textContent = nametwo.name.charAt(0).toUpperCase() + nametwo.name.slice(1);
                    let type1user = pokeAPIInformationJson.types[0].type.name.toString();
                    let type2user = pokeAPIInformationJson.types[1] ? pokeAPIInformationJson.types[1].type.name : '';

                    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${actualId}.png`;

                    const type1Color = movesColors[type1user] || 'rgb  (0, 0, 0, 0)';
                    const type2Color = movesColors[type2user] || 'rgb  (0, 0, 0, 0)';

                    for (let i = 0; i < 4; i++) {
                        const moveName = pokeAPIInformationJson.moves[i].move.name;
                        const moveTypeResponse = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
                        const moveTypeData = await moveTypeResponse.json();

                        const moveType = moveTypeData.type.name;
                        const movetypename = document.getElementById(`battlermovetype${i + 1}user`);
                        movetypename.textContent = moveType;
                        const moveColor = movesColors[moveType] || 'rgb(0, 0, 0, 0)';
                        const moveElement = document.getElementsByClassName(`battlermove${i + 1}user`)[0];
                        moveElement.textContent = moveName;
                        moveElement.style.backgroundColor = moveColor;

                        const movePower = moveTypeData.power !== null ? moveTypeData.power : 30;
                        const movePP = moveTypeData.pp !== null ? moveTypeData.pp : 20;

                        const moveppuser = document.getElementById(`battlermove${i + 1}ppuser`);
                        moveppuser.textContent = movePP;
                        const moveTotalppuser = document.getElementById(`battlermove${i + 1}totalppuser`);
                        moveTotalppuser.textContent = movePP;

                        const movepoweruser = document.getElementById(`battlermove${i + 1}poweruser`);
                        movepoweruser.textContent = movePower;
                    }

                    pokemonimageyp.src = imageUrl;

                    hiddenP.textContent = nametwo.customId;

                    yourpokemonmaxhealth.textContent = nametwo.health;
                    yourpokemoncurrenthealth.textContent = nametwo.health;
                    yourpokemonattack.textContent = nametwo.attack;
                    yourpokemondefence.textContent = nametwo.defence;

                    typeicon1user.src = typeIcons[type1user];
                    typeicon1user.style.backgroundColor = type1Color;
                    typeicon2user.src = typeIcons[type2user];
                    typeicon2user.style.backgroundColor = type2Color;
                    battlerlogtext.textContent = "ik kies jou!: " + nametwo.name;

                    if (type2user) {
                        typeicon2user.style.display = 'inline-block';
                    } else {
                        typeicon2user.style.display = 'none';
                    }
                }
            });
        });
        option.addEventListener('mouseover', function () {
            this.style.backgroundColor = 'rgb(255, 215, 215)';
        });
        option.addEventListener('mouseout', function () {
            this.style.backgroundColor = 'white';
        });
        autocompleteContainer.appendChild(option);
    });
}

async function populateAutoCompleteAI(input, autocompleteContainer) {
    const inputValue = input.value.toLowerCase();
    autocompleteContainer.innerHTML = '';
    autocompleteContainer.style.backgroundColor = 'white';
    autocompleteContainer.style.display = 'flex';
    autocompleteContainer.style.flexDirection = 'column';
    autocompleteContainer.style.flexWrap = 'wrap';
    autocompleteContainer.style.width = '410px';
    autocompleteContainer.style.zIndex = '1';
    autocompleteContainer.style.position = 'absolute';
    autocompleteContainer.style.height = 'auto';
    autocompleteContainer.style.border = 'solid black 1px';
    autocompleteContainer.style.borderRadius = '15px';
    autocompleteContainer.style.boxShadow = '0px 8px 16px 0px rgba(0, 0, 0, 0.2)';

    if (inputValue.length === 0) {
        autocompleteContainer.style.display = 'none';
        return;
    }

    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = await response.json();
    const pokemonArray = data.results;

    autocompleteContainer.innerHTML = '';
    pokemonArray.forEach(pokemon => {
        if (pokemon.name.includes("-")) return;
        if (!pokemon.name.startsWith(inputValue)) return;

        const option = document.createElement('option');
        option.textContent = pokemon.name;
        option.classList.add('autocomplete-option');
        option.style.backgroundColor = 'white';
        option.style.padding = '5px';
        option.style.borderBottom = 'solid black 1px';
        option.style.fontSize = '25px';
        option.style.textTransform = 'capitalize';
        option.addEventListener('click', async function () {
            const pokemonimageai = document.getElementById('innerpokemondisplayai');

            const namepokemonai = document.getElementById('battlernamepokemonai');
            const aipokemonmaxhealth = document.getElementById('maxhealthai');
            const aipokemoncurrenthealth = document.getElementById('currenthealthai');
            const aipokemonattack = document.getElementById('battlerattackpokemonai');
            const aipokemondefence = document.getElementById('battlerdefensepokemonai');
            const typeicon1ai = document.getElementById('typeicon1ai');
            const typeicon2ai = document.getElementById('typeicon2ai');
            input.value = pokemon.name;
            autocompleteContainer.innerHTML = '';
            autocompleteContainer.style.display = 'none';

            const pokeAPIInformation = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            const pokeAPIInformationJson = await pokeAPIInformation.json();

            namepokemonai.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            let type1ai = pokeAPIInformationJson.types[0].type.name.toString();
            let type2ai = pokeAPIInformationJson.types[1] ? pokeAPIInformationJson.types[1].type.name : '';

            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeAPIInformationJson.id}.png`;

            const type1Color = movesColors[type1ai] || 'rgb(0, 0, 0, 0)';
            const type2Color = movesColors[type2ai] || 'rgb(0, 0, 0, 0)';

            for (let i = 0; i < 4; i++) {
                const moveName = pokeAPIInformationJson.moves[i].move.name;
                const moveTypeResponse = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
                const moveTypeData = await moveTypeResponse.json();

                const moveType = moveTypeData.type.name;
                const movetypename = document.getElementById(`battlermovetype${i + 1}ai`);
                movetypename.textContent = moveType;
                const moveColor = movesColors[moveType] || 'rgb(0, 0, 0, 0)';
                const moveElement = document.getElementsByClassName(`battlermove${i + 1}ai`)[0];
                moveElement.textContent = moveName;
                moveElement.style.backgroundColor = moveColor;

                const movePower = moveTypeData.power !== null ? moveTypeData.power : 30;
                const movePP = moveTypeData.pp !== null ? moveTypeData.pp : 20;

                const moveppai = document.getElementById(`battlermove${i + 1}ppai`);
                moveppai.textContent = movePP;
                const moveTotalppai = document.getElementById(`battlermove${i + 1}totalppai`);
                moveTotalppai.textContent = movePP;

                const movepowerai = document.getElementById(`battlermove${i + 1}powerai`);
                movepowerai.textContent = movePower;
            }

            pokemonimageai.src = imageUrl;
            aipokemonmaxhealth.textContent = pokeAPIInformationJson.stats[0].base_stat;
            aipokemoncurrenthealth.textContent = pokeAPIInformationJson.stats[0].base_stat;
            aipokemonattack.textContent = pokeAPIInformationJson.stats[1].base_stat;
            aipokemondefence.textContent = pokeAPIInformationJson.stats[2].base_stat;

            typeicon1ai.src = typeIcons[type1ai];
            typeicon1ai.style.backgroundColor = type1Color;
            if (type2ai) {
                typeicon2ai.src = typeIcons[type2ai];
                typeicon2ai.style.backgroundColor = type2Color;
            }

        });
        option.addEventListener('mouseover', function () {
            this.style.backgroundColor = 'rgb(255, 215, 215)';
        });
        option.addEventListener('mouseout', function () {
            this.style.backgroundColor = 'white';
        });
        autocompleteContainer.appendChild(option);
    });
}

userInput.addEventListener('input', function () {
    const autocompleteContainer = document.getElementById('autocomplete-container-user');
    populateAutocomplete(userInput, autocompleteContainer);
});

aiInput.addEventListener('input', function () {
    const autocompleteContainer = document.getElementById('autocomplete-container-ai');
    populateAutoCompleteAI(aiInput, autocompleteContainer);
});