const searchGameInput = document.getElementById('searchgameinput');

const allGames = ['Pokémon', 'Fifa', 'Fortnite', 'Lord Of The Rings', 'Magic The Gathering', 'Lego Masters'];

async function populateAutocompleteGames(input, autocompleteContainer) {
    const inputValue = input.value.toLowerCase();
    autocompleteContainer.innerHTML = '';
    autocompleteContainer.style.backgroundColor = 'white';
    autocompleteContainer.style.display = 'flex';
    autocompleteContainer.style.flexDirection = 'column';
    autocompleteContainer.style.flexwrap = 'wrap';
    autocompleteContainer.style.width = '400px';
    autocompleteContainer.style.zIndex = '1';
    autocompleteContainer.style.position = 'absolute';
    autocompleteContainer.style.height = 'auto';
    autocompleteContainer.style.margin = '5px -5px';
    autocompleteContainer.style.border = 'solid black 1px';
    autocompleteContainer.style.boxShadow = '0px 8px 16px 0px rgba(0, 0, 0, 0.2)';

    if (inputValue.length === 0) {
        autocompleteContainer.style.display = 'none';
        return;
    }

    const filteredGames = allGames.filter(value => value.toLowerCase().startsWith(inputValue.toLowerCase()));
    filteredGames.forEach(name => {
        const option = document.createElement('option');
        option.textContent = name;
        option.classList.add('autocomplete-option');
        option.style.backgroundColor = 'white';
        option.style.padding = '5px';
        option.style.borderBottom = 'solid black 1px';
        option.style.fontSize = '25px';
        option.style.textTransform = 'capitalize';

        option.addEventListener('click', function () {
            name = input.value;
            autocompleteContainer.innerHTML = '';
            autocompleteContainer.style.display = 'none';
            if (name === 'Pokémon' || name === 'pokemon' || option.textContent === 'Pokémon' || option.textContent === 'pokemon') {
                window.location.href = '/home';
            }
            else {
                alert('Je kan hier niet aan deelnemen.');
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

searchGameInput.addEventListener('input', function () {
    const autocompleteContainer = document.getElementById('autocomplete-container-game');
    populateAutocompleteGames(searchGameInput, autocompleteContainer);
});