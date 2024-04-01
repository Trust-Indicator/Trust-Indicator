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
            console.log("Input event triggered on index: ", index); // 用于调试
            console.log("Current value: ", input.value);  // 用于调试
            if (input.value.length === input.maxLength) {
                console.log("Max length reached on index: ", index);  // 用于调试
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

function change_password() {
    const new_password = document.getElementById('new-password').value;
    const confirm_password = document.getElementById('confirm-new-password').value;
    const prompt_text = document.querySelector('.wrong-prompt p');
    const prompt_box = document.querySelector('.wrong-prompt');

    // 检查新密码和确认密码是否匹配
    if (new_password !== confirm_password) {
        prompt_box.style.display = 'block';
        prompt_text.textContent = 'Please re-check the password you entered. The new password does not match the re-entered password.';
        return false;
    } else {
        prompt_box.style.display = 'none';
    }
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
            const email = document.getElementById('reset-email-input').value;
            if (email.length === 0 || !email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }
            console.log("Sending email for reset code.");
            sendCode(email);
            break;
        case 2:
            console.log("Verifying code.");
            break;
        case 3:
            const code = collectCode();
            if (code.length < 4) {
                alert("Please fill in all the fields.");
                return;
            }
            verifyCode(code);
            return;
    }

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
            alert('Your password must be at least 8 characters.');
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
        console.error('Error:', error);
        alert("An error occurred while sending the code.");
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

    var timer = duration;
    countdownInterval = setInterval(function () {
        var minutes = parseInt(timer / 60, 10);
        var seconds = parseInt(timer % 60, 10);

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
    event.preventDefault();
    const email = document.getElementById('reset-email-input').value;
    const resendLink = document.getElementById('resend-link');

    if (email && !resendLink.classList.contains('disabled')) {
        sendCode(email);
    }
}

function verifyCode(userInputCode) {
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
            console.log("Code is correct.");
            moveToNextStep();
        } else {
            clearCode();
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while verifying the code.");
    });
}

function collectCode() {
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
            alert('Your password must be at least 8 characters.');
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
                email: email,
                newPassword: newPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Password has been updated successfully.');
                window.location.href = '/login';
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        alert('Your password must be at least 8 characters.');
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