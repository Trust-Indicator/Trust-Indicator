
function sign_in(event){
    event.preventDefault();
    const passwordField = document.getElementById('password_field');
    const emailField = document.getElementById('email_field');
    const password_prompt = document.getElementById('password_prompt');
    const email_prompt = document.getElementById('email_prompt');
    const wrong_prompt = document.querySelector('.wrong-prompt');
    const email = emailField.value;
    const password = passwordField.value;
    if (passwordField.value === '') {
        console.log('Password is empty');
        password_prompt.style.display = 'block';
        setTimeout(function() {
            password_prompt.style.display = 'none';
        }, 2000);
    }
    if (emailField.value === '') {
        console.log('Password is empty');
        email_prompt.style.display = 'block';
        setTimeout(function() {
            email_prompt.style.display = 'none';
        }, 2000);
    }
    if (emailField.value === '' & passwordField.value === '') {
        console.log('Password is empty');
        email_prompt.style.display = 'block';
        password_prompt.style.display = 'none';
        setTimeout(function() {
            email_prompt.style.display = 'none';
        }, 2000);
    }
    fetch(`http://tecko.org:5001/user/login?email=${email}&password=${password}`, {
        method: "POST",
        headers: {
            'accept': 'text/plain'
        }
    })
        .then(response => {
            if (response.status === 200) {
                sessionStorage.setItem('userEmail', email);
                window.location.href = "index.html";
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error("There was an error:", error);
            wrong_prompt.style.display = "block";
        });

}
function sign_up(){
    window.location.href="signup.html"
}
function access(){
    window.location.href="changepassword.html"
}