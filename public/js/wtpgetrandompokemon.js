const wtpbutton = document.getElementById('submitwtpbutton');
const wtpimg = document.getElementById('wtpimage');
const wtpname = document.getElementById('wtpname');
const wtpinput = document.getElementById('inputwtp');
const wtplogtext = document.getElementById('wtplogtext');
const wtpheader = document.getElementById('wtpheader');

async function getRandomPokemon() {
    let randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();

    let id = data.id.toString();
    let name = data.name;
    console.log("Deze Pokémon is: " + name)

    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    wtpimg.src = imageUrl;
    wtpimg.style.filter = 'brightness(0)';
    wtpimg.style.transform = 'scale(1)';
    wtpname.textContent = name;
    wtpname.style.fontWeight = 'bold';
    wtpname.style.textTransform = 'capitalize';
}

wtpbutton.addEventListener('click', async () => {
    const inputName = wtpinput.value.toLowerCase();

    if (inputName === wtpname.textContent) {
        wtpimg.style.filter = 'brightness(1)';
        wtpimg.style.transition = 'ease 2s';
        wtpheader.textContent = "Het is " + wtpname.textContent.charAt(0).toUpperCase() + wtpname.textContent.slice(1) + "!";
        + "!";

        if (window.innerWidth < 1000) {
            wtpimg.style.transform = 'scale(1.5)';
        }
        else {
            wtpimg.style.transform = 'scale(2.5)';
        }

        const profileInfo = await fetch("/api/profileinfo");
        const profileInfoJson = await profileInfo.json();
        const buddyId = profileInfoJson.buddyId;

        let rng = Math.floor(Math.random() * 3) + 1;
        if (rng === 1) {
            stat = "attack";
        }
        else if (rng === 2) {
            stat = "defence";
        }
        else if (rng === 3) {
            stat = "health";
        }

        fetch("/api/addrandomstat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pokemonId: buddyId, stat: stat })
        });

        setTimeout(async () => {
            alert("Goed geraden! Je huidige pokemon krijgt + 1 " + stat + "!");

            wtpimg.style.transition = 'ease 0s';
            getRandomPokemon();

            const profileInfo = await fetch("/api/profileinfo");
            const profileInfoJson = await profileInfo.json();
            const buddyId = profileInfoJson.buddyId;

            const actualInfoAPI = await fetch("/api/customidinfo/" + buddyId);
            const actualInfoJsonAPI = await actualInfoAPI.json();
            const actualHealt = actualInfoJsonAPI.health;
            const actualAttack = actualInfoJsonAPI.attack;
            const actualDefence = actualInfoJsonAPI.defence;

            const yourpokemonhealth = document.getElementById('yourpokemonhealth');
            const yourpokemonattack = document.getElementById('yourpokemonattack');
            const yourpokemondefence = document.getElementById('yourpokemondefence');

            yourpokemonhealth.textContent = actualHealt;
            yourpokemonattack.textContent = actualAttack;
            yourpokemondefence.textContent = actualDefence;


        }, 1000);

    } else {
        wtpheader.textContent = "Probeer het opnieuw !";
    }
});

async function onPageLoad() {
    getRandomPokemon();
}

window.addEventListener('load', onPageLoad);

const refreshbutton = document.querySelector('.refreshbutton');
refreshbutton.addEventListener('click', () => {
    getRandomPokemon();
});