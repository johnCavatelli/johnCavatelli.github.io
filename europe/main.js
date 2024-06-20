var curStartIndex = 0;
var curImageIndex = 0;
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
const imgName = document.getElementById("imgName");
const imgDate = document.getElementById("imgDate");
const leftImageButton = document.getElementById("prevImg");
const rightImageButton = document.getElementById("nextImg");

bar1.addEventListener("click", function () { ChangeImageRange(0,158) });
rom.addEventListener("click", function () { ChangeImageRange(159,235) });
flo.addEventListener("click", function () { ChangeImageRange(236,272) });
bud.addEventListener("click", function () { ChangeImageRange(273,326) });
ber.addEventListener("click", function () { ChangeImageRange(327,403) });
ams.addEventListener("click", function () { ChangeImageRange(404,449) });
bar2.addEventListener("click", function () { ChangeImageRange(450,520) });
leftImageButton.addEventListener("click", function() {LoadPrevFullImage()});
rightImageButton.addEventListener("click", function() {LoadNextFullImage()});


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

function LoadNextFullImage(){
    curImageIndex = curImageIndex + 1;
    if(curImageIndex >= numPics){
        curImageIndex = 0;
    }
    console.log("here " + curImageIndex);

    LoadFullImage();
}

function LoadPrevFullImage(){
    curImageIndex = curImageIndex - 1;
    if(curImageIndex < 0){
        curImageIndex = numPics - 1;
    }
    LoadFullImage();
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
    if(typeof i !== "undefined"){//if the offset is passed then we're using the buttons on the page and need to update the current image index
        console.log("here " + i);
        curImageIndex = curStartIndex + i;
    }
    var key = metadataKeys[curImageIndex];
    //console.log(key + " index: " + i);
    if (key == null) { return false; }
    var _img = document.getElementById('main-img');
    var newImg = new Image;
    newImg.onload = function () {
        _img.src = this.src;
        return true;
    }
    newImg.src = 'https://raw.githubusercontent.com/johnCavatelli/Website-Europe-Photos/main/imgs/DSCN' + key + '.JPG';
    imgDate.innerHTML = metadata[key].date ? metadata[key].date : "undated";
    imgName.innerHTML = metadata[key].name ? metadata[key].name : "unnamed";
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



////////CLOCK


function updateDateTime() {
    // create a new `Date` object
    const now = new Date();

    // get the current date and time as a string
    const currentDateTime = now.toLocaleString();

    // update the `textContent` property of the `span` element with the `id` of `datetime`
    document.querySelector('#datetime').textContent = currentDateTime;
  }

  // call the `updateDateTime` function every second
  setInterval(updateDateTime, 1000);


  /////////Taskbar

  document.getElementById("taskbaricons").onmousemove = e => {
    for(const card of document.getElementsByClassName("taskbarbutton")) {
      const taskbarIcon = card.querySelector(".taskbaricon");
      
      if (taskbarIcon) {
        const canvas = document.createElement("canvas");
        canvas.width = taskbarIcon.clientWidth;
        canvas.height = taskbarIcon.clientHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(taskbarIcon, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  
        let totalR = 0, totalG = 0, totalB = 0;
        for (let i = 0; i < imageData.length; i += 4) {
          totalR += imageData[i];
          totalG += imageData[i + 1];
          totalB += imageData[i + 2];
        }
        const numPixels = imageData.length / 4; // Each pixel has 4 values (R, G, B, Alpha)
  
        const averageR = Math.round(totalR / numPixels);
        const averageG = Math.round(totalG / numPixels);
        const averageB = Math.round(totalB / numPixels);
  
        const brightnessMultiplier = 1.5; // Adjust this value for desired brightness
        const brighterR = Math.min(255, averageR * brightnessMultiplier);
        const brighterG = Math.min(255, averageG * brightnessMultiplier);
        const brighterB = Math.min(255, averageB * brightnessMultiplier);
        
        const brighterColor = `rgb(${brighterR}, ${brighterG}, ${brighterB})`;
        
        card.style.setProperty("--img-colour", brighterColor);
      }
      
      const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
  
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };
  }







  //Window Drag

  dragElement(document.getElementById("window"));
dragElement(document.getElementById("window2"));
var maxZ = 1;//this is so fucking ratchet lol

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var isDragging = false;


  //document.getElementById(elmnt.id).onmousedown = bringToFront(elmnt.id);
  elmnt.addEventListener("mousedown", function () {bringToFront(elmnt.id) });
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    document.getElementById(elmnt.id + "header").addEventListener('touchstart', dragTouchStart, { passive: false });
  } else {
    elmnt.onmousedown = dragMouseDown;
    elmnt.addEventListener('touchstart', dragTouchStart, { passive: false });
  }

  function bringToFront(id){
    console.log("MOVING " + id);
    document.getElementById(id).style.zIndex = maxZ;
    maxZ = maxZ + 1;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    var hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
    if (hoveredElement.tagName.toLowerCase() === 'button') {
      hoveredElement.focus();
      return;
    }
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function dragTouchStart(e) {
    e = e || window.event;
    var touch = e.touches[0];
    var hoveredElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (hoveredElement.tagName.toLowerCase() === 'button') {
      hoveredElement.focus();
      return;
    }
    e.preventDefault();
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    document.addEventListener('touchend', closeDragElement);
    document.addEventListener('touchmove', elementDrag, { passive: false });
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    if (e.type === 'mousemove') {
      var clientX = e.clientX;
      var clientY = e.clientY;
    } else if (e.type === 'touchmove') {
      var clientX = e.touches[0].clientX;
      var clientY = e.touches[0].clientY;
    }
    
    if (!isDragging) {
      isDragging = true; // Start dragging only when the mouse or touch moves away from a button
    }

    if (isDragging) {
      pos1 = pos3 - clientX;
      pos2 = pos4 - clientY;
      pos3 = clientX;
      pos4 = clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.removeEventListener('touchend', closeDragElement);
    document.removeEventListener('touchmove', elementDrag);
    isDragging = false;
  }
}
