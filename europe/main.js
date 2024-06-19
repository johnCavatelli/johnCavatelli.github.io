var curStartIndex = 0;
var metadata;
var metadataKeys;
var numPics;



const bar1Button = document.getElementById("bar1");
const romButton = document.getElementById("rom");
const floButton = document.getElementById("flo");
const budButton = document.getElementById("bud");
const berButton = document.getElementById("ber");
const amsButton = document.getElementById("ams");
const bar2Button = document.getElementById("bar2");

bar1.addEventListener("click", function () { ChangeImageRange(0,158) });
rom.addEventListener("click", function () { ChangeImageRange(159,235) });
flo.addEventListener("click", function () { ChangeImageRange(236,272) });
bud.addEventListener("click", function () { ChangeImageRange(273,326) });
ber.addEventListener("click", function () { ChangeImageRange(327,403) });
ams.addEventListener("click", function () { ChangeImageRange(404,449) });
bar2.addEventListener("click", function () { ChangeImageRange(450,520) });


Startup();
function Startup() {
    fetch('https://raw.githubusercontent.com/johnCavatelli/Website-Europe-Photos/main/metadata.json').then(response => response.json())
        .then(response => {
            metadata = response;
            numPics = Object.keys(metadata).length;            
            metadataKeys = Object.keys(metadata);
            metadataKeys.sort((a, b) => parseInt(a) - parseInt(b));

            //console.log(metadataKeys);
            //console.log("Pictures on site: " + numPics);
            // GetPageThumbnails();
            // GetImage(0);
            // for (let i = 0; i < 20; i++) {
            //     const butt = document.getElementById("thmb" + i);
            //     butt.addEventListener("click", function () { LoadImageModal(i) });
            // }

        })
}

function ChangeImageRange(startIndex, endIndex){
    var len = endIndex - startIndex + 1;
    curStartIndex = startIndex;
    for(let i = 0; i < len; i++){
        ChangeIndividualPhoto(i,startIndex);
    }
    ClearBlankThumbnails(len);
}

function ChangeIndividualPhoto(i,s){
    var photo = document.getElementById("img-" + i);
    var key = metadataKeys[s + i];
    //console.log(key + " index: " + i);
    var newImg = new Image;
    newImg.onload = function () {
        photo.src = this.src;
    }
    newImg.src = 'https://raw.githubusercontent.com/johnCavatelli/Website-Europe-Photos/main/thumbs/DSCN' + key + '.JPG';
}

function LoadFullImage(i){
    var key = metadataKeys[curStartIndex + i];
    //console.log(key + " index: " + i);
    if (key == null) { return false; }
    var _img = document.getElementById('main-img');
    var newImg = new Image;
    newImg.onload = function () {
        _img.src = this.src;
        return true;
    }
    newImg.src = 'https://raw.githubusercontent.com/johnCavatelli/Website-Europe-Photos/main/imgs/DSCN' + key + '.JPG';
}

document.addEventListener("DOMContentLoaded", function() {
    var container = document.getElementById("buttonContainer");
  
    for (let i = 0; i < 200; i++) {
      let button = document.createElement("button");
      button.className = "photo-button";
      button.id = "button-" + i;
  
      let img = document.createElement("img");
      img.id = "img-" + i;
      button.appendChild(img);
  
      button.addEventListener("click", function() {
        LoadFullImage(i);
      });
  
      container.appendChild(button);
    }
  });
  
  function OnPress(buttonIndex) {
    //console.log("Button " + buttonIndex + " was pressed");
    // Add your photo loading logic here
  }

  function ClearBlankThumbnails(startIndex) {
    for (let i = startIndex; i < 200; i++) {
        var _img = document.getElementById('img-' + (i));
        _img.setAttribute('src', '');
    }
}