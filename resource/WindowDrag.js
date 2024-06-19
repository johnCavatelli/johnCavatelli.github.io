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
