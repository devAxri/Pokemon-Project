const form = document.getElementById('actualRegisterForm');

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const captchaResponse = grecaptcha.getResponse();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordRepeat = document.getElementById("passwordRepeat").value;

    const errorField = document.getElementById("errorField");

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, passwordRepeat, captchaResponse })
        });

        if (response.status === 201) {
            window.location.href = "/home";
        } else {
            grecaptcha.reset();

            const responseData = await response.json();
            errorField.textContent = responseData.error;
        }

    } catch (error) {
        console.error("Error registering user:", error);
        alert("An error occurred while registering user. Please try again later.");
    }
});