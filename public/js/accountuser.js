async function getPokemonImageUrlByName(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${name}`);
    const data = await response.json();
    let id = data.id.toString();

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

document.addEventListener("DOMContentLoaded", async function () {
    const accountUserButton1 = document.getElementById('accountUserButton1');
    const accountUserButton2 = document.getElementById('accountUserButton2');
    const accountUserButton3 = document.getElementById('accountUserButton3');
    const accountUserButton4 = document.getElementById('accountUserButton4');
    const accountUserButton5 = document.getElementById('accountUserButton5');

    const accountUserRight1 = document.getElementById('accountUserRight1');
    const accountUserRight2 = document.getElementById('accountUserRight2');
    const accountUserRight3 = document.getElementById('accountUserRight3');
    const accountUserRight4 = document.getElementById('accountUserRight4');

    const datestart = document.getElementById("datestart");
    const amountbattlesfought = document.getElementById("amountbattlesfought");
    const amountbattleswon = document.getElementById("amountbattleswon");
    const amountbattleslost = document.getElementById("amountbattleslost");
    const amountpokemoncaught = document.getElementById("amountpokemoncaught");

    const profileInfo = await fetch("/api/profileinfo");
    const profileInfoJson = await profileInfo.json();
    const badgeImgs = document.querySelectorAll('.badgeimg');
    badgeImgs.forEach(img => img.draggable = false);

    const allPokemon = await fetch("/api/getallpokemon");
    const allPokemonJson = await allPokemon.json();

    amountpokemoncaught.textContent = allPokemonJson.totalCaught;

    const unixTimestamp = profileInfoJson.dateStart;
    const formattedDate = formatUnixTimestampToLongDateString(unixTimestamp);

    datestart.textContent = formattedDate;
    amountbattlesfought.textContent = profileInfoJson.amountBattles;
    amountbattleswon.textContent = profileInfoJson.amountBattlesWin + "/" + profileInfoJson.amountBattles;
    amountbattleslost.textContent = profileInfoJson.amountBattlesLose + "/" + profileInfoJson.amountBattles;

    const submitpersonalinfoBtn = document.getElementById("submitpersonalinfo");
    const errorField = document.getElementById("errorField");

    document.getElementById("Gebruikersnaam").value = profileInfoJson.username;
    document.getElementById("email").value = profileInfoJson.email;

    const profilePic = document.getElementById("profilePic");
    profilePic.src = await getPokemonImageUrlByName(profileInfoJson.profilePic);

    let allPanels = [accountUserRight1, accountUserRight2, accountUserRight3, accountUserRight4];

    for (let i = 1; i < allPanels.length; i++) {
        allPanels[i].style.display = 'none';
    }

    accountUserButton1.addEventListener('click', function () {
        for (let i = 0; i < allPanels.length; i++) {
            allPanels[i].style.display = 'none';
        }

        accountUserRight1.style.display = 'block';
    });

    accountUserButton2.addEventListener('click', function () {
        for (let i = 0; i < allPanels.length; i++) {
            allPanels[i].style.display = 'none';
        }

        accountUserRight2.style.display = 'block';
    });

    accountUserButton3.addEventListener('click', function () {
        for (let i = 0; i < allPanels.length; i++) {
            allPanels[i].style.display = 'none';
        }

        accountUserRight3.style.display = 'block';
    });

    accountUserButton4.addEventListener('click', function () {
        for (let i = 0; i < allPanels.length; i++) {
            allPanels[i].style.display = 'none';
        }

        accountUserRight4.style.display = 'block';
    });

    accountUserButton5.addEventListener('click', function () {
        const confirmLogout = confirm('Are you sure you want to logout?');

        if (confirmLogout) {
            window.location.href = '/logout';
        }
    });

    submitpersonalinfoBtn.addEventListener('click', async function () {
        const username = document.getElementById("Gebruikersnaam").value;
        const email = document.getElementById("email").value;
        const result = await fetch("/api/change", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email }),
        });

        if (result.status === 200) {
            window.location.href = "/accountuser?state=success";
        }
    });

    const changepasswordbutton = document.getElementById("changepasswordbutton");

    const currentpassword = document.getElementById("currentPassword");
    const newpassword = document.getElementById("newPassword");
    const newpasswordrepeat = document.getElementById("repeatPassword");

    changepasswordbutton.addEventListener('click', async function () {
        await fetch("/api/changepassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentPassword: currentpassword.value, newpassword: newpassword.value, newpasswordrepeat: newpasswordrepeat.value }),
        })
    });

    const toggleMenuButton1 = document.getElementById('titlesectionbutton1');
    const toggleMenuButton2 = document.getElementById('titlesectionbutton2');
    const toggleMenuButton3 = document.getElementById('titlesectionbutton3');
    const toggleMenuButton4 = document.getElementById('titlesectionbutton4');
    const sideMenu = document.getElementById('accountUserLeft');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            sideMenu.classList.add('active');
        } else {
            sideMenu.classList.remove('active');
        }
    }

    toggleMenuButton1.addEventListener('click', toggleMenu);
    toggleMenuButton2.addEventListener('click', toggleMenu);
    toggleMenuButton3.addEventListener('click', toggleMenu);
    toggleMenuButton4.addEventListener('click', toggleMenu);

    const menuItems = document.querySelectorAll('#accountUserLeft li');
    menuItems.forEach(function (item) {
        item.addEventListener('click', function () {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    });

    function formatUnixTimestampToLongDateString(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    async function fetchAndDisplayBadges() {
        const response = await fetch("/api/getbadges");
        const datajson = await response.json();
        const allbadges = datajson.badgeList;

        const badges = [
            { id: 1, name: "Stone Badge", image: "../assets/images/badges/boulderBadge.png" },
            { id: 2, name: "Water Badge", image: "../assets/images/badges/cascadeBadge.png" },
            { id: 3, name: "Volcano Badge", image: "../assets/images/badges/volcanoBadge.png" },
            { id: 4, name: "Earth Badge", image: "../assets/images/badges/earthbadge.png" },
            { id: 5, name: "Fire Badge", image: "../assets/images/badges/fireBadge.png" },
            { id: 6, name: "Rainbow Badge", image: "../assets/images/badges/rainbowBadge.png" },
            { id: 7, name: "Soul Badge", image: "../assets/images/badges/soulbadge.png" },
            { id: 8, name: "Thunder Badge", image: "../assets/images/badges/thunderBadge.png" }
        ];

        const allbadgescontainer = document.getElementById("allBadges");
        allbadgescontainer.innerHTML = "";

        badges.forEach(badge => {
            const badgeSection = document.createElement("section");
            badgeSection.classList.add("badgeDisplay");

            const badgeImg = document.createElement("img");
            badgeImg.src = badge.image;
            badgeImg.addEventListener('dragstart', function (event) {
                event.preventDefault();
                return false;
            });
            badgeImg.classList.add("badgeimg");

            const badgeName = document.createElement("p");
            badgeName.textContent = badge.name;
            badgeName.classList.add("badgename");

            if (allbadges && allbadges.includes(badge.id)) {
                badgeSection.classList.add("earned");
            } else {
                badgeSection.classList.add("not-earned");
                badgeName.textContent = "Nog niet ontvangen";
                badgeName.style.fontStyle = "italic";
                badgeImg.style.filter = "brightness(0.0)";
            }

            badgeSection.appendChild(badgeImg);
            badgeSection.appendChild(badgeName);

            allbadgescontainer.appendChild(badgeSection);
        });
    }
    fetchAndDisplayBadges();

});