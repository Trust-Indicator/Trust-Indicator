function openModal() {
  document.getElementById('profilePhotoModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('profilePhotoModal').style.display = 'none';
}

window.onclick = function(event) {
  if (event.target === document.getElementById('profilePhotoModal')) {
    closeModal();
  }
}

document.addEventListener('DOMContentLoaded', function() {
    var selectableImages = document.querySelectorAll('.selectable-image');
    function clearSelection() {
        selectableImages.forEach(function(img) {
            img.classList.remove('selected');
        });
    }
    selectableImages.forEach(function(image) {
        image.addEventListener('click', function() {
            clearSelection(); // Clear any previous selections
            image.classList.add('selected');
        });
    });
    var exitButton = document.querySelector('.modal-options button:nth-child(2)');
    if(exitButton) {
        exitButton.addEventListener('click', function() {
            clearSelection();
            closeModal();
        });
    }
});

function saveSelection() {
    var selectedImageElement = document.querySelector('.selectable-image.selected');
    var imageSrc = selectedImageElement ? selectedImageElement.getAttribute('src') : '';
    var match = imageSrc.match(/(\d+)\.jpg$/);
    var selectedImageId = match ? match[1] : null;

    if (selectedImageElement){
        selectedImageElement.classList.remove('selected');
    }

    if (selectedImageId) {
        fetch('/change_profile_photo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: 'selected_image=' + encodeURIComponent(selectedImageId)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('user-profile-picture').src = imageSrc;

                showSuccessAlert(data.message);
                closeModal();
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            showErrorAlert(error.message);
        });
    } else {
        showErrorAlert('Please select an image before saving.');
    }
}

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

document.addEventListener('DOMContentLoaded', function() {
    fetch('/getcurrentuserimages').then(response => response.json()).then(data => {
        const gallery = document.getElementById('uploaded-images');
        var firstIndicatorImages = ['5.png', '5.png', /* ... more icons ... */];
        var secondIndicatorImages = ['6.png', '6.png', /* ... more icons ... */];

        if (data.length > 0) {
            document.getElementById("no-uploaded").style.display = "none"; // 改为display属性
            document.getElementById("uploaded-images-container").style.display = "block"; // 改为display属性

            data.forEach(image => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo';

                const img = document.createElement('img');
                img.src = `/image/${image.id}`;
                photoDiv.appendChild(img);

                const indicatorsDiv = document.createElement('div');
                indicatorsDiv.className = 'photo-indicators';

                const firstIndicator = document.createElement('div');
                firstIndicator.className = 'indicator';
                firstIndicator.style.backgroundImage = `url('/static/images/${firstIndicatorImages[1]}')`;
                firstIndicator.style.backgroundSize = 'cover';
                indicatorsDiv.appendChild(firstIndicator);

                const secondIndicator = document.createElement('div');
                secondIndicator.className = 'indicator';
                secondIndicator.style.backgroundImage = `url('/static/images/${secondIndicatorImages[0]}')`;
                secondIndicator.style.backgroundSize = 'cover';
                indicatorsDiv.appendChild(secondIndicator);

                photoDiv.appendChild(indicatorsDiv);
                gallery.appendChild(photoDiv);
            });
        } else {
            document.getElementById("no-uploaded").style.display = "block";
            document.getElementById("uploaded-images-container").style.display = "none";
        }
    })
    .catch(error => console.error('Error:', error));

    fetch('/getAllFavouritesByUser').then(response => response.json()).then(data => {
        const gallery = document.getElementById('favourite-images');
        var firstIndicatorImages = ['5.png', '5.png', /* ... more icons ... */];
        var secondIndicatorImages = ['6.png', '6.png', /* ... more icons ... */];

        if (data.length > 0) {
            document.getElementById("no-favourite").style.display = "none";
            document.getElementById("favourite-images-container").style.display = "block";

            data.forEach(image => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo';

                const img = document.createElement('img');
                img.src = `/image/${image.id}`;
                photoDiv.appendChild(img);

                const indicatorsDiv = document.createElement('div');
                indicatorsDiv.className = 'photo-indicators';

                const firstIndicator = document.createElement('div');
                firstIndicator.className = 'indicator';
                firstIndicator.style.backgroundImage = `url('/static/images/${firstIndicatorImages[1]}')`;
                firstIndicator.style.backgroundSize = 'cover';
                indicatorsDiv.appendChild(firstIndicator);

                const secondIndicator = document.createElement('div');
                secondIndicator.className = 'indicator';
                secondIndicator.style.backgroundImage = `url('/static/images/${secondIndicatorImages[0]}')`;
                secondIndicator.style.backgroundSize = 'cover';
                indicatorsDiv.appendChild(secondIndicator);

                photoDiv.appendChild(indicatorsDiv);
                gallery.appendChild(photoDiv);
            });
        } else {
            document.getElementById("no-favourite").style.display = "block";
            document.getElementById("favourite-images-container").style.display = "none";
        }
    })
    .catch(error => console.error('Error:', error));
});

