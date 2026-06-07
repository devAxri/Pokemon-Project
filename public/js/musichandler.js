document.addEventListener('DOMContentLoaded', function () {

    let mp3File = "";

    switch (window.location.pathname) {
        case "/home":
            mp3File = "/music/home.mp3";
            break;

        case "/catch":
            mp3File = "/music/catch.mp3";
            break;

        case "/battler":
            mp3File = "/music/battler.mp3";
            break;

        case "/whosthatpokemon":
            mp3File = "/music/whosthatpokemon.mp3";
            break;

        case "/pokedex":
            mp3File = "/music/pokedex.mp3";
            break;

        default:
            mp3File = "/music/home.mp3";
            break;
    }

    var audio = new Audio(mp3File);
    audio.loop = true;

    let audioButton = document.getElementById('soundbutton');
    let audioButtonimg = document.getElementById('soundbuttonimg');

    function muteAudio() {
        audio.pause();
        audioButtonimg.src = "./assets/icon/soundbuttonoff.png";
        localStorage.setItem('audio', "no");
    }

    function resumeAudio() {
        audio.play();
        audioButtonimg.src = "./assets/icon/soundbuttonon.png";
        localStorage.setItem('audio', "yes");
    }

    let audioEnabled = localStorage.getItem('audio');
    if (audioEnabled == "yes") {
        audio.play();
        audioButtonimg.src = "./assets/icon/soundbuttonon.png";
    } else {
        audio.pause();
        audioButtonimg.src = "./assets/icon/soundbuttonoff.png";
    }

    audioButton.addEventListener('click', function () {
        if (audio.paused) {
            resumeAudio();
        } else {
            muteAudio();
        }
    });

});