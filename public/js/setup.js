async function getPokemonImageUrlByName(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${name}`);
    const data = await response.json();
    let id = data.id.toString();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

const select = document.getElementById("selecStartPokemon");
const preview = document.getElementById("startersPokemonPreview");
const selectPfp = document.getElementById("selectProfilePic");
const previewPfp = document.getElementById("profilePicturPreview");
const confirmButton = document.getElementById("registerButton");

const errorField = document.getElementById("errorField");
const actualSetupForm = document.getElementById("actualSetupForm")

actualSetupForm.addEventListener('submit', async function (event) {
    event.preventDefault();
})

select.addEventListener('change', async function () {
    const pokemonName = this.value;

    preview.src = await getPokemonImageUrlByName(pokemonName);
})

selectPfp.addEventListener('change', async function () {
    const pokemonName = this.value;

    previewPfp.src = await getPokemonImageUrlByName(pokemonName);
})

confirmButton.addEventListener('click', async function () {
    const username = document.getElementById("username").value;
    if (username.length <= 0)
        return alert("Vul een gebruikersnaam in.");
    const pokemonName = select.value;
    const profilePic = selectPfp.value;

    const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, pokemonName, profilePic }),
    })

    if (response.status === 200) {
        window.location.href = "/home";
    }
    else {
        const error = await response.json();

        errorField.innerText = error.error;
    }
})