const wtpInput = document.getElementById('inputwtp');
const wtpmain = document.getElementsByClassName('wtpmain')[0];

async function populateAutocomplete(input, autocompleteContainer) {
    const inputValue = input.value.toLowerCase();
    autocompleteContainer.innerHTML = '';
    autocompleteContainer.style.backgroundColor = 'white';
    autocompleteContainer.style.display = 'flex';
    autocompleteContainer.style.flexDirection = 'column';
    autocompleteContainer.style.flexwrap = 'wrap';
    autocompleteContainer.style.width = '190px';
    autocompleteContainer.style.zIndex = '1';
    autocompleteContainer.style.position = 'absolute';
    autocompleteContainer.style.height = 'fit-content';
    autocompleteContainer.style.margin = '40px 5px';
    autocompleteContainer.style.border = 'solid black 1px';
    autocompleteContainer.style.boxShadow = '0px 8px 16px 0px rgba(0, 0, 0, 0.2)';

    if (inputValue.length === 0) {
        autocompleteContainer.style.display = 'none';
        return;
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=1000`);
    const data = await response.json();

    const pokemonNames = data.results.map(pokemon => pokemon.name);

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

        option.addEventListener('click', function () {
            input.value = name;
            autocompleteContainer.innerHTML = ''; // Clear autocomplete container after selection
            autocompleteContainer.style.display = 'none';
        });

        option.addEventListener('mouseover', function () {
            this.style.backgroundColor = 'lightgray';
        });

        option.addEventListener('mouseout', function () {
            this.style.backgroundColor = 'white';
        });

        autocompleteContainer.appendChild(option);
    });
}

wtpInput.addEventListener('input', function () {
    const autocompleteContainer = document.getElementById('autocomplete-container-wtp');
    populateAutocomplete(wtpInput, autocompleteContainer);
});

wtpmain.addEventListener('click', function () {
    const autocompleteContainer = document.getElementById('autocomplete-container-wtp');
    autocompleteContainer.innerHTML = '';
    autocompleteContainer.style.display = 'none';
})