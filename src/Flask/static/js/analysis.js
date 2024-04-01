function sign_in(event) {
    event.stopPropagation();  // 阻止事件冒泡
    var userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        // 如果用户已登录，显示或隐藏签入内容
        const signInContent = document.querySelector('.sign-in-content');
        if (signInContent.style.display === 'block') {
            signInContent.style.display = 'none';
        } else {
            signInContent.style.display = 'block';
        }
    } else {
        // 如果用户未登录，跳转到登录页面
        window.location.href = "/login";
    }
    const dropdown = document.getElementById('language-options');
    dropdown.classList.add('hidden');
}
window.onload = function() {
    var userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        document.querySelector(".sign-text").textContent = userEmail;
        document.querySelector("#show-name").textContent = "Hi  " + userEmail;
    }
};

function sign_out_upload(event){
    event.stopPropagation();
    sessionStorage.removeItem('userEmail');
    document.querySelector(".sign-text").textContent = "Sign In";
    const signInContent = document.querySelector('.sign-in-content');
    signInContent.style.display = 'none';
    window.location.href="/";
}


let wasContentShown = false;
window.addEventListener('scroll', function() {
    let content = document.querySelector('.sign-in-content');
    if (window.scrollY > 0) {
        content.style.display = 'none';
    } else if (window.scrollY === 0 && wasContentShown) {
        content.style.display = 'block';
    }
});

function toggleDropdown(event) {
    event.stopPropagation();

    const dropdown = document.getElementById('language-options');
    const signInContent = document.querySelector('.sign-in-content');
    if(dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        signInContent.style.display = 'none';
    } else {
        dropdown.classList.add('hidden');
    }
    wasContentShown = false;
}
function updateLanguage(code, event) {
    const selectedLanguage = document.getElementById('selected-language');
    selectedLanguage.textContent = code;
    const dropdown = document.getElementById('language-options');
    dropdown.classList.add('hidden');
    event.stopPropagation();
}

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