function top_register() {
    window.location.href = "/signup";
}

function background_register() {
    window.location.href = "/signup";
}

function upload() {
    var userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        window.location.href = "/upload";
    } else {
        window.location.href = "/login";
    }
}

document.addEventListener('click', function(event) {
    const signInDiv = document.querySelector('.login-container');
    const signInContent = document.querySelector('.sign-in-content');
    const languageChangeDiv = document.querySelector('.language-change');
    const languageOptions = document.getElementById('language-options');

    if (signInContent.style.display === 'block' &&
        !signInDiv.contains(event.target) &&
        !signInContent.contains(event.target)) {
        signInContent.style.display = 'none';
        wasContentShown = false;
    }

    if (!languageChangeDiv.contains(event.target)) {
        languageOptions.classList.add('hidden');
    }
});

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

function sign_out(event){
    event.stopPropagation();
    sessionStorage.removeItem('userEmail');
    document.querySelector(".sign-text").textContent = "Sign In";
    const signInContent = document.querySelector('.sign-in-content');
    signInContent.style.display = 'none';
    window.location.href = "/logout";
}

function GotoImageHubs(event){
    window.location.href="https://en.wikipedia.org/wiki/Image_file_format";
}
function WhatIsJpeg(event){
    window.location.href="https://en.wikipedia.org/wiki/JPEG";
}
function BecomeMembership(event){
    window.location.href = "/signup";
}
function LearnMetaData(event){
     window.location.href="https://en.wikipedia.org/wiki/Metadata#:~:text=Metadata%20is%20defined%20as%20the,Time%20and%20date%20of%20creation";
}
document.addEventListener("DOMContentLoaded", function() {
    const changePasswordSection = document.getElementById('change-password');
    changePasswordSection.addEventListener('click', function() {
        window.location.href = 'changepassword';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const profile = document.getElementById('edit-profile');
    profile.addEventListener('click', function() {
        window.location.href = 'userprofile';
    });
});


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

document.addEventListener("DOMContentLoaded", function() {
    function rearrangeMenu() {
        var ul = document.querySelector('#mcmenu > ul');
        // 获取各个元素
        var home = document.getElementById('menu-home');
        var gallery = document.getElementById('menu-gallery');
        var watchList = document.getElementById('menu-watchlist');
        var help = document.getElementById('menu-help');
        var whatWeDo = document.getElementById('menu-wwhatwedo');
        var community = document.getElementById('menu-community');
        if(window.innerWidth <= 1000 && window.innerWidth >700) {

            ul.appendChild(home);
            ul.appendChild(watchList);
            ul.appendChild(whatWeDo);
            ul.appendChild(gallery);
            ul.appendChild(help);
            ul.appendChild(community);
        } else {
            ul.appendChild(home);
            ul.appendChild(gallery);
            ul.appendChild(watchList);
            ul.appendChild(help);
            ul.appendChild(whatWeDo);
            ul.appendChild(community);
        }
    }
    rearrangeMenu();
    window.addEventListener('resize', rearrangeMenu);


    var menuIconWrapper = document.querySelector('.menu-icon-wrapper');
    var sidebar = document.querySelector('.sidebar');
    var mainMenu = sidebar.querySelector('.main-menu');
    var submenus = sidebar.querySelectorAll('.submenu');
    var submenus1 = sidebar.querySelectorAll('.submenu1');
    var submenus2 = sidebar.querySelectorAll('.submenu2');
    var menuLinks = mainMenu.querySelectorAll('a[data-target]');

    if (menuIconWrapper) {
        menuIconWrapper.addEventListener('click', function() {
            var threeLine = this.querySelector('.three-line');

            if (threeLine.classList.contains('cross')) {
                threeLine.classList.remove('cross');
                sidebar.style.display = 'none'; // 关闭侧边栏
            } else {
                threeLine.classList.add('cross');
                sidebar.style.display = 'block'; // 打开侧边栏

                // 每次显示sidebar时，确保始终显示主菜单并隐藏所有子菜单
                mainMenu.style.display = 'block';
                submenus.forEach(function(submenu) {
                    submenu.style.display = 'none';
                });
                submenus1.forEach(function(submenu1) {
                    submenu1.style.display = 'none';
                });
                submenus2.forEach(function(submenu2) {
                    submenu2.style.display = 'none';
                });
            }
        });
    }

    menuLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            var targetMenuId = link.getAttribute('data-target');
            var targetMenu = sidebar.querySelector('#' + targetMenuId);
            if (targetMenu) {
                mainMenu.style.display = 'none';
                targetMenu.style.display = 'block';
            }
        });
    });

    var backLinks = sidebar.querySelectorAll('.back-to-main');
    backLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            mainMenu.style.display = 'block';
            submenus.forEach(function(submenu) {
                submenu.style.display = 'none';
            });
            submenus1.forEach(function(submenu1) {
                submenu1.style.display = 'none';
            });
            submenus2.forEach(function(submenu2) {
                submenu2.style.display = 'none';
            });
        });
    });
    var backFromGallery = document.querySelector('.back-from-gallery');
    if (backFromGallery) {
        backFromGallery.addEventListener('click', function(event) {
            event.preventDefault();
            mainMenu.style.display = 'block';
            submenus.forEach(function(submenu) {
                submenu.style.display = 'none';
            });
            submenus1.forEach(function(submenu1) {
                submenu1.style.display = 'none';
            });
            submenus2.forEach(function(submenu2) {
                submenu2.style.display = 'none';
            });
        });
    }
    var backFromHelp = document.querySelector('.back-from-help');
    if (backFromHelp) {
        backFromHelp.addEventListener('click', function(event) {
            event.preventDefault();
            mainMenu.style.display = 'block';
            submenus.forEach(function(submenu) {
                submenu.style.display = 'none';
            });
            submenus1.forEach(function(submenu1) {
                submenu1.style.display = 'none';
            });
            submenus2.forEach(function(submenu2) {
                submenu2.style.display = 'none';
            });
        });
    }
    var backFromCommunity = document.querySelector('.back-from-community');
    if (backFromCommunity) {
        backFromCommunity.addEventListener('click', function(event) {
            event.preventDefault();
            mainMenu.style.display = 'block';
            submenus.forEach(function(submenu) {
                submenu.style.display = 'none';
            });
            submenus1.forEach(function(submenu1) {
                submenu1.style.display = 'none';
            });
            submenus2.forEach(function(submenu2) {
                submenu2.style.display = 'none';
            });
        });
    }

    window.addEventListener('resize', function() {
        var threeLine = document.querySelector('.menu-icon-wrapper .three-line');
        if (window.innerWidth > 700) {
            // 隐藏sidebar
            document.querySelector('.sidebar').style.display = 'none';
            // 如果当前是错号，更改为横线
            if (threeLine.classList.contains('cross')) {
                threeLine.classList.remove('cross');
            }
        } else {
            // 如果sidebar是显示的，确保图标是错号
            if (document.querySelector('.sidebar').style.display === 'block' && !threeLine.classList.contains('cross')) {
                threeLine.classList.add('cross');
            }
        }
    });
});

function GotoGallery(event){
    window.location.href = "/gallery";
}
function GoToFeedback(event){
    window.location.href = "/feedback";
}

document.addEventListener('DOMContentLoaded', () => {
    let slides = document.querySelectorAll('.slide');
    let thumbnails = document.querySelectorAll('.thumbnail');
    let currentSlide = 0;

    let prevButton = document.querySelector('.prev');
    let nextButton = document.querySelector('.next');
    prevButton.addEventListener('click', () => changeSlide(-1));
    nextButton.addEventListener('click', () => changeSlide(1));
    function changeSlide(direction) {
        slides[currentSlide].style.opacity = 0;
        currentSlide = (currentSlide + slides.length + direction) % slides.length;
        slides[currentSlide].style.opacity = 1;
        setActiveSlide(currentSlide);
    }
    const setActiveSlide = (index) => {
        slides.forEach(slide => slide.style.opacity = 0);
        slides[index].style.opacity = 1;
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
    };

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', (e) => {
            let index = parseInt(e.target.getAttribute('data-index'));
            currentSlide = index;
            setActiveSlide(currentSlide);
        });
    });

    // Initial set up
    setActiveSlide(currentSlide);
});
