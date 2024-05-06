function AnalysisOtherImage(event){
    window.location.href='/upload'
}
function Gohome(event){
    window.location.href='/'
}


const imageDisplay = document.querySelector('.image-display');
const showImage = document.querySelector('.show-image');
const zoomInButton = document.getElementById('zoomIn');
const zoomOutButton = document.getElementById('zoomOut');

let currentScale = 1;
function resizeImageDisplay(increase) {
      let currentWidth = parseInt(getComputedStyle(imageDisplay).width);
      let currentHeight = parseInt(getComputedStyle(imageDisplay).height);
      let maxWidth = parseInt(getComputedStyle(showImage).width) * 0.9;
      let maxHeight = parseInt(getComputedStyle(showImage).height) * 0.9;
      let newWidth = increase ? currentWidth + 20 : currentWidth - 20;
      let newHeight = increase ? currentHeight + 20 : currentHeight - 20;
      newWidth = Math.min(newWidth, maxWidth);
      newHeight = Math.min(newHeight, maxHeight);
      newWidth = Math.max(newWidth, 200);
      newHeight = Math.max(newHeight, 200);
      imageDisplay.style.width = newWidth + 'px';
      imageDisplay.style.height = newHeight + 'px';
}
zoomInButton.addEventListener('click', () => resizeImageDisplay(true));
zoomOutButton.addEventListener('click', () => resizeImageDisplay(false));

function countdown() {
    var numberElement = document.querySelector('.number');
    var currentNumber = parseInt(numberElement.textContent, 10);

    if (currentNumber > 0) {
        numberElement.textContent = currentNumber - 1;
    } else {
        clearInterval(interval);
        document.querySelector('.warpper-wait').style.display="none";
        document.querySelector('.result').style.display="flex";
    }
}
var interval = setInterval(countdown, 1000);


let score_original = 90;
let score_aigc = 10;
let score_manipulation = 0;

let scoreNormalized_original = score_original;
let scoreNormalized_aigc = score_aigc;
let scoreNormalized_manipulation = score_manipulation;


document.querySelector('#circle-Original').style.strokeDasharray = `${scoreNormalized_original}, 100`;
document.querySelector('#percentage-Original').textContent = `${score_original}%`;

document.querySelector('#circle-AIGC').style.strokeDasharray = `${scoreNormalized_aigc}, 100`;
document.querySelector('#percentage-AIGC').textContent = `${score_aigc}%`;

document.querySelector('#circle-Manipulation').style.strokeDasharray = `${scoreNormalized_manipulation}, 100`;
document.querySelector('#percentage-Manipulation').textContent = `${score_manipulation}%`;

// signal 替换
var firstIndicatorImages = ['5.png', '5.png', /* ... more icons ... */];
var secondIndicatorImages = ['6.png', '6.png', /* ... more icons ... */];
document.getElementById("signal1").style.backgroundImage = `url('/static/images/${firstIndicatorImages[1]}')`;
document.getElementById("signal1").style.backgroundSize = 'contain';
document.getElementById("signal1").style.backgroundRepeat = 'no-repeat';


document.getElementById("signal2").style.backgroundImage = `url('/static/images/${secondIndicatorImages[1]}')`;
document.getElementById("signal2").style.backgroundSize = 'contain';
document.getElementById("signal2").style.backgroundRepeat = 'no-repeat';


// show image
let downloadBlobUrl = null;
document.addEventListener('DOMContentLoaded', function() {
  const imageDisplayDiv = document.querySelector('.image-display');
  const downloadButton = document.getElementById('Download');

  fetch('/getImage')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();  // Get the image data as a blob
    })
    .then(imageBlob => {
      // Create a URL for the blob
      const imageObjectURL = URL.createObjectURL(imageBlob);
      downloadBlobUrl = imageObjectURL;
      // Set the URL as the background image of the div
      imageDisplayDiv.style.backgroundImage = `url('${imageObjectURL}')`;
      imageDisplayDiv.style.backgroundSize = 'cover';  // Ensure it covers the div
      imageDisplayDiv.style.backgroundPosition = 'center';  // Center the background image
      imageDisplayDiv.style.backgroundRepeat = 'no-repeat';  // Don't repeat the background image
    })
    .catch(error => console.error('Error fetching image:', error));
    downloadButton.addEventListener('click', function() {
    if (downloadBlobUrl) {

      const downloadLink = document.createElement('a');
      downloadLink.href = downloadBlobUrl;

      downloadLink.download = 'downloadedImage.jpg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      console.error('No image available for download');
    }
  });
});