const body = document.querySelector('body');
document.addEventListener("DOMContentLoaded", function () {
    let fullscreenPrompt = localStorage.getItem('fullscreenPrompt');

    if (!fullscreenPrompt) {
        localStorage.setItem('fullscreenPrompt', true);
        alert('Deze game is geoptimaliseerd voor fullscreen gebruik.\nDruk op F11 om fullscreen aan te zetten.');
    }
    else {
        body.style.minHeight = '100vh';
    }
});