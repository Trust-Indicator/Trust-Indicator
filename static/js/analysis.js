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
    const zoomFactor = 0.1;
    if (increase){
        if (currentScale < 1.5){
            currentScale =  currentScale * (1 + zoomFactor);
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

// 设定分数
let score = 80; // 分数可以是从0到100的任何值
let scoreNormalized = score; // 分数在这里已经是百分比了

// 更新 SVG 的 stroke-dasharray 属性来反映当前分数
document.querySelector('#circle-Original').style.strokeDasharray = `${scoreNormalized}, 100`;
document.querySelector('#percentage-Original').textContent = `${score}%`;

document.querySelector('#circle-AIGC').style.strokeDasharray = `${scoreNormalized}, 100`;
document.querySelector('#percentage-AIGC').textContent = `${score}%`;

// signal 替换
var firstIndicatorImages = ['5.png', '5.png', /* ... more icons ... */];
var secondIndicatorImages = ['6.png', '6.png', /* ... more icons ... */];
document.getElementById("signal1").style.backgroundImage = `url('/static/images/${firstIndicatorImages[1]}')`;
document.getElementById("signal1").style.backgroundSize = 'cover';
document.getElementById("signal2").style.backgroundImage = `url('/static/images/${secondIndicatorImages[1]}')`;
document.getElementById("signal2").style.backgroundSize = 'cover';

// show image
let downloadBlobUrl = null; // 用于保存图像Blob URL的变量
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