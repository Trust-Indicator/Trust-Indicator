document.addEventListener("DOMContentLoaded", function() {
    const accordionSelects = document.querySelectorAll('.accordion-select');
    let currentlyOpen;
    accordionSelects.forEach((select) => {
        select.addEventListener('change', function() {
            if (this.checked) {
                if (currentlyOpen) {
                    currentlyOpen.checked = false;
                }
                resetChangePasswordForm();
                resetForgotPasswordContent();
                currentlyOpen = this;
            } else {
                if (currentlyOpen === this) {
                    currentlyOpen = null;
                }

            }
        });
    });
    const inputs = document.querySelectorAll('input[type="tel"]');
    inputs.forEach((input, index) => {
        input.addEventListener('input', function(event) {
            console.log("Input event triggered on index: ", index);
            console.log("Current value: ", input.value);
            if (input.value.length === input.maxLength) {
                console.log("Max length reached on index: ", index);
                if (index + 1 < inputs.length) {
                    inputs[index + 1].focus();
                }
            }
        });
    });

});

function togglePasswordVisibility() {
    const passwordField = document.getElementById("new-password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('change-password-form').addEventListener('submit', change_password);
});
function change_password(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const old_pwd= document.getElementById('old-password').value;
    const new_password = document.getElementById('new-password').value;
    const confirm_password = document.getElementById('confirm-new-password').value;

    if (!new_password || !confirm_password) {
        showPromptChange('Password fields cannot be empty.');
        return false;
    }
    if (new_password.length < 8) {
        showPromptChange('Password must be at least 8 characters long.');
        return false;
    }
    if (!/[A-Z]/.test(new_password) || !/[0-9]/.test(new_password) || !/[a-z]/.test(new_password)) {
        showPromptChange('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
        return false;
    }
    if (new_password !== confirm_password) {
        showPromptChange('The new password does not match the re-entered password.');
        return false;
    }
    if (new_password === old_pwd) {
        showPromptChange('The new password should be different with old password.');
        return false;
    }
    fetch('/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'email': email,
            'old-password': old_pwd,
            'new-password': new_password,
            'confirm-new-password': confirm_password
        })
    })
    .then(response => response.json())
    .then(data => {
        showPromptChange(data.message);
    })
    .catch(error => {
        showPromptChange("An error occurred while changing the password.");
    });
}

function showPromptChange(message) {
    const prompt_text = document.querySelector('.wrong-prompt p');
    const prompt_box = document.querySelector('.wrong-prompt');
    prompt_box.style.display = 'block';
    prompt_text.textContent = message;
}
function showPromptForget(message) {
    const prompt_text = document.getElementById('error_forget').querySelector('p');
    const prompt_box = document.getElementById('error_forget');
    prompt_box.style.display = 'block';
    prompt_text.textContent = message;
}

function updateEmailAddress() {
    const emailInput = document.getElementById('reset-email-input').value;
    const emailDisplay = document.querySelector('.reset-page2-email');
    const emailDisplay2 = document.querySelector('.reset-page3-email');
    emailDisplay.textContent = emailInput;
    emailDisplay2.textContent = emailInput;
}

let currentDivIndex = 1;
let maxDivIndex = 4;
let globalToken = '';

function next_button() {
    switch(currentDivIndex) {
        case 1:
            showPromptForget("")
            const email = document.getElementById('reset-email-input').value;
            if (email.length === 0 || !email.includes('@')) {
                showPromptForget('Please enter a valid email address.');
                return;
            }
            console.log("Sending email for reset code.");
            sendCode(email);
            break;
        case 2:
            showPromptForget("")
            console.log("Verifying code.");
            break;
        case 3:
            showPromptForget("")
            const code = collectCode();
            if (code.length < 4) {
                showPromptForget("Please fill in all the fields.");
                return;
            }
            verifyCode(code);
            return;
    }

    if (currentDivIndex < maxDivIndex) {
        showPromptForget("");
        updateEmailAddress();
        document.getElementById(`reset-page${currentDivIndex}`).classList.add('hidden');
        currentDivIndex++;

        document.getElementById(`reset-page${currentDivIndex}`).classList.remove('hidden');
        const progressBar = document.getElementById(`progress-bar${currentDivIndex}`);
        if (progressBar) {
            progressBar.classList.add("active");
        }

        if (currentDivIndex === maxDivIndex) {
            document.querySelector(".next-button .button-text").innerText = "Submit";
            document.querySelector(".next-button").setAttribute("onclick", "submitNewPassword();");
        }
    } else {
        showPromptForget("");
        document.querySelector(".next-button").setAttribute("onclick", "next_button();");
        const newPassword = document.getElementById('reset-page4-password').value;
        if (newPassword.length < 8) {
            showPromptForget('Your password must be at least 8 characters.');
            return;
        }
        submitNewPassword();
    }
}
function sendCode(email) {
    fetch('/send-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            globalToken = data.token;
            onCodeSent();
        }
    })
    .catch(error => {
        showPromptForget(error);
    });
}
function onCodeSent() {
    const resendLink = document.getElementById('resend-link');
    startCooldown(60, resendLink);
    const display = document.getElementById('countdown');
    startCountdown(600, display)
}

