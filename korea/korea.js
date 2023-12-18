var pageIndex = 0;
var picsPerPage = 20;
var currentImage = 0;
var metadata;
var metadataKeys;
var numPics;

//glsl canvas setup
const bg = document.getElementsByClassName('glslCanvas')[0];
bg.width = window.innerWidth;
bg.height = window.innerHeight;

const leftPagebutton = document.getElementById("l-button");
const rightPagebutton = document.getElementById("r-button");
const leftImageButton = document.getElementById("left-img-button");
const rightImageButton = document.getElementById("right-img-button");
const fourButton = document.getElementById("4btn");
const tenButton = document.getElementById("10btn");
const twentyButton = document.getElementById("20btn");
const imageDateField = document.getElementById("img-date");
const imageNameField = document.getElementById("img-name");
// const imageNicknameField = document.getElementById("img-nickname");
// const imageTagsField = document.getElementById("img-tags");
leftPagebutton.addEventListener("click", function () { PageBackward() });
rightPagebutton.addEventListener("click", function () { PageForward() });
leftImageButton.addEventListener("click", function () { MainImageBackward() });
rightImageButton.addEventListener("click", function () { MainImageForward() });
twentyButton.addEventListener("click", function () { ChangePicsPerPage(20) });
fourButton.addEventListener("click", function () { ChangePicsPerPage(4) });
tenButton.addEventListener("click", function () { ChangePicsPerPage(10) });

Startup();

function Startup() {
    fetch('https://raw.githubusercontent.com/johnCavatelli/WebsiteKoreaPictures/main/metadata.json').then(response => response.json())
        .then(response => {
            metadata = response;
            numPics = Object.keys(metadata).length;
            metadataKeys = Object.keys(metadata);
            metadataKeys.sort((a, b) => parseInt(a) - parseInt(b));
            
            // console.log(metadataKeys);
            //console.log("Pictures on site: " + numPics);
            GetPageThumbnails();
            GetImage(0);
            for (let i = 0; i < 20; i++) {
                const butt = document.getElementById("thmb" + i);
                butt.addEventListener("click", function () { LoadImageModal(i) });
            }

        })
}

function ChangePicsPerPage(i) {
    picsPerPage = i;
    GetPageThumbnails();
}

function GetPictureInfo(index) {
    var key = metadataKeys[index];
    console.log(metadata[key]);
    imageDateField.innerHTML = metadata[key].date ? metadata[key].date : "undated";
    imageNameField.innerHTML = metadata[key].name ? metadata[key].name : "unnamed";
    // imageNicknameField.innerHTML = metadata[key].nickname ? metadata[key].nickname : "nonick";
    // imageTagsField.innerHTML = metadata[key].tags ? metadata[key].tags : "notags";
}

function MainImageForward() {
    var nextPicture = currentImage + 1;
    if (nextPicture < numPics) {//if next image exists
        if (nextPicture % picsPerPage < currentImage % picsPerPage) {//if we need to page forward do it
            PageForward();
        }
        GetImage(nextPicture);
        GetPictureInfo(nextPicture);
        currentImage++;
    }
}

function MainImageBackward() {
    var prevPicture = currentImage - 1;
    if (prevPicture >= 0) {//if next image exists
        if (prevPicture % picsPerPage > currentImage % picsPerPage) {//if we need to page forward do it
            PageBackward();
        }
        GetImage(prevPicture);
        GetPictureInfo(prevPicture);
        currentImage--;
    }
}

function PageForward() {
    if ((pageIndex + 1) * picsPerPage < numPics) {
        pageIndex++;
        GetPageThumbnails();
    }
}

function LoadImageModal(index) {
    const startIndex = pageIndex * picsPerPage;
    currentImage = index + startIndex
    GetImage(currentImage);
    GetPictureInfo(currentImage);
}

function CloseImageModal() {
    var _img = document.getElementById('main-img');
    _img.setAttribute('src', '');
}

function PageBackward() {
    if ((pageIndex - 1) * picsPerPage >= 0) {
        pageIndex--;
        GetPageThumbnails();
    }
}

function GetImage(index) {
    var key = metadataKeys[index];
    // console.log(key + " index: " + index);
    if (key == null) { return false; }
    var _img = document.getElementById('main-img');
    var newImg = new Image;
    newImg.onload = function () {
        _img.src = this.src;
        return true;
    }
    newImg.src = 'https://raw.githubusercontent.com/johnCavatelli/WebsiteKoreaPictures/main/imgs/DSCN' + key + '.JPG';
    return true;
}

function GetThumb(index) {
    var key = metadataKeys[index];
    // console.log(key + " index: " + index);
    if (key == null) { return false; }
    var _img = document.getElementById('thmb' + (index % picsPerPage));
    var newImg = new Image;
    newImg.onload = function () {
        _img.src = this.src;
        return true;
    }
    newImg.src = 'https://raw.githubusercontent.com/johnCavatelli/WebsiteKoreaPictures/main/thumbs/DSCN' + key + '.JPG';
    return true;
}

function ClearBlankThumbnails(startIndex) {
    for (let i = startIndex; i < 20; i++) {
        var _img = document.getElementById('thmb' + (i));
        _img.setAttribute('src', '');
    }
}

function GetPageThumbnails() {
    const startIndex = pageIndex * picsPerPage;
    for (let i = 0; i < picsPerPage; i++) {
        if (!GetThumb(startIndex + i)) {
            ClearBlankThumbnails(i % picsPerPage);
            break;
        }
    }
    ClearBlankThumbnails(picsPerPage);
}