
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sortOrder = urlParams.get('sort');
    if (sortOrder === 'asce') {
        fetchSortedImages('asce');
    } else {
        fetchDefaultImages();
    }
});

let sortOrder = 'default';

function fetchDefaultImages(){
    sortOrder = 'default';
    fetch('/getimages').then(response => response.json()).then(data => {
        const gallery = document.querySelector('.photo-gallery');
        var firstIndicatorImages = ['5.png', '5.png', /* ... more icons ... */];
        var secondIndicatorImages = ['6.png', '6.png', /* ... more icons ... */];
        gallery.innerHTML = "<div class=\"photo\" style=\"display: none\">\n" +
                    "                <div class=\"photo-indicators\">\n" +
                    "                    <div class=\"indicator\"></div>\n" +
                    "                    <div class=\"indicator\"></div>\n" +
                    "                </div>\n" +
                    "            </div>"

        data.forEach(image => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo';

            const img = document.createElement('img');
            img.src = `/image/${image.id}`;  // Fetch the image from the server by image ID
            img.style.cursor = 'pointer';     // Change the cursor on hover to indicate this is clickable
            img.onclick = function () {        // Assign a function to the onclick event
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
}

function fetchSortedImages(sort){
    if (sort === "asce"){
        sortOrder = "asce"
        toggleSort()
    }
}

function toggleSort() {
    const sortIcon = document.getElementById('sortIcon');
    const sortLink = document.getElementById('sortLink');

    if (sortOrder === 'desc') {
        // Currently sorted in descending, switch to ascending
        fetch('/images/sortByTimeAsce')
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Process the data as needed
                sortIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: auto"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 7L3 10M6 7L9 10" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';
                sortOrder = 'asce';

                const gallery = document.querySelector('.photo-gallery');
                gallery.innerHTML = "<div class=\"photo\" style=\"display: none\">\n" +
                    "                <div class=\"photo-indicators\">\n" +
                    "                    <div class=\"indicator\"></div>\n" +
                    "                    <div class=\"indicator\"></div>\n" +
                    "                </div>\n" +
                    "            </div>"
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
            })
            .catch(error => console.error('Error:', error));
    } else {
        // Currently sorted in ascending, switch to descending
        fetch('/images/sortByTimeDesc')
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Process the data as needed
                sortIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: auto"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 17L3 14M6 17L9 14" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';
                sortOrder = 'desc';

                const gallery = document.querySelector('.photo-gallery');
                gallery.innerHTML = "<div class=\"photo\" style=\"display: none\">\n" +
                    "                <div class=\"photo-indicators\">\n" +
                    "                    <div class=\"indicator\"></div>\n" +
                    "                    <div class=\"indicator\"></div>\n" +
                    "                </div>\n" +
                    "            </div>"
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
            })
            .catch(error => console.error('Error:', error));
    }
}
