document.addEventListener('DOMContentLoaded', async function () {
    const inputcompare1 = document.getElementById('inputcompare1');
    const inputcompare2 = document.getElementById('inputcompare2');

    const imagecompare1 = document.getElementById('compareimage1');
    const imagecompare2 = document.getElementById('compareimage2');

    const namecompare1 = document.getElementById('comparename1');
    const namecompare2 = document.getElementById('comparename2');

    const healthcompare1 = document.getElementById('comparehealthvalue1');
    const healthcompare2 = document.getElementById('comparehealthvalue2');

    const attackcompare1 = document.getElementById('compareattackvalue1');
    const attackcompare2 = document.getElementById('compareattackvalue2');

    const defencecompare1 = document.getElementById('comparedefencevalue1');
    const defencecompare2 = document.getElementById('comparedefencevalue2');

    const healthdifference1 = document.getElementById('comparehealthdifference1');
    const healthdifference2 = document.getElementById('comparehealthdifference2');

    const attackdifference1 = document.getElementById('compareattackdifference1');
    const attackdifference2 = document.getElementById('compareattackdifference2');

    const defencedifference1 = document.getElementById('comparedefencedifference1');
    const defencedifference2 = document.getElementById('comparedefencedifference2');

    let allPokemonNames = [];
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=2000`);
        const data = await response.json();
        allPokemonNames = data.results.map(pokemon => pokemon.name);
    } catch (error) {
        console.error('Error fetching Pokémon names:', error);
    }

    async function populateAutocomplete(input, autocompleteContainer, pokemonNames, namecompare, health, attack, defence, image, otherName) {
        const inputValue = input.value.toLowerCase();
        autocompleteContainer.innerHTML = '';
        autocompleteContainer.style.display = inputValue ? 'flex' : 'none';
        autocompleteContainer.style.backgroundColor = 'white';
        autocompleteContainer.style.display = 'flex';
        autocompleteContainer.style.flexDirection = 'column';
        autocompleteContainer.style.flexWrap = 'wrap';
        autocompleteContainer.style.width = '210px';
        autocompleteContainer.style.zIndex = '1';
        autocompleteContainer.style.position = 'absolute';
        autocompleteContainer.style.height = 'auto';
        autocompleteContainer.style.margin = '0 5px';
        autocompleteContainer.style.border = 'solid black 1px';
        autocompleteContainer.style.boxShadow = '0px 8px 16px 0px rgba(0, 0, 0, 0.2)';

        const filteredNames = pokemonNames.filter(name => name.startsWith(inputValue));

        filteredNames.forEach(name => {
            if (name.includes("-")) return;

            const option = document.createElement('option');
            option.textContent = name;
            option.classList.add('autocomplete-option');
            option.style.backgroundColor = 'white';
            option.style.padding = '5px';
            option.style.borderBottom = 'solid black 1px';
            option.style.fontSize = '25px';
            option.style.textTransform = 'capitalize';

            option.addEventListener('click', async function () {
                input.value = name;
                autocompleteContainer.innerHTML = '';
                autocompleteContainer.style.display = 'none';

                const pokeAPIInformationResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const pokeAPIInformationJson = await pokeAPIInformationResponse.json();

                const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeAPIInformationJson.id}.png`;

                namecompare.textContent = pokeAPIInformationJson.name.charAt(0).toUpperCase() + pokeAPIInformationJson.name.slice(1);
                image.src = imageUrl;
                health.textContent = pokeAPIInformationJson.stats[0].base_stat;
                attack.textContent = pokeAPIInformationJson.stats[1].base_stat;
                defence.textContent = pokeAPIInformationJson.stats[2].base_stat;

                if (otherName.textContent && namecompare.textContent) {
                    updateDifferences(healthcompare1, healthcompare2, attackcompare1, attackcompare2, defencecompare1, defencecompare2);
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

    inputcompare1.addEventListener('input', function () {
        const autocompleteContainer = document.getElementById('autocomplete-container-compare1');
        populateAutocomplete(inputcompare1, autocompleteContainer, allPokemonNames, namecompare1, healthcompare1, attackcompare1, defencecompare1, imagecompare1, namecompare2, healthcompare2, attackcompare2, defencecompare2);
    });

    inputcompare2.addEventListener('input', function () {
        const autocompleteContainer = document.getElementById('autocomplete-container-compare2');
        populateAutocomplete(inputcompare2, autocompleteContainer, allPokemonNames, namecompare2, healthcompare2, attackcompare2, defencecompare2, imagecompare2, namecompare1, healthcompare1, attackcompare1, defencecompare1);
    });

    function updateDifferences(health1, health2, attack1, attack2, defence1, defence2) {
        if (health1.textContent && health2.textContent) {
            const health1Value = parseInt(health1.textContent);
            const health2Value = parseInt(health2.textContent);
            const attack1Value = parseInt(attack1.textContent);
            const attack2Value = parseInt(attack2.textContent);
            const defence1Value = parseInt(defence1.textContent);
            const defence2Value = parseInt(defence2.textContent);

            healthdifference1.textContent = formatDifference(health1Value, health2Value);
            setDifferenceColor(healthdifference1, healthdifference1.textContent);

            attackdifference1.textContent = formatDifference(attack1Value, attack2Value);
            setDifferenceColor(attackdifference1, attackdifference1.textContent);

            defencedifference1.textContent = formatDifference(defence1Value, defence2Value);
            setDifferenceColor(defencedifference1, defencedifference1.textContent);

            healthdifference2.textContent = formatDifference(health2Value, health1Value);
            setDifferenceColor(healthdifference2, healthdifference2.textContent);

            attackdifference2.textContent = formatDifference(attack2Value, attack1Value);
            setDifferenceColor(attackdifference2, attackdifference2.textContent);

            defencedifference2.textContent = formatDifference(defence2Value, defence1Value);
            setDifferenceColor(defencedifference2, defencedifference2.textContent);
        }
    }

    function formatDifference(value1, value2) {
        const difference = value1 - value2;
        if (difference > 0) {
            return `+${difference}`;
        } else if (difference < 0) {
            return difference.toString();
        } else {
            return '≈';
        }
    }

    function setDifferenceColor(element, difference) {
        difference = parseInt(difference);
        if (difference > 0) {
            element.style.color = 'green';
        } else if (difference < 0) {
            element.style.color = 'red';
        } else {
            element.style.color = 'black';
        }
    }
});
