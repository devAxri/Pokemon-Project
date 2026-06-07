document.addEventListener('DOMContentLoaded', async function () {
    const pokemonimageyp = document.getElementById('yourpokemonimage');
    const yourpokemonhealth = document.getElementById('yourpokemonhealth');
    const yourpokemonattack = document.getElementById('yourpokemonattack');
    const yourpokemondefence = document.getElementById('yourpokemondefence');
    const yourpokemonname = document.getElementById('yourpokemonname');
    const ypInput = document.getElementById('inputpokemonyourpokemon');

    const profileInfo = await fetch("/api/profileinfo");
    const profileInfoJson = await profileInfo.json();
    const buddyId = profileInfoJson.buddyId;

    const actualInfoAPI = await fetch("/api/customidinfo/" + buddyId);
    const actualInfoJsonAPI = await actualInfoAPI.json();
    const actualId = actualInfoJsonAPI.actualId;
    const actualHealt = actualInfoJsonAPI.health;
    const actualAttack = actualInfoJsonAPI.attack;
    const actualDefence = actualInfoJsonAPI.defence;

    const name = actualInfoJsonAPI.name;

    yourpokemonhealth.textContent = actualHealt;
    yourpokemonattack.textContent = actualAttack;
    yourpokemondefence.textContent = actualDefence;
    yourpokemonname.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    const buddyname = document.getElementById('buddyname');
    if (buddyname !== null) {
        buddyname.textContent = yourpokemonname.textContent;
    }
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${actualId}.png`;
    pokemonimageyp.src = imageUrl;

    pokemonimageyp.addEventListener('click', function () {
        window.location.href = `view?id=${pokemonimageyp.src.split('/').pop().split('.').shift()}`;
    });

    const toggleSidebarButton = document.querySelector('.toggle-sidebar-button');
    if (toggleSidebarButton) {
        toggleSidebarButton.innerHTML = `<img src="${pokemonimageyp.src}">`;
    }

    ypInput.addEventListener('input', async function () {
        const autocompleteContainer = document.getElementById('autocomplete-container-yp');

        const inputValue = ypInput.value.toLowerCase();
        autocompleteContainer.innerHTML = '';
        autocompleteContainer.style.backgroundColor = 'white';
        autocompleteContainer.style.display = 'flex';
        autocompleteContainer.style.flexDirection = 'column';
        autocompleteContainer.style.flexwrap = 'wrap';
        autocompleteContainer.style.width = '200px';
        autocompleteContainer.style.zIndex = '1';
        autocompleteContainer.style.position = 'absolute';
        autocompleteContainer.style.height = 'auto';
        autocompleteContainer.style.margin = '0 5px';
        autocompleteContainer.style.border = 'solid black 1px';
        autocompleteContainer.style.boxShadow = '0px 8px 16px 0px rgba(0, 0, 0, 0.2)';

        if (inputValue.length === 0) {
            autocompleteContainer.style.display = 'none';
            return;
        }

        const response = await fetch("/api/getallpokemon");
        const data = await response.json();
        const allpokemonid = data.allCustomIDPokemon;

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
                ypInput.value = name.name;
                autocompleteContainer.innerHTML = '';
                autocompleteContainer.style.display = 'none';

                pokemonArray.forEach(async nametwo => {
                    if (nametwo == name) {

                        const actualId = nametwo.actualPokemonId;

                        yourpokemonname.textContent = nametwo.name.charAt(0).toUpperCase() + nametwo.name.slice(1);

                        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${actualId}.png`;
                        pokemonimageyp.src = imageUrl;

                        yourpokemonhealth.textContent = nametwo.health;
                        yourpokemonattack.textContent = nametwo.attack;
                        yourpokemondefence.textContent = nametwo.defence;

                        const changeBuddyResponse = await fetch("/api/changebuddy", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ buddyId: nametwo.customId }),
                        });
                        const changeBuddyResponseJson = await changeBuddyResponse.json();
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
    });
});
