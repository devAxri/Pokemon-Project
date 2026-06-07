const move1user = document.getElementById('battlermove1user');
const move2user = document.getElementById('battlermove2user');
const move3user = document.getElementById('battlermove3user');
const move4user = document.getElementById('battlermove4user');
const movetype1user = document.getElementById('battlermovetype1user');
const movetype2user = document.getElementById('battlermovetype2user');
const movetype3user = document.getElementById('battlermovetype3user');
const movetype4user = document.getElementById('battlermovetype4user');

const pokemonbattlerlogtext = document.getElementsByClassName('battlerlogtext')[0];
const battlelogsection = document.getElementById('battlelogsection');
const battlelogtext = document.getElementById('battlelogtext');
const playagainbutton = document.getElementById('playagainbutton');
const backtostartbutton = document.getElementById('backtostartbutton');

const battlermovescontainer = document.getElementById('battlermovescontainer');
const battlermoveslabeluser = document.getElementById('battlermoveslabeluser');

const userimg = document.getElementById('innerpokemondisplayuser');
const aiimg = document.getElementById('innerpokemondisplayai');

var audio = new Audio("sounds/damage.mp3");
let endgame = false;
let userTurn = true;

function getTypeEffectiveness(movetype, typepokemon) {
    let typeEffectiveness = {
        'normal': { 'normal': 1, 'fire': 1, 'water': 1, 'electric': 1, 'grass': 1, 'ice': 1, 'fighting': 1, 'poison': 1, 'ground': 1, 'flying': 1, 'psychic': 1, 'bug': 1, 'rock': 0.5, 'ghost': 0, 'dragon': 1, 'dark': 1, 'steel': 0.5, 'fairy': 1 },
        'fire': { 'normal': 1, 'fire': 0.5, 'water': 0.5, 'electric': 1, 'grass': 2, 'ice': 2, 'fighting': 1, 'poison': 1, 'ground': 1, 'flying': 1, 'psychic': 1, 'bug': 2, 'rock': 0.5, 'ghost': 1, 'dragon': 0.5, 'dark': 1, 'steel': 2, 'fairy': 1 },
        'water': { 'normal': 1, 'fire': 2, 'water': 0.5, 'electric': 1, 'grass': 0.5, 'ice': 1, 'fighting': 1, 'poison': 1, 'ground': 2, 'flying': 1, 'psychic': 1, 'bug': 1, 'rock': 2, 'ghost': 1, 'dragon': 0.5, 'dark': 1, 'steel': 1, 'fairy': 1 },
        'electric': { 'normal': 1, 'fire': 1, 'water': 2, 'electric': 0.5, 'grass': 0.5, 'ice': 1, 'fighting': 1, 'poison': 1, 'ground': 0, 'flying': 2, 'psychic': 1, 'bug': 1, 'rock': 1, 'ghost': 1, 'dragon': 0.5, 'dark': 1, 'steel': 1, 'fairy': 1 },
        'grass': { 'normal': 1, 'fire': 0.5, 'water': 2, 'electric': 1, 'grass': 0.5, 'ice': 1, 'fighting': 1, 'poison': 0.5, 'ground': 2, 'flying': 0.5, 'psychic': 1, 'bug': 0.5, 'rock': 2, 'ghost': 1, 'dragon': 0.5, 'dark': 1, 'steel': 0.5, 'fairy': 1 },
        'ice': { 'normal': 1, 'fire': 0.5, 'water': 0.5, 'electric': 1, 'grass': 2, 'ice': 0.5, 'fighting': 1, 'poison': 1, 'ground': 2, 'flying': 2, 'psychic': 1, 'bug': 1, 'rock': 1, 'ghost': 1, 'dragon': 2, 'dark': 1, 'steel': 0.5, 'fairy': 1 },
        'fighting': { 'normal': 2, 'fire': 1, 'water': 1, 'electric': 1, 'grass': 1, 'ice': 1, 'fighting': 1, 'poison': 1, 'ground': 1, 'flying': 0.5, 'psychic': 0.5, 'bug': 0.5, 'rock': 2, 'ghost': 0, 'dragon': 1, 'dark': 2, 'steel': 1, 'fairy': 0.5 },
        'poison': { 'normal': 1, 'fire': 1, 'water': 1, 'electric': 1, 'grass': 2, 'ice': 1, 'fighting': 1, 'poison': 0.5, 'ground': 0.5, 'flying': 1, 'psychic': 1, 'bug': 1, 'rock': 0.5, 'ghost': 0.5, 'dragon': 1, 'dark': 1, 'steel': 0, 'fairy': 2 },
        'ground': { 'normal': 1, 'fire': 2, 'water': 1, 'electric': 2, 'grass': 0.5, 'ice': 1, 'fighting': 1, 'poison': 2, 'ground': 1, 'flying': 0, 'psychic': 1, 'bug': 1, 'rock': 2, 'ghost': 1, 'dragon': 1, 'dark': 1, 'steel': 2, 'fairy': 1 },
        'flying': { 'normal': 1, 'fire': 1, 'water': 1, 'electric': 0.5, 'grass': 2, 'ice': 1, 'fighting': 2, 'poison': 1, 'ground': 1, 'flying': 1, 'psychic': 1, 'bug': 2, 'rock': 0.5, 'ghost': 1, 'dragon': 1, 'dark': 1, 'steel': 0.5, 'fairy': 1 },
        'psychic': { 'normal': 1, 'fire': 1, 'water': 1, 'electric': 1, 'grass': 1, 'ice': 1, 'fighting': 2, 'poison': 2, 'ground': 1, 'flying': 1, 'psychic': 0.5, 'bug': 1, 'rock': 1, 'ghost': 1, 'dragon': 1, 'dark': 0, 'steel': 0.5, 'fairy': 1 },
        'bug': { 'normal': 1, 'fire': 0.5, 'water': 1, 'electric': 1, 'grass': 2, 'ice': 1, 'fighting': 0.5, 'poison': 0.5, 'ground': 1, 'flying': 0.5, 'psychic': 2, 'bug': 1, 'rock': 1, 'ghost': 0.5, 'dragon': 1, 'dark': 2, 'steel': 0.5, 'fairy': 0.5 },
        'rock': { 'normal': 1, 'fire': 2, 'water': 1, 'electric': 1, 'grass': 1, 'ice': 2, 'fighting': 0.5, 'poison': 1, 'ground': 0.5, 'flying': 2, 'psychic': 1, 'bug': 2, 'rock': 1, 'ghost': 1, 'dragon': 1, 'dark': 1, 'steel': 0.5, 'fairy': 1 },
        'ghost': { 'normal': 0, 'fire': 1, 'water': 1, 'electric': 1, 'grass': 1, 'ice': 1, 'fighting': 0, 'poison': 1, 'ground': 1, 'flying': 1, 'psychic': 1, 'bug': 1, 'rock': 1, 'ghost': 2, 'dragon': 1, 'dark': 2, 'steel': 1, 'fairy': 1 },
        'dragon': { 'normal': 1, 'fire': 1, 'water': 1, 'electric': 1, 'grass': 1, 'ice': 1, 'fighting': 1, 'poison': 1, 'ground': 1, 'flying': 1, 'psychic': 1, 'bug': 1, 'rock': 1, 'ghost': 1, 'dragon': 2, 'dark': 1, 'steel': 0.5, 'fairy': 0 },
        'dark': { 'normal': 1, 'fire': 1, 'water': 1, 'electric': 1, 'grass': 1, 'ice': 1, 'fighting': 0.5, 'poison': 1, 'ground': 1, 'flying': 1, 'psychic': 2, 'bug': 1, 'rock': 1, 'ghost': 0.5, 'dragon': 1, 'dark': 0.5, 'steel': 1, 'fairy': 0.5 },
        'steel': { 'normal': 1, 'fire': 0.5, 'water': 0.5, 'electric': 0.5, 'grass': 1, 'ice': 2, 'fighting': 1, 'poison': 1, 'ground': 1, 'flying': 1, 'psychic': 1, 'bug': 1, 'rock': 2, 'ghost': 1, 'dragon': 1, 'dark': 1, 'steel': 0.5, 'fairy': 2 },
        'fairy': { 'normal': 1, 'fire': 0.5, 'water': 1, 'electric': 1, 'grass': 1, 'ice': 1, 'fighting': 2, 'poison': 0.5, 'ground': 1, 'flying': 1, 'psychic': 1, 'bug': 1, 'rock': 1, 'ghost': 1, 'dragon': 2, 'dark': 2, 'steel': 0.5, 'fairy': 1 }
    };

    let effectivenessValue = typeEffectiveness[movetype][typepokemon];
    if (effectivenessValue === undefined) {
        return 1;
    } else {
        return effectivenessValue;
    }
}

