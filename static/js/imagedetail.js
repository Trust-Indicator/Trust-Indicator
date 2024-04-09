window.onload = function() {
    var userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        document.querySelector(".sign-text").textContent = userEmail;
        document.querySelector("#show-name").textContent = "Hi  " + userEmail;
    }

    const urlParams = new URLSearchParams(window.location.search);
    let imageId = urlParams.get('source');

    const imageDisplay = document.querySelector(".image-display");
    const img = document.createElement('img');
    img.src = `/image/${imageId}`;
    img.className = "photo";
    imageDisplay.appendChild(img);

    loadImage(imageId)

    const zoomInButton = document.getElementById('zoomIn');
    const zoomOutButton = document.getElementById('zoomOut');
    let currentScale = 1;

    function resizeImageDisplay(increase) {
        const zoomFactor = 0.1;
        if (increase){
            if (currentScale < 1.5){
                currentScale = currentScale * (1 + zoomFactor);
                imageDisplay.style.transform = `scale(${currentScale})`;
            }
        }else{
            if (currentScale > 0.5){
                currentScale = currentScale / (1 + zoomFactor);
                imageDisplay.style.transform = `scale(${currentScale})`;
            }
        }
    }
    zoomInButton.addEventListener('click', () => resizeImageDisplay(true));
    zoomOutButton.addEventListener('click', () => resizeImageDisplay(false));
};
function loadImage(imageId){
    fetch(`/getimagedetail/${imageId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(imageDetail => {
        function updateMetadataOnPage(metadata) {
            const imageSizeElement = document.getElementById('metadata-ImageSize');
            const imageWidth = metadata['ImageWidth'] !== 'None' ? metadata['ImageWidth'] : 'None';
            const imageLength = metadata['ImageLength'] !== 'None' ? metadata['ImageLength'] : 'None';
            imageSizeElement.textContent = `${imageWidth} x ${imageLength}`;
            if(metadata['filename']) {
                document.getElementById('metadata-FileName').textContent = metadata['filename'];
            }
            if(metadata['filename']) {
                document.getElementById('metadata-FileType').textContent = "image/jpeg";
            }
            if(metadata['ColorSpace']) {
                document.getElementById('metadata-ColorSpace').textContent = metadata['ColorSpace'];
            }
            if(metadata['Created']) {
                document.getElementById('metadata-created').textContent = metadata['Created'];
            }

            if(metadata['Make']) {
                document.getElementById('metadata-Make').textContent = metadata['Make'];
            }
            if(metadata['Model']) {
                document.getElementById('metadata-Model').textContent = metadata['Model'];
            }
            if(metadata['FocalLength']) {
                document.getElementById('metadata-FocalLength').textContent = metadata['FocalLength'];
            }
            if(metadata['Aperture']) {
                document.getElementById('metadata-Aperture').textContent = metadata['Aperture'];
            }
            if(metadata['Exposure']) {
                document.getElementById('metadata-Exposure').textContent = metadata['Exposure'];
            }
            if(metadata['ISO']) {
                document.getElementById('metadata-ISO').textContent = metadata['ISO'];
            }
            if(metadata['Flash']) {
                document.getElementById('metadata-Flash').textContent = metadata['Flash'];
            }
            if(metadata['Altitude']) {
                document.getElementById('metadata-Altitude').textContent = metadata['Altitude'];
            }
            const LatitudeElement = document.getElementById('metadata-Latitude');
            const LatitudeRef = metadata['LatitudeRef'] !== 'None' ? metadata['LatitudeRef'] : 'No Ref';
            const Latitude = metadata['Latitude'] !== 'None' ? metadata['Latitude'] : 'No Latitude';

            if (metadata['LatitudeRef'] !== 'None' && metadata['Latitude'] !== 'None') {
                LatitudeElement.textContent = `${LatitudeRef}: ${Latitude}`;
            } else if (metadata['LatitudeRef'] !== 'None' && metadata['Latitude'] === 'None') {
                LatitudeElement.textContent = `${LatitudeRef}: No Latitude`;
            } else if (metadata['LatitudeRef'] === 'None' && metadata['Latitude'] !== 'None') {
                LatitudeElement.textContent = `No Ref: ${Latitude}`;
            } else {
                LatitudeElement.textContent = 'None';
            }

            const LongitudeElement = document.getElementById('metadata-Longitude');
            const LongitudeRef = metadata['LongitudeRef'] !== 'None' ? metadata['LongitudeRef'] : 'No Ref';
            const Longitude = metadata['Longitude'] !== 'None' ? metadata['Longitude'] : 'No Longitude';

            if (metadata['LongitudeRef'] !== 'None' && metadata['Longitude'] !== 'None') {
                LongitudeElement.textContent = `${LongitudeRef}: ${Longitude}`;
            } else if (metadata['LongitudeRef'] !== 'None' && metadata['Longitude'] === 'None') {
                LongitudeElement.textContent = `${LongitudeRef}: No Longitude`;
            } else if (metadata['LongitudeRef'] === 'None' && metadata['Longitude'] !== 'None') {
                LongitudeElement.textContent = `No Ref: ${Longitude}`;
            } else {
                LongitudeElement.textContent = 'None';
            }
        }
        updateMetadataOnPage(imageDetail);
    })
    .catch(error => {
        console.error('Error fetching the image details:', error);
    });
}