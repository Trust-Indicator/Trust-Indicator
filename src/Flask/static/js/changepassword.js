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

function change_password(){
    const new_password=document.getElementById('new-password').value;
    const confirm_password=document.getElementById('confirm-new-password').value
    const prompt_text= document.querySelector('.wrong-prompt p');
    const prompt_box= document.querySelector('.wrong-prompt');
    if (new_password!==confirm_password){
        prompt_box.style.display='block'
        prompt_text.textContent='Please re-check the password you entered. The new password does not match the Re-enter password.'
    }
}

let currentDivIndex = 1;
let maxDivIndex = 4;
function next_button() {
    if (currentDivIndex < maxDivIndex) {
        document.getElementById(`reset-page${currentDivIndex}`).classList.add('hidden');
        currentDivIndex++;

        document.getElementById(`reset-page${currentDivIndex}`).classList.remove('hidden');

        const progressBar = document.getElementById(`progress-bar${currentDivIndex}`);
        if (progressBar) {
            progressBar.classList.add("active");
        }

        if (currentDivIndex === maxDivIndex) {
            document.querySelector(".next-button .button-text").innerText = "Submit";
        }
    } else {
        console.log("Form submitted");
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