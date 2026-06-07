document.addEventListener('DOMContentLoaded', async function () {
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

    const hiddenP = document.getElementById('hiddenP');

    const pokemoninputai = document.getElementById('inputpokemonbattlerai');
    const pokemonimageai = document.getElementById('innerpokemondisplayai');
    const trainerimageai = document.getElementById('trainerdisplayai');
    const pokemonidai = document.getElementById('battleridpokemonai');
    const pokemonnameai = document.getElementsByClassName('battlernamepokemonai')[0];
    const typeicon1ai = document.getElementById('typeicon1ai');
    const typeicon2ai = document.getElementById('typeicon2ai');
    const pokemonmove1ai = document.getElementsByClassName('battlermove1ai')[0];
    const pokemonmove2ai = document.getElementsByClassName('battlermove2ai')[0];
    const pokemonmove3ai = document.getElementsByClassName('battlermove3ai')[0];
    const pokemonmove4ai = document.getElementsByClassName('battlermove4ai')[0];
    const pokemonattackai = document.getElementsByClassName('battlerattackpokemonai')[0];
    const pokemondefenseai = document.getElementsByClassName('battlerdefensepokemonai')[0];
    const pokemonmaxhealthai = document.getElementsByClassName('maxhealthai')[0];
    const pokemoncurrenthealthai = document.getElementsByClassName('currenthealthai')[0];
    const pokemonbattlerlogtext = document.getElementsByClassName('battlerlogtext')[0];

    let type1ai, type2ai, move1ai, move2ai, move3ai, move4ai, healthai, attackai, defenceai = "";
    async function getPokemonDataByInputAi(name) {
        const getAllPokemonResponse = await fetch("/api/getallpokemon");
        const dataAllPokemon = await getAllPokemonResponse.json();
        const allPokemonIds = dataAllPokemon.actualIDAllPokemon;

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();

        let id = data.id.toString();

        if (!allPokemonIds.includes(id)) {
            type1ai = data.types[0].type.name.toString();
            type2ai = data.types[1] ? data.types[1].type.name : '';

            healthai = data.stats[0].base_stat;
            attackai = data.stats[1].base_stat;
            defenceai = data.stats[2].base_stat;

            move1ai = data.moves[0].move.name;
            move2ai = data.moves[1].move.name;
            move3ai = data.moves[2].move.name;
            move4ai = data.moves[3].move.name;

            for (let i = 0; i < 4; i++) {
                const moveName = data.moves[i].move.name;
                const moveTypeResponse = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
                const moveTypeData = await moveTypeResponse.json();
                const moveType = moveTypeData.type.name;
                const moveColor = movesColors[moveType] || 'rgb(0, 0, 0, 0)';
                const moveElement = document.getElementsByClassName(`battlermove${i + 1}ai`)[0];
                moveElement.textContent = moveName;
                moveElement.style.backgroundColor = moveColor;
            }

            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            return { imageUrl, name, type1ai, type2ai, move1ai, move2ai, move3ai, move4ai, healthai, attackai, defenceai, id };
        }
    }

    pokemoninputai.addEventListener('input', async function (event) {
        const pokemondata = await getPokemonDataByInputAi(event.target.value.toLowerCase());
        if (pokemondata !== null) {
            pokemonidai.textContent = pokemondata.id;
            pokemonimageai.src = pokemondata.imageUrl;
            pokemonnameai.textContent = pokemondata.name;
            pokemonnameai.style.fontWeight = 'bold';
            pokemonnameai.style.textTransform = 'capitalize';
            pokemonmove1ai.textContent = pokemondata.move1ai;
            pokemonmove2ai.textContent = pokemondata.move2ai;
            pokemonmove3ai.textContent = pokemondata.move3ai;
            pokemonmove4ai.textContent = pokemondata.move4ai;
            pokemonattackai.textContent = pokemondata.attackai;
            pokemondefenseai.textContent = pokemondata.defenceai;
            pokemonmaxhealthai.textContent = pokemondata.healthai;
            pokemoncurrenthealthai.textContent = pokemondata.healthai;

            typeicon1ai.src = typeIcons[pokemondata.type1ai];
            typeicon1ai.style.backgroundColor = movesColors[pokemondata.type1ai] || 'rgb  (0, 0, 0, 0)';
            if (pokemondata.type2ai) {
                typeicon2ai.src = typeIcons[pokemondata.type2ai];
                typeicon2ai.style.backgroundColor = movesColors[pokemondata.type2ai] || 'rgb  (0, 0, 0, 0)';
                typeicon2ai.style.display = 'block';
            }
            else {
                typeicon2ai.src = '';
                typeicon2ai.style.display = 'none';
            }
        }
    });

    const pokemonimageuser = document.getElementById('innerpokemondisplayuser');
    const pokemonnameuser = document.getElementsByClassName('battlernamepokemonuser')[0];
    const pokemonmove1user = document.getElementsByClassName('battlermove1user')[0];
    const pokemonmove2user = document.getElementsByClassName('battlermove2user')[0];
    const pokemonmove3user = document.getElementsByClassName('battlermove3user')[0];
    const pokemonmove4user = document.getElementsByClassName('battlermove4user')[0];
    const pokemonattackuser = document.getElementsByClassName('battlerattackpokemonuser')[0];
    const pokemondefenseuser = document.getElementsByClassName('battlerdefensepokemonuser')[0];
    const pokemonmaxhealthuser = document.getElementsByClassName('maxhealthuser')[0];
    const pokemoncurrenthealthuser = document.getElementsByClassName('currenthealthuser')[0];

    const typeicon1user = document.getElementById('typeicon1user');
    const typeicon2user = document.getElementById('typeicon2user');
    async function getRandomPokemon() {
        let userallstatpoints = parseInt(pokemonattackuser.textContent) + parseInt(pokemondefenseuser.textContent) + parseInt(pokemonmaxhealthuser.textContent);
        let AIallstatpoints = 0;
        const threshold = 20;

        const getAllPokemonResponse = await fetch("/api/getallpokemon");
        const dataAllPokemon = await getAllPokemonResponse.json();
        const allPokemonIds = dataAllPokemon.allCustomIDPokemon;

        let randomId;
        let data;
        let id;

        do {
            randomId = Math.floor(Math.random() * 898) + 1;

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            data = await response.json();

            AIallstatpoints = data.stats[0].base_stat + data.stats[1].base_stat + data.stats[2].base_stat;

        } while (allPokemonIds.includes(randomId) || Math.abs(AIallstatpoints - userallstatpoints) > threshold);

        id = data.id.toString();
        let name = data.name;

        const type1ai = data.types[0].type.name;
        const type2ai = data.types[1] ? data.types[1].type.name : '';
        const type1Color = movesColors[type1ai] || 'rgba(0, 0, 0, 0)';
        const type2Color = movesColors[type2ai] || 'rgba(0, 0, 0, 0)';

        const healthai = data.stats[0].base_stat;
        const attackai = data.stats[1].base_stat;
        const defenseai = data.stats[2].base_stat;
        AIallstatpoints = attackai + defenseai + healthai;

        for (let i = 0; i < 4; i++) {
            const moveName = data.moves[i].move.name;
            const moveTypeResponse = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
            const moveTypeData = await moveTypeResponse.json();

            const moveType = moveTypeData.type.name;
            const movetypename = document.getElementById(`battlermovetype${i + 1}ai`);
            movetypename.textContent = moveType;

            const moveColor = movesColors[moveType] || 'rgba(0, 0, 0, 0)';
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

            if (i === 0) move1ai = moveName;
            if (i === 1) move2ai = moveName;
            if (i === 2) move3ai = moveName;
            if (i === 3) move4ai = moveName;
        }

        pokemonidai.textContent = id;
        pokemonimageai.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
        pokemonnameai.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        pokemonnameai.style.fontWeight = 'bold';
        pokemonnameai.style.textTransform = 'capitalize';
        typeicon1ai.src = typeIcons[type1ai];
        typeicon1ai.style.backgroundColor = type1Color;
        if (type2ai) {
            typeicon2ai.src = typeIcons[type2ai];
            typeicon2ai.style.backgroundColor = type2Color;
        }
        pokemonmove1ai.textContent = move1ai;
        pokemonmove2ai.textContent = move2ai;
        pokemonmove3ai.textContent = move3ai;
        pokemonmove4ai.textContent = move4ai;
        pokemonattackai.textContent = attackai;
        pokemondefenseai.textContent = defenseai;
        pokemonmaxhealthai.textContent = healthai;
        pokemoncurrenthealthai.textContent = healthai;
        pokemonbattlerlogtext.textContent = "Versla deze Pokémon om hem te vangen!";
    }

    let type1user, type2user, move1user, move2user, move3user, move4user, healthuser, attackuser, defenceuser = "";

    async function getUserPokemonData() {
        const profileInfo = await fetch("/api/profileinfo");
        const profileInfoJson = await profileInfo.json();
        const buddyId = profileInfoJson.buddyId;

        const actualInfoAPI = await fetch("/api/customidinfo/" + buddyId);
        const actualInfoJsonAPI = await actualInfoAPI.json();
        const actualId = actualInfoJsonAPI.actualId;
        const name = actualInfoJsonAPI.name;
        healthuser = actualInfoJsonAPI.health;
        attackuser = actualInfoJsonAPI.attack;
        defenceuser = actualInfoJsonAPI.defence;
        const pokeAPIInformation = await fetch(`https://pokeapi.co/api/v2/pokemon/${actualId}`);
        const pokeAPIInformationJson = await pokeAPIInformation.json();

        type1user = pokeAPIInformationJson.types[0].type.name;
        type2user = pokeAPIInformationJson.types[1] ? pokeAPIInformationJson.types[1].type.name : '';

        const type1Color = movesColors[type1user];
        const type2Color = movesColors[type2user] || 'rgb(0, 0, 0, 0)';

        hiddenP.textContent = buddyId;

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

            const movesInfoSection = document.querySelector(`.battlermovesinfo`);
            const moveInfoSection = document.querySelector(`.battlermoveinfo${i + 1}`);
            moveInfoSection.style.display = 'none';
            if (i === 0) move1user = moveName;
            if (i === 1) move2user = moveName;
            if (i === 2) move3user = moveName;
            if (i === 3) move4user = moveName;
            moveElement.addEventListener('mouseover', () => {
                movesInfoSection.style.display = 'flex';
                moveInfoSection.style.display = 'flex';
            });

            moveElement.addEventListener('mouseout', () => {
                movesInfoSection.style.display = 'none';
                moveInfoSection.style.display = 'none';
            });
        }
        pokemonimageuser.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${actualId}.png`;
        pokemonnameuser.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        pokemonnameuser.style.fontWeight = 'bold';
        pokemonnameuser.style.textTransform = 'capitalize';
        typeicon1user.src = typeIcons[type1user];
        typeicon1user.style.backgroundColor = type1Color;
        if (type2user) {
            typeicon2user.src = typeIcons[type2user];
            typeicon2user.style.backgroundColor = type2Color;
        }
        pokemonmove1user.textContent = move1user;
        pokemonmove2user.textContent = move2user;
        pokemonmove3user.textContent = move3user;
        pokemonmove4user.textContent = move4user
        pokemonattackuser.textContent = attackuser;
        pokemondefenseuser.textContent = defenceuser;
        pokemonmaxhealthuser.textContent = healthuser;
        pokemoncurrenthealthuser.textContent = healthuser;

        typeicon1user.addEventListener('mouseover', () => {
            typeicon1user.style.transform = 'scale(1.2)';
        });

        typeicon1user.addEventListener('mouseout', () => {
            typeicon1user.style.transform = 'scale(1)';
        });
    }

    async function getRandomTrainer() {
        const trainers = [
            { name: 'brassius', image: 'brassius.png', type: 'grass', badge: 1 },
            { name: 'grusha', image: 'grusha.png', type: 'ice', badge: 2 },
            { name: 'iono', image: 'iono.png', type: 'electric', badge: 3 },
            { name: 'katy', image: 'katy.png', type: 'bug', badge: 4 },
            { name: 'kofu', image: 'kofu.png', type: 'water', badge: 5 },
            { name: 'larry', image: 'larry.png', type: 'normal', badge: 6 },
            { name: 'ryme', image: 'ryme.png', type: 'ghost', badge: 7 },
            { name: 'tulip', image: 'tulip.png', type: 'psychic', badge: 8 },
        ];

        const response = await fetch("/api/getbadges");
        const datajson = await response.json();
        const allbadges = datajson.badgeList;

        for (let i = 0; i < trainers.length; i++) {
            const trainer = trainers[i];
            const { badge } = trainer;
            if (allbadges.includes(badge)) {
                trainers.splice(i, 1);
                i--;
            }
        }

        if (trainers.length === 0) {
            await getRandomPokemon();
            return null;
        }
        else {
            const randomIndex = Math.floor(Math.random() * trainers.length);
            const trainer = trainers[randomIndex];
            const { name: trainername, image: trainerimage, trainertype, badge } = trainer;

            return { trainername, trainerimage, trainertype, badge };
        }
    }

    async function spawnTrainerOrPokemonChance() {
        const random = Math.random();

        if (random < 0.30) {

            const trainer = await getRandomTrainer();
            if (trainer) {
                await getRandomPokemon();
                trainerimageai.style.width = "300px";
                trainerimageai.src = ('./assets/images/gymleaders/' + trainer.trainerimage);
                pokemonbattlerlogtext.textContent = `Pas op voor ${trainer.trainername} de gym leader!`;
                pokemonidai.style.display = "none";
            }
        }
        else {
            await getRandomPokemon();
        }
    }

    const refreshbutton = document.querySelector('.refreshbutton');
    refreshbutton.addEventListener('click', () => {
        spawnTrainerOrPokemonChance();
    });



    await getUserPokemonData();

    spawnTrainerOrPokemonChance();
});

const battlermain = document.getElementsByClassName('battlermain')[0];
const grass = document.getElementById('grass');
const grasscontainer = document.getElementById('grass-container');

battlermain.style.filter = 'brightness(0.2)';
battlermain.style.filter = 'blur(2px)';

grass.style.animation = 'none'; // Reset animation
void grass.offsetWidth; // Trigger reflow
grass.style.animation = null; // Remove reset

grass.addEventListener('animationend', () => {
    battlermain.style.filter = 'brightness(1)';
    grasscontainer.style.display = 'none';
});