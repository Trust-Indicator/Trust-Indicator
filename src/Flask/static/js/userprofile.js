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
            image.classList.add('selected'); // Add 'selected' class to clicked image
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


