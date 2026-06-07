document.addEventListener("DOMContentLoaded", function () {
    const fifa = document.getElementById("fifa");
    const fortnite = document.getElementById("fortnite");
    const lotr = document.getElementById("lotr");
    const mtg = document.getElementById("mtg");
    const legomasters = document.getElementById("legomasters");

    const allGames = [fifa, fortnite, lotr, mtg, legomasters];

    allGames.forEach(function (game) {
        game.addEventListener("click", function () {
            alert("Je kan hier niet aan deelnemen.");
        });
    });
});