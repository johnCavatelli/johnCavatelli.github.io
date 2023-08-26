
var pageIndex = 0;
var picsPerPage = 4;
var currentImage = 0;
var metadata;
var numPics;

const left_button = document.getElementById("lbutton");
const right_button = document.getElementById("rbutton");
const imageModal = document.getElementById("imgModal");
const closeModalButton = document.getElementById("close-modal-button");
const leftModalButton = document.getElementById("left-modal-button");
const rightModalButton = document.getElementById("right-modal-button");
left_button.addEventListener("click", function(){PageBackward()});
right_button.addEventListener("click", function(){PageForward()});
closeModalButton.addEventListener("click", function(){CloseImageModal()});
leftModalButton.addEventListener("click", function(){ModalImageBackward()});
rightModalButton.addEventListener("click", function(){ModalImageForward()});

Startup();

function Startup() {
    fetch('https://raw.githubusercontent.com/johnCavatelli/WebsiteKoreaPictures/main/metadata.json').then(response => response.json())
        .then(response => {
            metadata = response;
            numPics = Object.keys(metadata).length;
            //console.log(JSON.stringify(metadata));
            //console.log("Pictures on site: " + numPics);
            GetPageThumbnails();
            for(let i=0;i<9;i++){
                const butt = document.getElementById("thmb" + i);
                butt.addEventListener("click", function(){LoadImageModal(i)});
            }
        })
}

function ModalImageForward(){
    var nextPicture = currentImage + 1;
    if( nextPicture  < numPics ){//if next image exists
        if( nextPicture % picsPerPage < currentImage % picsPerPage ){//if we need to page forward do it
            PageForward();
        }
        GetImage(nextPicture);
        currentImage++;
    }
}

function ModalImageBackward(){
    var prevPicture = currentImage - 1;
    if( prevPicture  >= 0 ){//if next image exists
        if( prevPicture % picsPerPage > currentImage % picsPerPage ){//if we need to page forward do it
            PageBackward();
        }
        GetImage(prevPicture);
        currentImage--;
    }
}

function PageForward(){
    if( (pageIndex + 1) * picsPerPage < numPics ){
        pageIndex++;
        GetPageThumbnails();
    }
}

function LoadImageModal(index){
    const startIndex = pageIndex * picsPerPage;
    currentImage = index + startIndex
    GetImage(currentImage);
    imageModal.showModal();
}

function CloseImageModal(){
    var _img = document.getElementById('large-img');
    _img.setAttribute('src', '');
    imageModal.close();
}

function PageBackward(){
    if( (pageIndex - 1) * picsPerPage >= 0 ){
        pageIndex--;
        GetPageThumbnails();
    }
}

function GetImage(index) {
    var key = Object.keys(metadata)[index];
    console.log(key + " index: " + index);
    if (key == null){return false;}
    var _img = document.getElementById('large-img');
    var newImg = new Image;
    newImg.onload = function () {
        _img.src = this.src;
        return true;
    }
    newImg.src = 'https://raw.githubusercontent.com/johnCavatelli/WebsiteKoreaPictures/main/imgs/DSCN'+ key +'.JPG';
    return true;
}

function GetThumb(index) {
    var key = Object.keys(metadata)[index];
    console.log(key + " index: " + index);
    if (key == null){return false;}
    var _img = document.getElementById('thmb'+ (index%picsPerPage));
    var newImg = new Image;
    newImg.onload = function () {
        _img.src = this.src;
        return true;
    }
    newImg.src = 'https://raw.githubusercontent.com/johnCavatelli/WebsiteKoreaPictures/main/thumbs/DSCN'+ key +'.JPG';
    return true;
}

function ClearBlankThumbnails(startIndex){
    for (let i = startIndex; i < 18; i++) {
        var _img = document.getElementById('thmb'+ (i));
        _img.setAttribute('src', '');
    }
}

function GetPageThumbnails() {
    const startIndex = pageIndex * picsPerPage;
    for (let i = 0; i < picsPerPage; i++) {
        if(!GetThumb(startIndex + i)){
            ClearBlankThumbnails(i%picsPerPage);
            break;
        }
    }
}