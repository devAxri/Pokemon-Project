const toggleSidebarButton = document.querySelector('.toggle-sidebar-button');
const yourPokemonSidebar = document.getElementById('yourpokemon');
const pokemonimageyp = document.getElementById('yourpokemonimage');
let isSidebarOpen = false;
toggleSidebarButton.innerHTML = `<img src="${pokemonimageyp.src}">`;

function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
    if (isSidebarOpen) {
        yourPokemonSidebar.classList.add('show-sidebar');
        toggleSidebarButton.textContent = '✕';
    } else {
        yourPokemonSidebar.classList.remove('show-sidebar');
        toggleSidebarButton.innerHTML = `<img src="${pokemonimageyp.src}">`;
    }
}

document.querySelector('.main').addEventListener('click', function () {
    if (isSidebarOpen) {
        toggleSidebar();
    }
});