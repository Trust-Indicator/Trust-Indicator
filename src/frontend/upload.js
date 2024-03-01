function top_register(){
    window.location.href="signup.html"
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
        window.location.href = "login.html";
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
    window.location.href="index.html";
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

    // when drag and drop, show preview image
    document.getElementById('file-input').addEventListener('change', function(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            previewImage(file);
        }
    });
    var dropBox = document.querySelector('.drop-box');
    var fileInput = document.getElementById('file-input');
    // Add event listeners for drag and drop
    ['dragenter', 'dragover'].forEach(eventName => {
        dropBox.addEventListener(eventName, preventDefaults, false);
    });

    ['drop'].forEach(eventName => {
        dropBox.addEventListener(eventName, handleDrop, false);
    });
    // Event listener for file input change
    fileInput.addEventListener('change', handleFiles);
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    ['dragenter', 'dragover', 'drop'].forEach(eventName => {
        dropBox.addEventListener(eventName, preventDefaults, false);
    });
    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    }
    function handleFiles(files) {
        if (files.length > 0) {
            previewImage(files[0]);
        }
    }
    function previewImage(file) {
        let reader = new FileReader();
        reader.onloadend = function() {
            dropBox.style.backgroundImage = 'url(' + reader.result + ')';

            dropBox.innerHTML = '<p>Uploaded Successfully</p>';
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    // Clicking on the dropBox will trigger the hidden file input dialog
    dropBox.addEventListener('click', function() {
        fileInput.click();
    });
    // when drag and drop, show preview image


    let styleStates = {
        uppercase: false,
        italic: false,
        underline: false
    };

    document.querySelector('.btn-uppercase').addEventListener('click', function() {
        toggleStyle('uppercase');
    });

    document.querySelector('.btn-italic').addEventListener('click', function() {
        toggleStyle('italic');
    });

    document.querySelector('.btn-underline').addEventListener('click', function() {
        toggleStyle('underline');
    });

    function toggleStyle(styleType) {
        styleStates[styleType] = !styleStates[styleType];
        applyStyle(styleType, styleStates[styleType]);
    }

    function applyStyle(styleType, apply) {
        const editableDiv = document.getElementById('contentEditableDiv');
        const selection = window.getSelection();
        const selectedText = selection.toString();

        let span = document.createElement('span');

        switch (styleType) {
            case 'uppercase':
                if (apply) {
                    span.innerText = selectedText.toUpperCase();
                } else {
                    span.innerText = selectedText.toLowerCase();
                }
                break;
            case 'italic':
                if (apply) {
                    span.style.fontStyle = 'italic';
                }
                span.innerText = selectedText;
                break;
            case 'underline':
                if (apply) {
                    span.style.textDecoration = 'underline';
                }
                span.innerText = selectedText;
                break;
        }

        if (span) {
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(span);
        }
    }
});