move1user.addEventListener('click', function () {
    let randommovenumber = Math.floor(Math.random() * 4 + 1);
    handleMove(1, movetype1user, move1user, randommovenumber);
});


move2user.addEventListener('click', function () {
    let randommovenumber = Math.floor(Math.random() * 4 + 1);
    handleMove(2, movetype2user, move2user, randommovenumber);
});


move3user.addEventListener('click', function () {
    let randommovenumber = Math.floor(Math.random() * 4 + 1);
    handleMove(3, movetype3user, move3user, randommovenumber);
});


move4user.addEventListener('click', function () {
    let randommovenumber = Math.floor(Math.random() * 4 + 1);
    handleMove(4, movetype4user, move4user, randommovenumber);
});

function handleMove(moveNumber, movetype, move, randommovenumber) {
    audio.play();
    battlermovescontainer.style.display = "none";
    battlermoveslabeluser.textContent = "Het is niet jouw beurt.";

    const inputField = document.getElementById(`battlersearchpokemonformuser`);
    const inputFieldAI = document.getElementById(`battlersearchpokemonformai`);
    const battletinfouser = document.getElementById(`battlerinfouser`);
    const battletinfoai = document.getElementById(`battlerinfoai`);
    const refreshbutton = document.getElementById(`refreshbutton`);
    battletinfouser.style.borderRadius = "10px";
    battletinfoai.style.borderRadius = "10px";
    inputField.style.display = "none";
    inputFieldAI.style.display = "none";
    refreshbutton.style.display = "none";

    move1user.disabled = true;

    userAttack();
    setTimeout(function () {
        if (!endgame) {
            aiAttack(randommovenumber);
        }
    }, 1500);

    async function userAttack() {
        const userpower = parseInt(document.getElementById(`battlermove${moveNumber}poweruser`).textContent);
        const userattack = parseInt(document.getElementsByClassName(`battlerattackpokemonuser`)[0].textContent);

        let ainame = document.getElementsByClassName(`battlernamepokemonai`)[0];
        ainame.style.textTransform = 'capitalize';
        ainame = ainame.textContent;
        const aidefence = parseInt(document.getElementsByClassName(`battlerdefensepokemonai`)[0].textContent);
        let aicurrenthealth = parseInt(document.getElementsByClassName('currenthealthai')[0].textContent);
        const aimaxhealth = parseInt(document.getElementsByClassName('maxhealthai')[0].textContent);
        const aihealthbar = document.getElementsByClassName('healthbarai')[0];

        const type1aielement = document.getElementById('typeicon1ai').src;
        let parts = type1aielement.split('/');
        let type1ai = parts[parts.length - 1].replace('.png', '');

        let effectiveness = getTypeEffectiveness(movetype.textContent, type1ai);
        let effectivetext;

        switch (effectiveness) {
            case 0:
                effectivetext = 'helemaal niet effectief';
                break;
            case 0.5:
                effectivetext = 'niet effectief';
                break;
            case 1:
                effectivetext = 'normaal effectief';
                break;
            case 2:
                effectivetext = 'super effectief';
                break;
        }

        let userdamage = Math.floor(((userattack / aidefence) * userpower * effectiveness) / 4);

        if (userdamage < 0) {
            userdamage = 1;
        }

        if (aicurrenthealth - userdamage <= 0) {
            aicurrenthealth = document.getElementsByClassName('currenthealthai')[0].textContent = 0;
        }
        else {
            aicurrenthealth = document.getElementsByClassName('currenthealthai')[0].textContent = aicurrenthealth - userdamage;
        }
        pokemonbattlerlogtext.textContent = move.textContent + ' is ' + effectivetext + ', je richt ' + userdamage + ' schaden aan ' + ainame + '!';

        aihealthbar.style.width = `${(aicurrenthealth / aimaxhealth) * 100}%`;
        userimg.style.translate = '100px';

        if (aicurrenthealth <= 0) {
            battlelogsection.style.display = 'flex';
            endgame = true;
            battlermovescontainer.style.display = "none";
            battlermoveslabeluser.textContent = "Spel gedaan.";

            incrementBattleWon();

            aiid = document.getElementById(`battleridpokemonai`).textContent;
            pokemonnameai = document.getElementById(`battlernamepokemonai`).textContent;


            const trainerdisplayai = document.getElementById(`trainerdisplayai`);

            await fetch("/api/changestats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ customId: Number(document.getElementById('hiddenP').textContent), stat: "amountWon", plusOrMinus: "plus" })
            });

            if (trainerdisplayai.src === '') {
                addpokemonwon(aiid, pokemonnameai);
                battlelogtext.textContent = "Gefeliciteerd je hebt gewonnen! Je vangt deze Pokémon automatisch.";
                battlelogtext.style.color = 'green';
                const badgeimg = document.getElementById(`badgeimage`);
                badgeimg.style.display = 'none';
            } else {
                const trainerimg = trainerdisplayai.src;
                trainername = trainerimg.split('/').pop().split('.').shift();
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
                const badges = [
                    { id: 1, name: "Stone Badge", image: "../assets/images/badges/boulderBadge.png" },
                    { id: 2, name: "Water Badge", image: "../assets/images/badges/cascadeBadge.png" },
                    { id: 3, name: "Volcano Badge", image: "../assets/images/badges/volcanoBadge.png" },
                    { id: 4, name: "Earth Badge", image: "../assets/images/badges/earthbadge.png" },
                    { id: 5, name: "Fire Badge", image: "../assets/images/badges/fireBadge.png" },
                    { id: 6, name: "Rainbow Badge", image: "../assets/images/badges/rainbowBadge.png" },
                    { id: 7, name: "Soul Badge", image: "../assets/images/badges/soulbadge.png" },
                    { id: 8, name: "Thunder Badge", image: "../assets/images/badges/thunderBadge.png" }
                ];

                // Find the trainer and get the badge
                let trainer = trainers.find(trainer => trainer.name === trainername);
                if (trainer) {
                    let badge = trainer.badge;
                    addbadge(badge);

                    const badgeimg = document.getElementById(`badgeimage`);
                    badgeimg.src = badges[badge - 1].image;
                    battlelogtext.textContent = "Gefeliciteerd je hebt gewonnen! Je verdient een badge van deze trainer.";
                    battlelogtext.style.color = "green";
                }
            }
        }
        aiimg.style.filter = 'sepia(100%)';
        setTimeout(function () { userimg.style.translate = '0px'; aiimg.style.filter = 'none'; }, 250);
    }
}
function calculateDamage(attack, power, defense, effectiveness) {
    return Math.floor((attack / defense) * power * effectiveness);
}
async function aiAttack(randommovenumber) {
    audio.play();
    if (endgame == false) {
        const aiattack = parseInt(document.getElementsByClassName(`battlerattackpokemonai`)[0].textContent);
        let randommovename = document.getElementsByClassName(`battlermove${randommovenumber}ai`)[0].textContent;
        let randommovetype = document.getElementById(`battlermovetype${randommovenumber}ai`).textContent;

        const aipower = parseInt(document.getElementById(`battlermove${randommovenumber}poweruser`).textContent);
        const userdefence = parseInt(document.getElementsByClassName(`battlerdefensepokemonuser`)[0].textContent);
        let usercurrenthealth = parseInt(document.getElementsByClassName('currenthealthuser')[0].textContent);
        const usermaxhealth = parseInt(document.getElementsByClassName('maxhealthuser')[0].textContent);
        const userhealthbar = document.getElementsByClassName('healthbaruser')[0];

        const type1userelement = document.getElementById('typeicon1user').src;
        parts = type1userelement.split('/');
        let type1user = parts[parts.length - 1].replace('.png', '');

        let effectiveness = getTypeEffectiveness(randommovetype, type1user);
        let effectivetext;

        switch (effectiveness) {
            case 0:
                effectivetext = 'geen effect';
                break;
            case 0.5:
                effectivetext = 'niet effectief';
                break;
            case 1:
                effectivetext = 'normaal effectief';
                break;
            case 2:
                effectivetext = 'super effectief';
                break;
        }

        let aidamage = Math.floor(((aiattack / userdefence) * aipower * effectiveness) / 4);

        if (aidamage < 0) {
            aidamage = 1;
        }

        if (usercurrenthealth - aidamage <= 0) {
            usercurrenthealth = document.getElementsByClassName('currenthealthuser')[0].textContent = 0;
        }
        else {
            usercurrenthealth = document.getElementsByClassName('currenthealthuser')[0].textContent = usercurrenthealth - aidamage;
        }

        pokemonbattlerlogtext.textContent = randommovename + ' is ' + effectivetext + ', de vijand richt ' + aidamage + ' schaden!';

        userhealthbar.style.width = `${(usercurrenthealth / usermaxhealth) * 100}%`;
        aiimg.style.translate = '-100px';
        userimg.style.filter = 'sepia(100%)';
        setTimeout(function () { aiimg.style.translate = '0px'; userimg.style.filter = 'none'; }, 250);

        battlermovescontainer.style.display = "Block";
        battlermoveslabeluser.textContent = "Kies een aanval";

        if (usercurrenthealth <= 0) {
            battlelogsection.style.display = 'flex';
            await fetch("/api/changestats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ customId: Number(document.getElementById('hiddenP').textContent), stat: "amountLost", plusOrMinus: "plus" })
            });
            battlelogtext.textContent = "Jammer je hebt verloren! probeer het opnieuw.";
            const badgeimg = document.getElementById(`badgeimage`);
            badgeimg.style.display = 'none';
            battlelogtext.style.color = 'red';
            battlermovescontainer.style.display = "None";
            battlermoveslabeluser.textContent = "Spel gedaan.";
            endgame = true;
            incrementBattleLose();
        }
    }
    else {
        battlermovescontainer.style.display = "None";
        battlermoveslabeluser.textContent = "Spel gedaan.";
    }
}
async function incrementBattleWon() {
    const response = await fetch("/api/profileinfo");
    const profileInfo = await response.json();
    const amountBattlesWin = parseInt(profileInfo.amountBattlesWin);
    const newAmountBattlesWin = amountBattlesWin + 1;

    await fetch("/api/updatebattlestats", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatChanged: "win", amount: newAmountBattlesWin })
    });
}

async function incrementBattleLose() {
    const response = await fetch("/api/profileinfo");

    const profileInfo = await response.json();
    const amountBattlesLose = parseInt(profileInfo.amountBattlesLose);
    const newAmountBattlesLose = amountBattlesLose + 1;

    await fetch("/api/updatebattlestats", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatChanged: "lose", amount: newAmountBattlesLose })
    });
}

async function addpokemonwon(id, name) {
    await fetch("/api/catchpokemon", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pokemonId: id, name: name })
    });
}

async function addbadge(badgeid) {
    await fetch("/api/addbadge", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ badgeId: badgeid })
    });
}
