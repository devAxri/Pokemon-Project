document.addEventListener("DOMContentLoaded", async function () {
    const catchPokemonName = document.getElementById("catchpokemonname");
    const catchPokemonImage = document.getElementById("catchpokemonimage");
    const catchPokemonButton = document.getElementById("catchpokemonbutton");
    const releasePokemonButton = document.getElementById("releasepokemonbutton");
    const catchRateElement = document.getElementById("catchrate");
    const catchChancesElement = document.getElementById("catchchances");
    const catchChancesTextElement = document.getElementById("catchchancestext");
    const hiddenP = document.getElementById("hiddenP");

    let catchRate = parseInt(catchRateElement.textContent);
    let catchChances = parseInt(catchChancesElement.textContent);
    let isCaught = false;
    let pokemonId = "";
    let defence = 0;

    const getAllPokemonResponse = await fetch("/api/getallpokemon");
    const dataAllPokemon = await getAllPokemonResponse.json();
    const allPokemonIds = dataAllPokemon.allCustomIDPokemon;

    const getAllCustomPokemonResponse = await fetch("/api/getallcustompokemon");
    const allCustomPokemonJson = await getAllCustomPokemonResponse.json();

    let randomId;
    do {
        randomId = Math.floor(Math.random() * 898) + 1;
    } while (allPokemonIds.includes(allCustomPokemonJson[randomId]?.customId));

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();

    pokemonId = data.id.toString();
    let name = data.name;
    defence = data.stats[2].base_stat;
    let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    catchPokemonImage.src = imageUrl;
    catchPokemonName.textContent = name;

    const profileInfo = await fetch("/api/profileinfo");
    const profileInfoJson = await profileInfo.json();
    const buddyId = profileInfoJson.buddyId;

    const actualInfoAPI = await fetch(`/api/customidinfo/${buddyId}`);
    const actualInfoJsonAPI = await actualInfoAPI.json();
    const actualAttack = actualInfoJsonAPI.attack;

    catchRate = Math.floor((actualAttack / (actualAttack + defence) * 100) + 1);

    catchRateElement.textContent = catchRate;


    window.addEventListener("keydown", function (event) {
        if (event.key === "e" && event.target.tagName !== "INPUT") {
            catchPokemon(pokemonId);
        }
    });

    async function catchPokemon(id) {
        if (!isCaught) {
            const randomChance = Math.floor(Math.random() * 100) + 1;

            if (randomChance < catchRate) {
                catchPokemonButton.style.border = "solid green 5px";
                releasePokemonButton.style.display = 'block';
                isCaught = true;

                let name = prompt("Wat is de bijnaam van de pokemon?");
                if (!name) {
                    name = catchPokemonName.textContent;
                }

                try {
                    const fetchCatch = await fetch("/api/catchpokemon", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ pokemonId: id, name })
                    });
                    const fetchJson = await fetchCatch.json();
                    hiddenP.textContent = fetchJson.id;

                } catch (error) {
                    console.error("Error catching Pokémon:", error);
                }

            } else {
                catchChances -= 1;
                if (catchChances === 1) {
                    catchChancesTextElement.textContent = "1 kans";
                } else {
                    catchChancesTextElement.textContent = `${catchChances} kansen`;
                }

                if (catchChances === 0) {
                    alert("Ohnee, de Pokémon is weggelopen!");
                    window.location.reload();
                }
            }
        } else {
            alert("Je hebt de pokemon al gevangen!");
        }
    }

    catchPokemonButton.addEventListener("click", function () {
        catchPokemon(pokemonId);
    });

    releasePokemonButton.addEventListener("click", function () {
        if (confirm("Ben je zeker dat je deze pokemon wilt vrijlaten?")) {
            catchPokemonButton.style.border = "solid red 5px";
            releasePokemonButton.style.display = 'none';
            isCaught = false;
            catchChances = 3;
            catchChancesTextElement.textContent = `${catchChances} kansen`;
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
});
