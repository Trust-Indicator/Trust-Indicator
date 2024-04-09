
document.addEventListener('DOMContentLoaded', function() {
    fetch('/getimages').then(response => response.json()).then(data => {
        const gallery = document.querySelector('.photo-gallery');
        var firstIndicatorImages = ['5.png', '5.png', /* ... more icons ... */];
        var secondIndicatorImages = ['6.png', '6.png', /* ... more icons ... */];

        data.forEach(image => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo';

            const img = document.createElement('img');
            img.src = `/image/${image.id}`;  // Fetch the image from the server by image ID
            img.style.cursor = 'pointer';     // Change the cursor on hover to indicate this is clickable
            img.onclick = function() {        // Assign a function to the onclick event
                location.href = `/imagedetail?source=${image.id}`; // Redirect to the image detail page
            };
            console.log(img)
            photoDiv.appendChild(img);

            const indicatorsDiv = document.createElement('div');
            indicatorsDiv.className = 'photo-indicators';

            // Assuming firstIndicatorImages and secondIndicatorImages are available globally
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
    });
});

