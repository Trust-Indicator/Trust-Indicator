function showSuccessAlert(message) {
    var alertBox = createAlert(message);
    alertBox.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
    alertBox.classList.add('success-alert');
    document.body.prepend(alertBox);

    setTimeout(function() {
        fadeOutAlert(alertBox);
    }, 3000);
}

function showErrorAlert(message) {
    var alertBox = createAlert(message);
    alertBox.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
    alertBox.classList.add('error-alert');
    document.body.prepend(alertBox);

    setTimeout(function() {
        fadeOutAlert(alertBox);
    }, 5000);
}

function createAlert(message) {
    var alertBox = document.createElement('div');
    alertBox.textContent = message;
    alertBox.style.color = 'white';
    alertBox.style.padding = '15px';
    alertBox.style.margin = '15px';
    alertBox.style.borderRadius = '4px';
    alertBox.style.position = 'fixed';
    alertBox.style.left = '50%';
    alertBox.style.top = '20px';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    alertBox.style.transition = 'opacity 0.5s ease, top 0.5s ease';
    alertBox.style.zIndex = '1000';
    return alertBox;
}

function fadeOutAlert(alertBox) {
    alertBox.style.opacity = '0';
    alertBox.style.top = '10px';

    setTimeout(function() {
        alertBox.remove();
    }, 500);
}

window.onload = function() {
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('source') === 'debug') {
    document.getElementById('bugs-option').checked = true;
  }
};

document.addEventListener("DOMContentLoaded", function() {
    fetch('/get_current_user', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('name').value = data.name;
        document.getElementById('email').value = data.email;
    })
    .catch(error => {
        document.getElementById('name').value = "";
        document.getElementById('email').value = "";
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const feedbackForm = document.querySelector('.feedback-form form');

    feedbackForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(feedbackForm);
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    const feedbackTypeSelected = Array.from(document.querySelectorAll('input[name="feedback-type"]')).some(radio => radio.checked);

    if (!feedbackTypeSelected) {
        showErrorAlert('Please select a feedback type before submitting.');
        return;
    }

    fetch('/submit_feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: formDataJsonString
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showSuccessAlert(data.message);
            document.getElementById('feedback').value = '';
            document.querySelectorAll('input[name="feedback-type"]').forEach((radio) => {
                radio.checked = false;
            });
        } else {
            showErrorAlert(data.message);
        }
    })
    .catch(error => {
        showErrorAlert('An error occurred. Please try again.');
    });
    });
});