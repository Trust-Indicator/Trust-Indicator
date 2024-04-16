
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sortOrder = urlParams.get('sort');
    if (sortOrder === 'asce') {
        fetchSortedImages('asce');
    } else {
        fetchDefaultImages();
    }
});

let sortOrder = '';
let filter = '';

function fetchDefaultImages(){
    sortOrder = '';
    const sortIcon = document.getElementById('sortIcon');
    sortIcon.innerHTML = `<i class="fas fa-sort"></i> Publish Time`;
    fetch(`/images/sortByTag?tag=${encodeURIComponent(filter)}`).then(response => response.json()).then(data => {
        updateGallery(data);
    });
}

function fetchAllImages(){
    sortOrder = '';
    filter = '';
    const sortIcon = document.getElementById('sortIcon');
    sortIcon.innerHTML = `<i class="fas fa-sort"></i> Publish Time`;
    fetch(`/images/sortByTag?tag=${encodeURIComponent(filter)}`).then(response => response.json()).then(data => {
        updateGallery(data);
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

    if (sortOrder === 'desc') {
        sortOrder = "asce"
        sortIcon.innerHTML = `<i class="fas fa-sort-up"></i> Publish Time`
        fetch(`/images/sortByTimeAsce?tag=${encodeURIComponent(filter)}`)
            .then(response => response.json())
            .then(data => {
                updateGallery(data);
            })
            .catch(error => console.error('Error:', error));
    } else {
        sortOrder = "desc"
        sortIcon.innerHTML = `<i class="fas fa-sort-down"></i> Publish Time`
        fetch(`/images/sortByTimeDesc?tag=${encodeURIComponent(filter)}`)
            .then(response => response.json())
            .then(data => {
                updateGallery(data);
            })
            .catch(error => console.error('Error:', error));
    }
}

function fetchSortedImagesByType(tag) {
    filter = tag
    fetch(`/images/sortByTag?tag=${encodeURIComponent(filter)}`)
        .then(response => response.json())
        .then(data => {
            const sortIcon = document.getElementById('sortIcon');
            sortIcon.innerHTML = `<i class="fas fa-sort"></i> Publish Time`;
            updateGallery(data);
        })
        .catch(error => console.error('Failed to load images:', error));
}

function updateGallery(data){
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
        img.src = `/image/${image.id}`;
        img.style.cursor = 'pointer';
        img.onclick = function () {
            location.href = `/imagedetail?source=${image.id}`;
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
}