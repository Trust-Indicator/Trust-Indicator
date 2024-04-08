
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
    fetch(`/login_function`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Logged in successfully') {
            sessionStorage.setItem('userEmail', email);
            window.location.href = '/';
        } else {
            wrong_prompt.textContent = data.message;
            wrong_prompt.style.display = 'block';
        }
    })
    .catch(error => {
        wrong_prompt.style.display = 'block';
    });
}
function sign_up(){
    window.location.href="/signup"
}
function access(){
    window.location.href="/changepassword"
}