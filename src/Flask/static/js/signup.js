
function show(){
    if ( document.getElementById('legalName_input').value){
        document.querySelector('.legal-name-reminder').style.display="none";

    }else{
        document.querySelector('.legal-name-reminder').style.display="block";
    }
}

function sign_up() {
    event.preventDefault();
    var usernameElement = document.getElementById('username_input');
    var emailElement = document.getElementById('email_input');
    var legalNameElement = document.getElementById('legalName_input');
    var passwordElement = document.getElementById('password_input');
    var confirmPasswordElement = document.getElementById('confirm_input');
    var messageElement = document.querySelector('.message');
    var username = usernameElement.value;
    var email = emailElement.value;
    var legalName = legalNameElement.value;
    var password = passwordElement.value;
    var confirmPassword = confirmPasswordElement.value;
    if (!username || !email || !legalName || !password || !confirmPassword) {
        messageElement.textContent = "All fields must be filled out!";
        messageElement.style.fontSize = "18px";
        messageElement.style.color = "#C4362E";
        return;
    }

    if (password !== confirmPassword) {
        messageElement.textContent = "Confirm password and password do not match!";
        passwordElement.value = "";
        confirmPasswordElement.value = "";
        messageElement.style.fontSize = "18px";
        messageElement.style.color = "#C4362E";
        return;
    }

    const signup = fetch('/register',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            UserName: username,
            Email: email,
            Password: password,
            LegalName: legalName
        })
    })
    .then(response => response.json())
    .then(data => {
    if (data.message === "User registered successfully.") {

        window.location.href = "/login";
    } else {
        messageElement.textContent = data.message;
        messageElement.style.fontSize = "18px";
        messageElement.style.color = "#C4362E";
    }
    })
    .catch(error => {
    console.error('Error:', error);
    messageElement.textContent = 'An error occurred while processing your request.';
    messageElement.style.fontSize = "18px";
    messageElement.style.color = "#C4362E";
    });
}

if (performance.navigation.type === 2) {
    location.reload(true);
}