let countdownInterval;
let cooldownInterval;
function startCountdown(duration, display) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    let timer = duration;
    countdownInterval = setInterval(function () {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdownInterval);
            display.textContent = "00:00";
            globalToken = null
        }
    }, 1000);
}
function startCooldown(duration, link) {
    if (cooldownInterval) {
        clearInterval(cooldownInterval);
    }

    link.classList.add('disabled');
    updateCooldownText(duration, link);

    cooldownInterval = setInterval(function () {
        duration -= 1;
        updateCooldownText(duration, link);

        if (duration <= 0) {
            clearInterval(cooldownInterval);
            cooldownInterval = null;
            link.classList.remove('disabled');
            link.textContent = 'Resend';
            link.addEventListener('click', resendCode);
        }
    }, 1000);
}
function updateCooldownText(duration, link) {
    link.textContent = `Resend (${duration})`;
}

function resendCode(event) {
    showPromptForget("")
    event.preventDefault();
    const email = document.getElementById('reset-email-input').value;
    const resendLink = document.getElementById('resend-link');

    if (email && !resendLink.classList.contains('disabled')) {
        sendCode(email);
    }
}

function verifyCode(userInputCode) {
    showPromptForget("")
    fetch('/verify-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: userInputCode, token: globalToken })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            moveToNextStep();
        } else {
            clearCode();
            showPromptForget(data.message);
        }
    })
    .catch(error => {
        showPromptForget("An error occurred while verifying the code.");
    });
}

function collectCode() {
    showPromptForget("")
    let code = "";
    for (let i = 1; i <= 4; i++) {
        code += document.getElementById(`verify-input${i}`).value.trim();
    }
    return code;
}

function clearCode() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`verify-input${i}`).value = "";
    }
}

function moveToNextStep() {
    showPromptForget("")
    if (currentDivIndex < maxDivIndex) {
        updateEmailAddress();
        document.getElementById(`reset-page${currentDivIndex}`).classList.add('hidden');
        currentDivIndex++;

        document.getElementById(`reset-page${currentDivIndex}`).classList.remove('hidden');
        const progressBar = document.getElementById(`progress-bar${currentDivIndex}`);
        if (progressBar) {
            progressBar.classList.add("active");
        }

        if (currentDivIndex === maxDivIndex) {
            document.querySelector(".next-button .button-text").innerText = "Submit";
            document.querySelector(".next-button").setAttribute("onclick", "submitNewPassword();");
        }
    } else {
        document.querySelector(".next-button").setAttribute("onclick", "next_button();");
        const newPassword = document.getElementById('reset-page4-password').value;
        if (newPassword.length < 8) {
            showPromptForget('Your password must be at least 8 characters.');
            return;
        }
        submitNewPassword();
    }
}


function submitNewPassword() {
    const email = document.getElementById('reset-email-input').value;
    const newPassword = document.getElementById('reset-page4-password').value;

    if (newPassword.length >= 8) {
        fetch('/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': email,
                'newPassword': newPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Password has been updated successfully.');
                window.location.href = '/login';
            } else {
                showPromptForget(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        showPromptForget('Your password must be at least 8 characters.');
    }
}

function resetChangePasswordForm() {
    const new_password = document.getElementById('new-password');
    const confirm_password = document.getElementById('confirm-new-password');
    const old_password = document.getElementById('old-password');
    const email = document.getElementById('email');
    const show_password = document.getElementById('show-password');
    const prompt_box = document.querySelector('.wrong-prompt');
    const passwordField = document.getElementById("new-password");

    new_password.value = '';
    confirm_password.value = '';
    old_password.value = '';
    email.value = '';
    show_password.checked = false;
    prompt_box.style.display = 'none';
    passwordField.type='password'
}
function resetForgotPasswordContent(){
    console.log('resetForgotPasswordContent is called');

    for (let i = 1; i <= maxDivIndex; i++) {
        console.log(document.getElementById(`progress-bar${i}`));
        const progressBar = document.getElementById(`progress-bar${i}`);
        progressBar.classList.remove("active");
    }
    for (let i = 1; i <= maxDivIndex; i++) {
        const page = document.getElementById(`reset-page${i}`);
        if (i === 1) {
            page.classList.remove("hidden");
        } else {
            page.classList.add("hidden");
        }
    }
    document.querySelector(".next-button .button-text").innerText = "Next";
    const email_input = document.getElementById('reset-email-input');
    email_input.value='';
    const inputs = document.querySelectorAll('input[type="tel"]');
    inputs.forEach(input => {
        input.value = '';
    });
    const password = document.getElementById('reset-page4-password');
    password.value='';
    currentDivIndex = 1;
}